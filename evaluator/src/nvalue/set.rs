use super::{Repr, Value};
use itertools::{structs::MultiProduct, Itertools};
use std::hash::{Hash, Hasher};
use std::ops::RangeInclusive;
use std::rc::Rc;

type HashSet = std::collections::HashSet<Value, fxhash::FxBuildHasher>;

#[derive(Eq, PartialEq, Clone, Debug)]
pub enum Set {
    CrossProduct(Vec<Set>),
    Interval(i64, i64),
}

impl From<Set> for Value {
    fn from(set: Set) -> Self {
        Value(Repr::Set(set))
    }
}

impl Value {
    fn as_set(&self) -> &Set {
        match &self.0 {
            Repr::Set(set) => set,
            _ => panic!("not a set"),
        }
    }

    pub fn cardinality(&self) -> usize {
        self.as_set().cardinality()
    }

    pub fn as_set_iter(&self) -> impl Iterator<Item = Value> + Clone + '_ {
        self.as_set().iter()
    }
}

impl Set {
    fn cardinality(&self) -> usize {
        match self {
            Set::CrossProduct(sets) => sets.iter().fold(1, |acc, set| acc * set.cardinality()),
            Set::Interval(start, end) => (end - start + 1) as usize,
        }
    }

    fn iter<'a>(&'a self) -> SetIter<'a> {
        match self {
            Self::Interval(start, end) => SetIter::Interval(*start..=*end),
            Self::CrossProduct(sets) => {
                let sets = sets.iter().map(Set::iter);
                SetIter::CrossProduct(sets.multi_cartesian_product())
            }
        }
    }
}

impl Hash for Set {
    fn hash<H: Hasher>(&self, state: &mut H) {
        core::mem::discriminant(self).hash(state);
        todo!();
    }
}

#[derive(Clone)]
enum SetIter<'a> {
    CrossProduct(MultiProduct<SetIter<'a>>),
    Interval(RangeInclusive<i64>),
}

impl<'a> Iterator for SetIter<'a> {
    type Item = Value;

    fn next(&mut self) -> Option<Self::Item> {
        match self {
            Self::CrossProduct(iter) => iter.next().map(Value::tuple),
            Self::Interval(iter) => iter.next().map(Value::int),
        }
    }
}

pub fn cross_product(sets: Vec<Value>) -> Value {
    let sets: Vec<_> = sets.iter().map(Value::as_set).cloned().collect();
    Value::from(Set::CrossProduct(sets))
}

pub fn interval(start: i64, end: i64) -> Value {
    Value::from(Set::Interval(start, end))
}
