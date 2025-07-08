//! Compilation for Quint's built-in operators.
//!
//! Lazy and eager operators are compiled differently. Eager operators are those
//! where the arguments are evaluated before the operator is applied, while lazy
//! operators need to hold off on evaluating their arguments until they are
//! actually needed. This is important for operators like `ite` (if-then-else)
//! where evaluating the wrong block can lead to runtime errors. For example, consider
//!
//! ```quint
//! if (x != 0) 10 / x else 0
//! ```
//!
//! If we try to eagerly evaluate `10 / x` before checking that `x != 0`, this
//! will register a runtime error. This would also be undesirable if one of the
//! blocks contains computational-intensive expressions.
//!
//! The types for the compiled operators then also need to be different, as
//! eager ops will be compiled into closures that take [`Value`] arguments,
//! while lazy ops will be compiled into closures that take colusures as
//! arguments (which should be called to evaluate each argument).

use crate::evaluator::{CompiledExprWithArgs, CompiledExprWithLazyArgs};
use crate::ir::QuintError;
use crate::value::{ImmutableMap, ImmutableSet, ImmutableVec, Value};
use fxhash::FxHashSet;
use itertools::Itertools;
use std::rc::Rc;

/// A list of operators that need to be compiled lazily (with `compile_lazy_op`).
pub const LAZY_OPS: [&str; 13] = [
    "assign",
    "actionAny",
    "actionAll",
    "ite",
    "matchVariant",
    "oneOf",
    "and",
    "or",
    "next",
    "implies",
    "then",
    "reps",
    "expect",
];
/// Compile an operator in a lazy way, where the arguments should only be
/// evaluated when needed.
pub fn compile_lazy_op(op: &str) -> CompiledExprWithLazyArgs {
    CompiledExprWithLazyArgs::from_fn(match op {
        "and" => |env, args| {
            // Short-circuit logical AND
            for arg in args {
                let result = arg.execute(env)?;
                if !result.as_bool() {
                    return Ok(Value::Bool(false));
                }
            }
            Ok(Value::Bool(true))
        },
        "or" => |env, args| {
            // Short-circuit logical OR
            for arg in args {
                let result = arg.execute(env)?;
                if result.as_bool() {
                    return Ok(Value::Bool(true));
                }
            }
            Ok(Value::Bool(false))
        },
        "implies" => |env, args| {
            // Short-circuit logical implication
            let lhs = args[0].execute(env)?;
            if !lhs.as_bool() {
                return Ok(Value::Bool(true));
            }

            args[1].execute(env)
        },
        "actionAny" => |env, args| {
            // Executes the first enabled action from a randomized list of actions.
            // Returns false if no enabled actions are found.
            let next_vars_snapshot = env.var_storage.borrow().take_snapshot();

            // Create array of indices and shuffle them
            let mut indices: Vec<usize> = (0..args.len()).collect();
            // Fisher-Yates shuffle algorithm using our randomizer
            for i in (0..indices.len()).rev() {
                let j: usize = env.rand.next(i + 1);
                indices.swap(i, j);
            }

            // Try actions in shuffled order until we find one that's enabled
            for i in indices {
                let result = args[i].execute(env)?;

                if result.as_bool() {
                    // Found an enabled action - record it and return true
                    // TODO: Record in the trace recorder
                    return Ok(Value::Bool(true));
                }

                // Reset state before trying next action
                env.var_storage.borrow_mut().restore(&next_vars_snapshot);
            }
            Ok(Value::Bool(false))
        },
        "actionAll" => |env, args| {
            // Executes all of the given actions, or none of them if any of them results in false.
            let next_vars_snapshot = env.var_storage.borrow().take_snapshot();

            for action in args {
                let result = action.execute(env)?;
                if !result.as_bool() {
                    env.var_storage.borrow_mut().restore(&next_vars_snapshot);
                    return Ok(Value::Bool(false));
                }
            }
            Ok(Value::Bool(true))
        },
        "ite" => |env, args| {
            // if-then-else
            let cond = args[0].execute(env).map(|c| c.as_bool())?;
            if cond {
                args[1].execute(env)
            } else {
                args[2].execute(env)
            }
        },
        "matchVariant" => |env, args| {
            // Pattern matching on variants
            let matched_expr = args[0].execute(env)?;
            let (variant_label, variant_value) = matched_expr.as_variant();
            let cases = &args[1..];

            let matching_case = cases.chunks_exact(2).find_map(|chunk| match chunk {
                [case_label_expr, case_elim_expr] => {
                    let case_label = case_label_expr.execute(env).ok()?;
                    if case_label.as_str() == *variant_label || case_label.as_str() == "_" {
                        // We found a matching case (or a wildcard "_")
                        Some(case_elim_expr)
                    } else {
                        None
                    }
                }
                _ => None,
            });

            match matching_case {
                Some(case_elim_expr) => {
                    let case_elim = case_elim_expr.execute(env)?;
                    let closure = case_elim.as_closure();
                    closure(env, vec![variant_value.clone()])
                }
                None => Err(QuintError::new(
                    "QNT505",
                    &format!("No match for variant {}", variant_label),
                )),
            }
        },
        "then" => |env, args| {
            // Compose two actions, executing the second one only if the first one results in true.
            let first = args[0].execute(env)?;
            if !first.as_bool() {
                return Err(QuintError::new(
                    "QNT513",
                    "Cannot continue in A.then(B), A evaluates to 'false'",
                ));
            }

            env.shift();
            // TODO: record state on recorder
            args[1].execute(env)
        },
        "reps" => {
            |env, args| {
                // Repeats the given action n times, stopping if the action evaluates to false.
                let reps = args[0].execute(env).map(|r| r.as_int())?;
                let action = &args[1];
                let mut result = Value::Bool(true);
                for i in 0..reps {
                    let closure = action.execute(env)?;
                    result = closure.as_closure()(env, vec![Value::Int(i)])?;
                    if !result.as_bool() {
                        return Err(QuintError::new(
                            "QNT513",
                            format!("Reps loop could not continue after iteration #{} evaluated to false", i+1).as_str(),
                        ));
                    }

                    // Don't shift the last one
                    if i < reps - 1 {
                        env.shift();
                    }
                }
                Ok(result)
            }
        }
        "expect" => {
            // Translate A.expect(P):
            //  - Evaluate A.
            //  - When A's result is 'false', emit a runtime error.
            //  - When A's result is 'true':
            //    - Commit the variable updates: Shift the primed variables to unprimed.
            //    - Evaluate `P`.
            //    - If `P` evaluates to `false`, emit a runtime error (similar to `assert`).
            //    - If `P` evaluates to `true`, rollback to the previous state and return `true`.
            |env, args| {
                let action = &args[0];
                let predicate = &args[1];

                let action_result = action.execute(env)?;
                if !action_result.as_bool() {
                    return Err(QuintError::new("QNT508", "Cannot continue to \"expect\""));
                }

                let next_vars_snapshot = env.var_storage.borrow().take_snapshot();
                env.shift();
                let predicate_result = predicate.execute(env)?;
                env.var_storage.borrow_mut().restore(&next_vars_snapshot);

                if !predicate_result.as_bool() {
                    return Err(QuintError::new(
                        "QNT508",
                        "Expect condition does not hold true",
                    ));
                }

                Ok(Value::Bool(true))
            }
        }
        _ => {
            println!("Unknown lazy operator: {op}");
            |_env, _args| Err(QuintError::new("QNT501", "Unknown built-in operator"))
        }
    })
}

/// Compile an operator in an eager way, where the arguments are evaluated beforehand
pub fn compile_eager_op(op: &str) -> CompiledExprWithArgs {
    // To be used at `item` and `nth` which share the same behavior
    fn at_index(list: &ImmutableVec<Value>, index: i64) -> Result<Value, QuintError> {
        if index < 0 || index >= list.len().try_into().unwrap() {
            return Err(QuintError::new("QNT510", "Out of bounds, nth(${index})"));
        }

        Ok(list[index as usize].clone())
    }

    CompiledExprWithArgs::from_fn(match op {
        // Constructs a set from the given arguments.
        "Set" => |_env, args| Ok(Value::Set(args.into_iter().collect())),
        "Rec" => |_env, args| {
            // Constructs a record from the given arguments. Arguments are lists like [key1, value1, key2, value2, ...]
            Ok(Value::Record(
                args.chunks_exact(2)
                    .map(|chunk| (chunk[0].as_str(), chunk[1].clone()))
                    .collect(),
            ))
        },
        // Constructs a tuple from the given arguments.
        "Tup" => |_env, args| Ok(Value::Tuple(args.into_iter().collect())),
        // Constructs a list from the given arguments.
        "List" => |_env, args| Ok(Value::List(args.into_iter().collect())),
        // Constructs a map from the given arguments. Arguments are lists like [[key1, value1], [key2, value2], ...]
        "Map" => |_env, args| {
            Ok(Value::Map(
                args.into_iter().map(|kv| kv.as_tuple2()).collect(),
            ))
        },
        // Constructs a variant from the given arguments.
        "variant" => |_env, args| Ok(Value::Variant(args[0].as_str(), Rc::new(args[1].clone()))),
        // Logical negation
        "not" => |_env, args| Ok(Value::Bool(!args[0].as_bool())),
        // Logical equivalence/bi-implication
        "iff" => |_env, args| Ok(Value::Bool(args[0].as_bool() == args[1].as_bool())),
        // Equality
        "eq" => |_env, args| Ok(Value::Bool(args[0] == args[1])),
        // Inequality
        "neq" => |_env, args| Ok(Value::Bool(args[0] != args[1])),
        // Integer addition
        "iadd" => |_env, args| Ok(Value::Int(args[0].as_int() + args[1].as_int())),
        // Integer subtraction
        "isub" => |_env, args| Ok(Value::Int(args[0].as_int() - args[1].as_int())),
        // Integer multiplication
        "imul" => |_env, args| Ok(Value::Int(args[0].as_int() * args[1].as_int())),
        // Integer division
        "idiv" => |_env, args| {
            let divisor = args[1].as_int();
            if divisor == 0 {
                return Err(QuintError::new("QNT503", "Division by zero"));
            }

            Ok(Value::Int(args[0].as_int() / divisor))
        },
        // Integer modulus
        "imod" => |_env, args| Ok(Value::Int(args[0].as_int() % args[1].as_int())),
        // Integer exponentiation
        "ipow" => |_env, args| {
            let base = args[0].as_int();
            let exp = args[1].as_int();
            if base == 0 && exp == 0 {
                return Err(QuintError::new("QNT503", "0^0 is undefined"));
            }
            if exp < 0 {
                return Err(QuintError::new("QNT503", "i^j is undefined for j < 0"));
            }

            Ok(Value::Int(base.pow(exp as u32)))
        },
        // Integer unary minus
        "iuminus" => |_env, args| Ok(Value::Int(-args[0].as_int())),
        // Integer less than
        "ilt" => |_env, args| Ok(Value::Bool(args[0].as_int() < args[1].as_int())),
        // Integer less than or equal to
        "ilte" => |_env, args| Ok(Value::Bool(args[0].as_int() <= args[1].as_int())),
        // Integer greater than
        "igt" => |_env, args| Ok(Value::Bool(args[0].as_int() > args[1].as_int())),
        // Integer greater than or equal to
        "igte" => |_env, args| Ok(Value::Bool(args[0].as_int() >= args[1].as_int())),

        // Access a tuple: tuples are 1-indexed, that is, _1, _2, etc.
        "item" => |_env, args| at_index(args[0].as_list(), args[1].as_int() - 1),
        // A set of all possible tuples from the elements of the respective given sets.
        "tuples" => |_env, args| Ok(Value::CrossProduct(args)),

        // Constructs a list of integers from start to end.
        "range" => |_env, args| {
            let start = args[0].as_int();
            let end = args[1].as_int();
            Ok(Value::List((start..end).map(Value::Int).collect()))
        },
        // List access
        "nth" => |_env, args| at_index(args[0].as_list(), args[1].as_int()),
        // Replace an element at a given index in a list.
        "replaceAt" => |_env, args| {
            let mut list = args[0].as_list().clone();
            let index = args[1].as_int();

            if index < 0 || index >= list.len().try_into().unwrap() {
                return Err(QuintError::new(
                    "QNT510",
                    "Out of bounds, replaceAt(${index})",
                ));
            }

            list[index as usize] = args[2].clone();
            Ok(Value::List(list))
        },

        // Get the first element of a list. Not allowed in empty lists.
        "head" => |_env, args| {
            let list = args[0].as_list();
            match list.head() {
                Some(h) => Ok(h.clone()),
                None => Err(QuintError::new("QNT505", "Called 'head' on an empty list")),
            }
        },

        // Get the tail (all elements but the head) of a list. Not allowed in empty lists.
        "tail" => |_env, args| {
            let list = args[0].as_list();
            if !list.is_empty() {
                Ok(Value::List(list.iter().skip(1).cloned().collect()))
            } else {
                Err(QuintError::new("QNT505", "Called 'tail' on an empty list"))
            }
        },

        // Get a sublist of a list from start to end.
        "slice" => |_env, args| {
            let list = args[0].as_list();
            let start = args[1].as_int();
            let end = args[2].as_int() as usize;

            if start >= 0 && end <= list.len() && start as usize <= end {
                Ok(Value::List(list.clone().slice(start as usize..end)))
            } else {
                Err(QuintError::new(
                    "QNT506",
                    format!(
                        "slice(..., {start}, {end}) applied to a list of size {size}",
                        start = start,
                        end = end,
                        size = list.len()
                    )
                    .as_str(),
                ))
            }
        },

        // The length of a list.
        "length" => |_env, args| Ok(Value::Int(args[0].cardinality().try_into().unwrap())),
        // Append an element to a list.
        "append" => |_env, args| {
            let mut list = args[0].as_list().clone();
            list.push_back(args[1].clone());
            Ok(Value::List(list))
        },
        // Concatenate two lists.
        "concat" => |_env, args| {
            let mut list = args[0].as_list().clone();
            list.extend(args[1].as_list().iter().cloned());
            Ok(Value::List(list))
        },
        // A set with the indices of a list.
        "indices" => |_env, args| {
            let size: i64 = args[0].cardinality().try_into().unwrap();
            Ok(Value::Interval(0, size - 1))
        },

        // Access a field in a record.
        "field" => |_env, args| {
            Ok(args[0]
                .as_record_map()
                .get(&args[1].as_str())
                .unwrap()
                .clone())
        },

        // A set with the field names of a record.
        "fieldNames" => |_env, args| {
            Ok(Value::Set(
                args[0]
                    .as_record_map()
                    .keys()
                    .map(|s| Value::Str(s.clone()))
                    .collect(),
            ))
        },

        // Replace a field value in a record.
        "with" => |_env, args| {
            let mut record = args[0].as_record_map().clone();
            record.insert(args[1].as_str(), args[2].clone());
            Ok(Value::Record(record))
        },

        // The powerset of a set.
        "powerset" => |_env, args| Ok(Value::PowerSet(Rc::new(args[0].clone()))),
        // Check if a set contains an element.
        "contains" => |_env, args| Ok(Value::Bool(args[0].contains(&args[1]))),
        // Check if an element is in a set.
        "in" => |_env, args| Ok(Value::Bool(args[1].contains(&args[0]))),
        // Check if a set is a subset of another set.
        "subseteq" => |_env, args| Ok(Value::Bool(args[0].subseteq(&args[1]))),
        // Set difference.
        "exclude" => |_env, args| {
            Ok(Value::Set(
                args[0]
                    .as_set()
                    .into_owned()
                    .relative_complement(args[1].as_set().into_owned()),
            ))
        },
        // Set union.
        "union" => |_env, args| {
            Ok(Value::Set(
                args[0]
                    .as_set()
                    .into_owned()
                    .union(args[1].as_set().into_owned()),
            ))
        },
        // Set intersection.
        "intersect" => |_env, args| {
            Ok(Value::Set(
                args[0]
                    .as_set()
                    .into_owned()
                    .intersection(args[1].as_set().into_owned()),
            ))
        },

        // The size of a set.
        "size" => |_env, args| Ok(Value::Int(args[0].cardinality().try_into().unwrap())),

        // Whether a set is finite.
        "isFinite" => |_env, _args| {
            // at the moment, we support only finite sets, so just return true
            Ok(Value::Bool(true))
        },
        // Construct a set of integers from a to b.
        "to" => |_env, args| {
            let start = args[0].as_int();
            let end = args[1].as_int();
            if start > end {
                // Avoid having different intervals that represent the same thing (empty set)
                return Ok(Value::Set(ImmutableSet::default()));
            }
            Ok(Value::Interval(start, end))
        },

        // Fold a set
        "fold" => |env, args| {
            let reducer = args[2].as_closure();
            fold_left(
                args[0].as_set().iter().cloned(),
                args[1].clone(),
                |acc, arg| reducer(env, vec![acc, arg]),
            )
        },

        // Fold a list from left to right.
        "foldl" => |env, args| {
            let reducer = args[2].as_closure();
            fold_left(
                args[0].as_list().iter().cloned(),
                args[1].clone(),
                |acc, arg| reducer(env, vec![acc, arg]),
            )
        },

        // Fold a list from right to left.
        "foldr" => |env, args| {
            let reducer = args[2].as_closure();
            fold_right(
                args[0].as_list().iter().cloned(),
                args[1].clone(),
                |arg, acc| reducer(env, vec![arg, acc]),
            )
        },

        // Flatten a set of sets.
        "flatten" => |_env, args| {
            Ok(Value::Set(
                args[0]
                    .as_set()
                    .iter()
                    .flat_map(|v| v.as_set().into_owned())
                    .collect(),
            ))
        },

        // Get a value from a map.
        "get" => |_env, args| {
            let map = args[0].as_map();
            let key = args[1].clone().normalize();
            match map.get(&key) {
                Some(value) => Ok(value.clone()),
                None => Err(QuintError::new(
                    "QNT507",
                    format!(
                        "Called 'get' with a non-existing key. Key is {key}. Map has keys: {keys}",
                        key = key,
                        keys = map.keys().map(|k| k.to_string()).join(", ")
                    )
                    .as_str(),
                )),
            }
        },

        // Set a value for an existing key in a map.
        "set" => |_env, args| {
            let mut map = args[0].as_map().clone();
            let key = args[1].clone().normalize();

            if !map.contains_key(&key) {
                return Err(QuintError::new(
                    "QNT507",
                    "Called 'set' with a non-existing key",
                ));
            }

            map.insert(key, args[2].clone());
            Ok(Value::Map(map))
        },

        // Set a value for any key in a map.
        "put" => |_env, args| {
            let mut map = args[0].as_map().clone();
            let key = args[1].clone().normalize();
            let value = args[2].clone();
            map.insert(key, value);
            Ok(Value::Map(map))
        },

        // Set a value for an existing key in a map using a lambda over the current value.
        "setBy" => |env, args| {
            let mut map = args[0].as_map().clone();
            let key = args[1].clone().normalize();
            match map.get(&key) {
                Some(value) => {
                    let new_value = args[2].as_closure()(env, vec![value.clone()])?;
                    map.insert(key, new_value);
                    Ok(Value::Map(map))
                }
                None => Err(QuintError::new(
                    "QNT507",
                    format!("Called 'setBy' with a non- existing key {}", key).as_str(),
                )),
            }
        },

        // A set with the keys of a map.
        "keys" => |_env, args| Ok(Value::Set(args[0].as_map().keys().cloned().collect())),
        // Check if a predicate holds for some element in a set.
        "exists" => |env, args| {
            for v in args[0].as_set().iter() {
                let result = args[1].as_closure()(env, vec![v.clone()])?;
                if result.as_bool() {
                    return Ok(Value::Bool(true));
                }
            }
            Ok(Value::Bool(false))
        },

        "forall" => |env, args| {
            for v in args[0].as_set().iter() {
                let result = args[1].as_closure()(env, vec![v.clone()])?;
                if !result.as_bool() {
                    return Ok(Value::Bool(false));
                }
            }
            Ok(Value::Bool(true))
        },

        // Map a lambda over a set.
        "map" => |env, args| {
            Ok(Value::Set(
                args[0]
                    .as_set()
                    .iter()
                    .map(|v| args[1].as_closure()(env, vec![v.clone()]))
                    .collect::<Result<_, _>>()?,
            ))
        },

        // Filter a set using a lambda.
        "filter" => |env, args| {
            Ok(Value::Set(args[0].as_set().iter().try_fold(
                ImmutableSet::default(),
                |mut acc, v| {
                    if args[1].as_closure()(env, vec![v.clone()])?.as_bool() {
                        acc.insert(v.clone());
                    }
                    Ok(acc)
                },
            )?))
        },

        // Filter a list using a lambda
        "select" => |env, args| {
            Ok(Value::List(args[0].as_list().iter().try_fold(
                ImmutableVec::new(),
                |mut acc, v| {
                    if args[1].as_closure()(env, vec![v.clone()])?.as_bool() {
                        acc.push_back(v.clone());
                    }
                    Ok(acc)
                },
            )?))
        },

        // Construct a map by applying a lambda to the values of a set.
        "mapBy" => |env, args| {
            let closure = args[1].as_closure();
            let keys = args[0].as_set();

            Ok(Value::Map(keys.iter().try_fold(
                ImmutableMap::new(),
                |mut acc, key| {
                    let value = closure(env, vec![key.clone()])?;
                    acc.insert(key.clone().normalize(), value);
                    Ok(acc)
                },
            )?))
        },
        // Convert a set of key-value tuples to a map.
        "setToMap" => |_env, args| {
            let set = args[0].as_set();
            Ok(Value::Map(set.iter().map(|v| v.as_tuple2()).collect()))
        },
        // A set of all possible maps with keys and values from the given sets.
        "setOfMaps" => |_env, args| {
            Ok(Value::MapSet(
                Rc::new(args[0].clone()),
                Rc::new(args[1].clone()),
            ))
        },
        // Expect a value to be false
        "fail" => |_env, args| Ok(Value::Bool(!args[0].as_bool())),
        // Expect a value to be true, returning a runtime error if it is not
        "assert" => |_env, args| {
            if !args[0].as_bool() {
                return Err(QuintError::new("QNT508", "Assertion failed"));
            }
            Ok(Value::Bool(true))
        },
        // Generate all lists of length up to the given number, from a set
        "allListsUpTo" => |_env, args| {
            let set = args[0].as_set();
            let length = args[1].as_int();
            let mut lists = FxHashSet::default();
            let mut last_lists = FxHashSet::<ImmutableVec<Value>>::default();
            lists.insert(ImmutableVec::default());
            last_lists.insert(ImmutableVec::default());
            for _ in 0..length {
                let new_lists: FxHashSet<ImmutableVec<Value>> = set
                    .iter()
                    .flat_map(|value| {
                        last_lists.iter().map(move |list| {
                            let mut new_list = list.clone();
                            new_list.push_back(value.clone());
                            new_list
                        })
                    })
                    .collect();
                lists.extend(new_lists.iter().cloned());
                last_lists = new_lists;
            }

            Ok(Value::Set(lists.into_iter().map(Value::List).collect()))
        },

        // Get the only element of a set, or an error if the set is empty or has more than one element.
        "getOnlyElement" => |_env, args| {
            let set = args[0].as_set();
            let size = set.len();
            if size != 1 {
                return Err(QuintError::new(
                    "QNT505",
                    format!(
                        "Called 'getOnlyElement' on a set with {size} elements.\
                        Make sure the set has exactly one element."
                    )
                    .as_str(),
                ));
            }

            Ok(set.iter().next().cloned().unwrap())
        },

        // Print a value to the console, and return it
        "q::debug" => |_env, args| {
            println!("> {} {}", args[0].as_str(), args[1]);
            Ok(args[1].clone())
        },

        // `allLists` is not supported in the REPL, but we have `allListsUpTo`
        "allLists" => |_env, _args| {
            Err(QuintError::new(
                "QNT501",
                "Runtime does not support allLists. Use `allListsUpTo` instead",
            ))
        },

        // These are not supported in the REPL
        "chooseSome" | "always" | "eventually" | "enabled" | "orKeep" | "mustChange"
        | "weakFair" | "strongFair" => |_env, _args| {
            Err(QuintError::new(
                "QNT501",
                "Runtime does not support this built-in operator",
            ))
        },

        _ => {
            println!("Unknown eager operator: {op}");
            |_env, _args| Err(QuintError::new("QNT501", "Unknown built-in operator"))
        }
    })
}

/// Utility to fold iterables from left to right. This exists mostly to keep a
/// symmetry with `fold_right`, which is a bit more interesting.
fn fold_left<T>(
    mut iterable: T,
    initial: Value,
    closure: impl FnMut(Value, Value) -> Result<Value, QuintError>,
) -> Result<Value, QuintError>
where
    T: Iterator<Item = Value>,
{
    iterable.try_fold(initial, closure)
}

/// Utility to fold iterables from right to left. Reverse the iterable and
/// switch the order of the arguments in the provided closure.
fn fold_right<T>(
    iterable: T,
    initial: Value,
    mut closure: impl FnMut(Value, Value) -> Result<Value, QuintError>,
) -> Result<Value, QuintError>
where
    T: Iterator<Item = Value> + DoubleEndedIterator,
{
    iterable
        .rev()
        .try_fold(initial, |acc, arg| closure(arg, acc))
}

#[cfg(test)]
mod tests {
    use super::*;

    // ghci> foldl (flip (:)) [] [1,2,3]
    // [3,2,1]
    #[test]
    fn test_fold_left() {
        let list = vec![Value::Int(1), Value::Int(2), Value::Int(3)];
        let result = fold_left(
            list.into_iter(),
            Value::List(ImmutableVec::new()),
            |acc, arg| {
                let mut acc = acc.as_list().clone();
                acc.push_front(arg);
                Ok(Value::List(acc))
            },
        );

        assert_eq!(
            result.unwrap(),
            Value::List(ImmutableVec::from(vec![
                Value::Int(3),
                Value::Int(2),
                Value::Int(1),
            ]))
        );
    }

    // ghci> foldr (:) [] [1,2,3]
    // [1,2,3]
    #[test]
    fn test_fold_right() {
        let list = vec![Value::Int(1), Value::Int(2), Value::Int(3)];
        let result = fold_right(
            list.into_iter(),
            Value::List(ImmutableVec::new()),
            |arg, acc| {
                let mut acc = acc.as_list().clone();
                acc.push_front(arg);
                Ok(Value::List(acc))
            },
        );

        assert_eq!(
            result.unwrap(),
            Value::List(ImmutableVec::from(vec![
                Value::Int(1),
                Value::Int(2),
                Value::Int(3)
            ]))
        );
    }
}
