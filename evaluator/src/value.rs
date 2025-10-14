//! This module defines the [`Value`] enum, which represents the various types
//! of values that can be created during evaluation of Quint expressions. All
//! values can be converted to Quint expressions.
//!
//! Quint's evaluation is lazy in some intermediate steps, and will avoid
//! enumerating as much as it can. For example, sometimes sets are created just
//! to pick elements from them, so instead of enumerating the set, the evaluator
//! just generates one element corresponding to that pick.
//!
//! All Quint's values are immutable by nature, so the `imbl` crate's data
//! structures are used to represent those values and properly optimize
//! operations for immutability. This has significant performance impact.
//!
//! We use `fxhash::FxBuildHasher` for the hash maps and sets, as it guarantees
//! that iterators over identical sets/maps will always return the same order,
//! which is important for the `Hash` implementation (as identical sets/maps
//! should have the same hash).

use crate::evaluator::{CompiledExpr, Env, EvalResult};
use crate::ir::QuintName;
use imbl::shared_ptr::RcK;
use imbl::{GenericHashMap, GenericHashSet, GenericVector};
use itertools::Itertools;
use std::borrow::Cow;
use std::cell::RefCell;
use std::fmt;
use std::hash::{Hash, Hasher};
use std::ops::Deref;
use std::rc::Rc;

/// Quint values that hold sets are immutable, use `GenericHashSet` immutable
/// structure to hold them
pub type ImmutableSet<T> = GenericHashSet<T, fxhash::FxBuildHasher, RcK>;
/// Quint values that hold vectors are immutable, use `GenericVector` immutable
/// structure to hold them
pub type ImmutableVec<T> = GenericVector<T, RcK>;
/// Quint values that hold maps are immutable, use `GenericHashMap` immutable
/// structure to hold them
pub type ImmutableMap<K, V> = GenericHashMap<K, V, fxhash::FxBuildHasher, RcK>;

/// Quint strings are immutable, use hipstr's HipStr type, which provides
/// inlined (stack allocated) strings of length up to 23 bytes, and cheap clones
/// for longer strings.
pub type Str = hipstr::HipStr<'static>;

/// A Quint value produced by evaluation of a Quint expression.
/// Values are immutable and reference-counted for cheap cloning.
#[derive(Clone, Debug)]
pub struct Value(pub Rc<ValueInner>);

/// The actual value enum wrapped in Rc for cheap cloning.
/// Can be seen as a normal form of the expression, except for the intermediate
/// values that enable lazy evaluation of some potentially expensive expressions.
#[derive(Debug, Clone)]
pub enum ValueInner {
    Int(i64),
    Bool(bool),
    Str(Str),
    Set(ImmutableSet<Value>),
    Tuple(ImmutableVec<Value>),
    Record(ImmutableMap<QuintName, Value>),
    Map(ImmutableMap<Value, Value>),
    List(ImmutableVec<Value>),
    Lambda(Vec<Rc<RefCell<EvalResult>>>, CompiledExpr),
    Variant(QuintName, Value),
    // "Intermediate" values using during evaluation to avoid expensive computations
    Interval(i64, i64),
    CrossProduct(Vec<Value>),
    PowerSet(Value),
    MapSet(Value, Value),
}

impl Hash for Value {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.as_ref().hash(state);
    }
}

impl Hash for ValueInner {
    fn hash<H: Hasher>(&self, state: &mut H) {
        // First, hash the discriminant, as we want hashes of Set(1, 2, 3) and
        // List(1, 2, 3) to be different.
        let discr = core::mem::discriminant(self);
        discr.hash(state);

        match self {
            ValueInner::Int(n) => n.hash(state),
            ValueInner::Bool(b) => b.hash(state),
            ValueInner::Str(s) => s.hash(state),
            ValueInner::Set(set) => {
                for elem in set {
                    elem.hash(state);
                }
            }
            ValueInner::Tuple(elems) => {
                for elem in elems {
                    elem.hash(state);
                }
            }
            ValueInner::Record(fields) => {
                for (name, value) in fields {
                    name.hash(state);
                    value.hash(state);
                }
            }
            ValueInner::Map(map) => {
                for (key, value) in map {
                    key.hash(state);
                    value.hash(state);
                }
            }
            ValueInner::List(elems) => {
                for elem in elems {
                    elem.hash(state);
                }
            }
            ValueInner::Lambda(_, _) => {
                panic!("Cannot hash lambda");
            }
            ValueInner::Variant(label, value) => {
                label.hash(state);
                value.hash(state);
            }
            ValueInner::Interval(start, end) => {
                start.hash(state);
                end.hash(state);
            }
            ValueInner::CrossProduct(sets) => {
                for value in sets {
                    value.hash(state);
                }
            }
            ValueInner::PowerSet(value) => {
                value.hash(state);
            }
            ValueInner::MapSet(a, b) => {
                a.hash(state);
                b.hash(state);
            }
        }
    }
}

impl PartialEq for Value {
    fn eq(&self, other: &Self) -> bool {
        self.0.as_ref() == other.0.as_ref()
    }
}

impl PartialEq for ValueInner {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Self::Int(a), Self::Int(b)) => a == b,
            (Self::Bool(a), Self::Bool(b)) => a == b,
            (Self::Str(a), Self::Str(b)) => a == b,
            (Self::Set(a), Self::Set(b)) => *a == *b,
            (Self::Tuple(a), Self::Tuple(b)) => *a == *b,
            (Self::Record(a), Self::Record(b)) => *a == *b,
            (Self::Map(a), Self::Map(b)) => *a == *b,
            (Self::List(a), Self::List(b)) => *a == *b,
            (Self::Lambda(_, _), Self::Lambda(_, _)) => panic!("Cannot compare lambdas"),
            (Self::Variant(a_label, a_value), Self::Variant(b_label, b_value)) => {
                a_label == b_label && a_value == b_value
            }
            (Self::Interval(a_start, a_end), Self::Interval(b_start, b_end)) => {
                a_start == b_start && a_end == b_end
            }
            (Self::CrossProduct(a), Self::CrossProduct(b)) => *a == *b,
            (Self::PowerSet(a), Self::PowerSet(b)) => *a == *b,
            (Self::MapSet(a1, b1), Self::MapSet(a2, b2)) => a1 == a2 && b1 == b2,
            // To compare two sets represented in different ways, we need to enumerate them both
            _ => {
                let self_value = Value(Rc::new(self.clone()));
                let other_value = Value(Rc::new(other.clone()));
                if self_value.is_set() && other_value.is_set() {
                    self_value.as_set() == other_value.as_set()
                } else {
                    false
                }
            }
        }
    }
}

impl Eq for Value {}
impl Eq for ValueInner {}

impl Deref for Value {
    type Target = ValueInner;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Value {
    // Constructor functions for Value
    pub fn int(n: i64) -> Self {
        Value(Rc::new(ValueInner::Int(n)))
    }

    pub fn bool(b: bool) -> Self {
        Value(Rc::new(ValueInner::Bool(b)))
    }

    pub fn str(s: Str) -> Self {
        Value(Rc::new(ValueInner::Str(s)))
    }

    pub fn set(s: ImmutableSet<Value>) -> Self {
        Value(Rc::new(ValueInner::Set(s)))
    }

    pub fn tuple(t: ImmutableVec<Value>) -> Self {
        Value(Rc::new(ValueInner::Tuple(t)))
    }

    pub fn record(r: ImmutableMap<QuintName, Value>) -> Self {
        Value(Rc::new(ValueInner::Record(r)))
    }

    pub fn map(m: ImmutableMap<Value, Value>) -> Self {
        Value(Rc::new(ValueInner::Map(m)))
    }

    pub fn list(l: ImmutableVec<Value>) -> Self {
        Value(Rc::new(ValueInner::List(l)))
    }

    pub fn lambda(registers: Vec<Rc<RefCell<EvalResult>>>, body: CompiledExpr) -> Self {
        Value(Rc::new(ValueInner::Lambda(registers, body)))
    }

    pub fn variant(name: QuintName, value: Value) -> Self {
        Value(Rc::new(ValueInner::Variant(name, value)))
    }

    pub fn interval(start: i64, end: i64) -> Self {
        Value(Rc::new(ValueInner::Interval(start, end)))
    }

    pub fn cross_product(values: Vec<Value>) -> Self {
        Value(Rc::new(ValueInner::CrossProduct(values)))
    }

    pub fn power_set(value: Value) -> Self {
        Value(Rc::new(ValueInner::PowerSet(value)))
    }

    pub fn map_set(a: Value, b: Value) -> Self {
        Value(Rc::new(ValueInner::MapSet(a, b)))
    }
    /// Calculate the cardinality of the value without having to enumerate it
    /// (i.e. without calling `as_set`).
    pub fn cardinality(&self) -> usize {
        match self.0.as_ref() {
            ValueInner::Set(set) => set.len(),
            ValueInner::Tuple(elems) => elems.len(),
            ValueInner::Record(fields) => fields.len(),
            ValueInner::Map(map) => map.len(),
            ValueInner::List(elems) => elems.len(),
            ValueInner::Interval(start, end) => (end - start + 1).try_into().unwrap(),
            ValueInner::CrossProduct(sets) => {
                sets.iter().fold(1, |acc, set| acc * set.cardinality())
            }
            ValueInner::PowerSet(value) => {
                // 2^(cardinality of value)
                2_usize.pow(value.cardinality().try_into().unwrap())
            }
            ValueInner::MapSet(domain, range) => {
                // (cardinality of range)^(cardinality of domain()
                range
                    .cardinality()
                    .pow(domain.cardinality().try_into().unwrap())
            }
            _ => panic!("Cardinality not implemented for {self:?}"),
        }
    }

    /// Check for membership of a value in a set, without having to enumerate
    /// the set.
    pub fn contains(&self, elem: &Value) -> bool {
        match (self.0.as_ref(), elem.0.as_ref()) {
            (ValueInner::Set(elems), _) => elems.contains(elem),
            (ValueInner::Interval(start, end), ValueInner::Int(n)) => start <= n && n <= end,
            (ValueInner::CrossProduct(sets), ValueInner::Tuple(elems)) => {
                sets.len() == elems.len()
                    && sets.iter().zip(elems).all(|(set, elem)| set.contains(elem))
            }
            (ValueInner::PowerSet(base), ValueInner::Set(elems)) => {
                let base_elems = base.as_set();
                elems.len() <= base_elems.len()
                    && elems.iter().all(|elem| base_elems.contains(elem))
            }
            (ValueInner::MapSet(domain, range), ValueInner::Map(map)) => {
                let map_domain = Value::set(map.keys().cloned().collect::<ImmutableSet<_>>());
                // Check if domains are equal and all map values are in the range set
                map_domain == *domain && map.values().all(|v| range.contains(v))
            }
            _ => panic!("contains not implemented for {self:?}"),
        }
    }

    /// Check if a set is a subset of another set, avoiding enumeration when possible
    pub fn subseteq(&self, superset: &Value) -> bool {
        match (self.0.as_ref(), superset.0.as_ref()) {
            (ValueInner::Set(subset), ValueInner::Set(superset)) => subset.is_subset(superset),
            (
                ValueInner::Interval(subset_start, subset_end),
                ValueInner::Interval(superset_start, superset_end),
            ) => subset_start >= superset_start && subset_end <= superset_end,
            (ValueInner::CrossProduct(subsets), ValueInner::CrossProduct(supersets)) => {
                subsets.len() == supersets.len()
                    && subsets
                        .iter()
                        .zip(supersets)
                        .all(|(subset, superset)| subset.subseteq(superset))
            }
            (ValueInner::PowerSet(subset), ValueInner::PowerSet(superset)) => {
                subset.subseteq(superset)
            }
            (
                ValueInner::MapSet(subset_domain, subset_range),
                ValueInner::MapSet(superset_domain, superset_range),
            ) => subset_domain == superset_domain && subset_range.subseteq(superset_range),
            // Fall back to the native implementation (`is_subset`) if no optimization is possible
            (_, _) => self.as_set().is_subset(superset.as_set().as_ref()),
        }
    }

    /// Convert an integer value to `i64`. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    pub fn as_int(&self) -> i64 {
        match self.0.as_ref() {
            ValueInner::Int(n) => *n,
            _ => panic!("Expected integer"),
        }
    }

    /// Convert a boolean value to `bool`. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    pub fn as_bool(&self) -> bool {
        match self.0.as_ref() {
            ValueInner::Bool(b) => *b,
            _ => panic!("Expected boolean"),
        }
    }

    /// Convert a string value to `Str`. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    pub fn as_str(&self) -> Str {
        match self.0.as_ref() {
            ValueInner::Str(s) => s.clone(),
            _ => panic!("Expected string"),
        }
    }

    /// Checks whether a value is a set. This includes the intermediate values
    /// that are also sets, just not enumerated yet.
    pub fn is_set(&self) -> bool {
        matches!(
            self.0.as_ref(),
            ValueInner::Set(_)
                | ValueInner::Interval(_, _)
                | ValueInner::CrossProduct(_)
                | ValueInner::PowerSet(_)
                | ValueInner::MapSet(_, _)
        )
    }

    /// Enumerate the value as a set. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    ///
    /// Sometimes, we need to create a value from scratch, and other times, we
    /// operate over the borroweed value (&self). So this returns a
    /// clone-on-write (Cow) pointer, avoiding unnecessary clones that would be
    /// required if we always wanted to return Owned data.
    pub fn as_set(&self) -> Cow<'_, ImmutableSet<Value>> {
        match self.0.as_ref() {
            ValueInner::Set(set) => Cow::Borrowed(set),
            ValueInner::Interval(start, end) => {
                Cow::Owned((*start..=*end).map(Value::int).collect())
            }
            ValueInner::CrossProduct(sets) => {
                let size = self.cardinality();
                if size == 0 {
                    // an empty set produces the empty product
                    return Cow::Owned(ImmutableSet::default());
                }

                #[allow(clippy::unnecessary_to_owned)] // False positive
                let product_sets = sets
                    .iter()
                    .map(|set| set.as_set().into_owned().into_iter().collect::<Vec<_>>())
                    .multi_cartesian_product()
                    .map(|product| Value::tuple(ImmutableVec::from(product)))
                    .collect::<ImmutableSet<_>>();

                Cow::Owned(product_sets)
            }

            ValueInner::PowerSet(value) => {
                let base = value.as_set();
                let size = 1 << base.len(); // 2^n subsets for a set of size n
                Cow::Owned(
                    (0..size)
                        .map(|i| powerset_at_index(base.as_ref(), i))
                        .collect(),
                )
            }

            ValueInner::MapSet(domain, range) => {
                if domain.cardinality() == 0 {
                    // To reflect the behaviour of TLC, an empty domain needs to give Set(Map())
                    return Cow::Owned(
                        std::iter::once(Value::map(ImmutableMap::default())).collect(),
                    );
                }

                if range.cardinality() == 0 {
                    // To reflect the behaviour of TLC, an empty range needs to give Set()
                    return Cow::Owned(ImmutableSet::default());
                }
                let domain_vec = domain.as_set().iter().cloned().collect::<Vec<_>>();
                let range_vec = range.as_set().iter().cloned().collect::<Vec<_>>();

                let nindices = domain_vec.len();
                let nvalues = range_vec.len();

                let nmaps = nvalues.pow(nindices.try_into().unwrap());

                let mut result_set = ImmutableSet::new();

                for i in 0..nmaps {
                    let mut pairs = Vec::with_capacity(nindices);
                    let mut index = i;
                    for key in domain_vec.iter() {
                        pairs.push((key.clone(), range_vec[index % nvalues].clone()));
                        index /= nvalues;
                    }
                    result_set.insert(Value::map(ImmutableMap::from_iter(pairs)));
                }

                Cow::Owned(result_set)
            }
            _ => panic!("Expected set"),
        }
    }

    /// Convert a map value to a map. Panics if the wrong type is given, which
    /// should never happen as input expressions are type-checked.
    pub fn as_map(&self) -> &ImmutableMap<Value, Value> {
        match self.0.as_ref() {
            ValueInner::Map(map) => map,
            _ => panic!("Expected map"),
        }
    }

    /// Convert a list or a tuple value to a vector. Panics if the wrong type is
    /// given, which should never happen as input expressions are type-checked.
    pub fn as_list(&self) -> &ImmutableVec<Value> {
        match self.0.as_ref() {
            ValueInner::Tuple(elems) => elems,
            ValueInner::List(elems) => elems,
            _ => panic!("Expected list, got {self:?}"),
        }
    }

    /// Convert a record value to a map. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    pub fn as_record_map(&self) -> &ImmutableMap<QuintName, Value> {
        match self.0.as_ref() {
            ValueInner::Record(fields) => fields,
            _ => panic!("Expected record"),
        }
    }

    /// Convert a lambda value to a closure. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    pub fn as_closure(&self) -> impl Fn(&mut Env, Vec<Value>) -> EvalResult + '_ {
        match self.0.as_ref() {
            ValueInner::Lambda(registers, body) => move |env: &mut Env, args: Vec<Value>| {
                args.into_iter().enumerate().for_each(|(i, arg)| {
                    *registers[i].borrow_mut() = Ok(arg);
                });

                body.execute(env)
                // FIXME: restore previous values (#1560)
            },
            _ => panic!("Expected lambda"),
        }
    }

    /// Convert a variant value to a tuple like (label, value). Panics if the
    /// wrong type is given, which should never happen as input expressions are
    /// type-checked.
    pub fn as_variant(&self) -> (&QuintName, &Value) {
        match self.0.as_ref() {
            ValueInner::Variant(label, value) => (label, value),
            _ => panic!("Expected variant"),
        }
    }

    /// Convert a tuple value to a 2-element tuple. Panics if the wrong type is given,
    /// which should never happen as input expressions are type-checked.
    ///
    /// Useful as some builtins expect tuples of 2 elements, so we have type
    /// guarantees that this conversion will work and can avoid having to handle
    /// other scenarios.
    pub fn as_tuple2(&self) -> (Value, Value) {
        let mut elems = self.as_list().iter();
        (elems.next().unwrap().clone(), elems.next().unwrap().clone())
    }
}

/// Get the corresponding element of a powerset of a set at a given index
/// following a stable algorithm and avoiding enumeration. Calling this with the
/// same index for the same set should yield the same result.
///
/// Powersets are not ordered, but the iterator over the set will always produce
/// the same order (for identical sets), so this works. It doesn't matter which
/// order this uses, as long as it is stable.
///
/// In practice, the index comes from a stateful random number generator, and we
/// want the same seed to produce the same results.
pub fn powerset_at_index(base: &ImmutableSet<Value>, i: usize) -> Value {
    let mut elems = ImmutableSet::default();
    for (j, elem) in base.iter().enumerate() {
        // membership condition, numerical over the indexes i and j
        if (i & (1 << j)) != 0 {
            elems.insert(elem.clone());
        }
    }
    Value::set(elems)
}

/// Display implementation, used for debugging only. Users should not need to see a [`Value`].
impl fmt::Display for Value {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> std::fmt::Result {
        match self.0.as_ref() {
            ValueInner::Int(n) => write!(f, "{n}"),
            ValueInner::Bool(b) => write!(f, "{b}"),
            ValueInner::Str(s) => write!(f, "{s:?}"),
            ValueInner::Set(_)
            | ValueInner::Interval(_, _)
            | ValueInner::CrossProduct(_)
            | ValueInner::PowerSet(_)
            | ValueInner::MapSet(_, _) => {
                write!(f, "Set(")?;
                for (i, set) in self.as_set().iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{set:#}")?;
                }
                write!(f, ")")
            }
            ValueInner::Tuple(elems) => {
                write!(f, "(")?;
                for (i, elem) in elems.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{elem:#}")?;
                }
                write!(f, ")")
            }
            ValueInner::Record(fields) => {
                write!(f, "{{ ")?;
                for (i, (name, value)) in fields.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{name}: {value:#}")?;
                }
                write!(f, " }}")
            }
            ValueInner::Map(map) => {
                write!(f, "Map(")?;
                for (i, (key, value)) in map.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "Tup({key:#}, {value:#})")?;
                }
                write!(f, ")")
            }
            ValueInner::List(elems) => {
                write!(f, "List(")?;
                for (i, elem) in elems.iter().enumerate() {
                    if i > 0 {
                        write!(f, ", ")?;
                    }
                    write!(f, "{elem:#}")?;
                }
                write!(f, ")")
            }
            ValueInner::Lambda(_, _) => write!(f, "<lambda>"),
            ValueInner::Variant(label, value) => {
                if let ValueInner::Tuple(elems) = value.0.as_ref() {
                    if elems.is_empty() {
                        return write!(f, "{label}");
                    }
                }
                write!(f, "{label}({value:#})")
            }
        }
    }
}
