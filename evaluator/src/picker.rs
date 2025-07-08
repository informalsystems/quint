//! Picking values out of sets without enumerating the elements.

use crate::value::{powerset_at_index, ImmutableMap, Value};
use std::{convert::TryInto, rc::Rc};

impl Value {
    /// Pick a value from the set, using the given indexes, without enumerating
    /// the elements (and thus avoiding expensive computations).
    ///
    /// The given indexes should have the same length as the length [`bounds`]
    /// for this value, and each value should be within its respective bound.
    pub fn pick<T: Iterator<Item = usize> + ?Sized>(&self, indexes: &mut T) -> Value {
        match self {
            Value::Set(set) => {
                let index = indexes
                    .next()
                    .expect("Internal error: too few positions. Report a bug");
                set.iter().collect::<Vec<_>>()[index].clone()
            }
            Value::Interval(start, end) => {
                let index = indexes
                    .next()
                    .expect("Internal error: too few positions. Report a bug");
                let idx: i64 = <usize as TryInto<i64>>::try_into(index).unwrap();
                assert!(idx <= end - start);
                Value::Int(start + idx)
            }
            Value::CrossProduct(sets) => {
                Value::Tuple(sets.iter().map(|value| value.pick(indexes)).collect())
            }
            Value::PowerSet(base_set) => {
                let index = indexes
                    .next()
                    .expect("Internal error: too few positions. Report a bug");
                powerset_at_index(&base_set.as_set(), index)
            }
            Value::MapSet(domain, range) => {
                // TODO return an RC for a closure that takes a value and returns the picked valuee
                // And save this RC in the bounds thing
                let domain_size = domain.cardinality();
                let range_size = range.cardinality();

                if domain_size == 0 {
                    // To reflect the behaviour of TLC, an empty domain needs to give Set(Map()),
                    // so the only element we can pick is Map().
                    return Value::Map(ImmutableMap::default());
                }

                assert!(range_size > 0, "Range can't be zero");

                let keys = domain.as_set();
                let key_values = keys.iter().map(|key| {
                    let value = range.pick(indexes);
                    (key.clone(), value)
                });

                Value::Map(ImmutableMap::from_iter(key_values))
            }
            _ => panic!("Not a set"),
        }
    }

    pub fn get_pick_closure(self) -> Rc<dyn Fn(&mut dyn Iterator<Item = usize>) -> Value> {
        match self {
            Value::Set(set) => Rc::new(move |indexes| {
                let index = indexes
                    .next()
                    .expect("Internal error: too few positions. Report a bug");
                set.iter().collect::<Vec<_>>()[index].clone()
            }),
            Value::Interval(start, end) => Rc::new(move |indexes| {
                let index = indexes
                    .next()
                    .expect("Internal error: too few positions. Report a bug");
                let idx: i64 = <usize as TryInto<i64>>::try_into(index).unwrap();
                assert!(idx <= end - start);
                Value::Int(start + idx)
            }),
            Value::CrossProduct(sets) => {
                let closures = sets
                    .into_iter()
                    .map(|value| value.get_pick_closure())
                    .collect::<Vec<_>>()
                    .clone();
                Rc::new(move |indexes| Value::Tuple(closures.iter().map(|c| c(indexes)).collect()))
            }
            Value::PowerSet(base_set) => {
                Rc::new(move |indexes| {
                    // TODO
                    let index = indexes
                        .next()
                        .expect("Internal error: too few positions. Report a bug");
                    powerset_at_index(&base_set.as_set(), index)
                })
            }
            Value::MapSet(domain, range) => {
                // TODO return an RC for a closure that takes a value and returns the picked valuee
                // And save this RC in the bounds thing
                let domain_size = domain.cardinality();
                let range_size = range.cardinality();

                if domain_size == 0 {
                    // To reflect the behaviour of TLC, an empty domain needs to give Set(Map()),
                    // so the only element we can pick is Map().
                    return Rc::new(|_| Value::Map(ImmutableMap::default()));
                }

                assert!(range_size > 0, "Range can't be zero");

                let keys = domain.as_set().into_owned();
                Rc::new(move |indexes| {
                    let key_values = keys.iter().map(|key| {
                        let value = range.pick(indexes);
                        (key.clone(), value)
                    });

                    Value::Map(ImmutableMap::from_iter(key_values))
                })
            }
            _ => panic!("Not a set"),
        }
    }

    // Some sets require multiple random numbers in order to pick an element efficiently.
    // For example, a cross product will require one random number per set, and return a tuple like
    // (set1.pick(r1), set2.pick(r2), ..., setn.pick(rn)). The `bounds` function will return the list of
    // ranges (bounds) from which each of those numbers should be picked from.
    pub fn bounds(&self) -> Vec<usize> {
        match self {
            Value::Set(set) => vec![set.len()],
            Value::Interval(_, _) => vec![self.cardinality()],
            Value::CrossProduct(sets) => sets.iter().map(|set| set.cardinality()).collect(),
            Value::PowerSet(base_set) => vec![base_set.cardinality()],
            Value::MapSet(domain, range) => {
                // Cardinality of range repeated domain times
                vec![range.cardinality(); domain.cardinality()]
            }
            _ => panic!("Not a set"),
        }
    }
}
