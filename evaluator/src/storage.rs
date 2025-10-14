//! Storage for state variables with extra functionality that depends on the
//! state machines' state.

use crate::ir::QuintName;
use crate::value::{ImmutableMap, Value};
use std::{cell::RefCell, rc::Rc};

/// Variable registers are like the regular registers (ref cells) except that
/// they include a name. The name is used for displaying the variable name in
/// the trace.
#[derive(Clone)]
pub struct VariableRegister {
    pub name: QuintName,
    pub value: Option<Value>,
}

/// While `vars` values are immutable during evaluation and are only updated in `shift_vars()`, the remaining
/// stored values can be changed, and sometimes we need to revert those changes. For example, in:
/// ```quint
/// all {
///  x' = x + 1,
///  false,
/// }
/// ```
/// The second expression makes it so the `all` is false, and we need to revert back to the state before
/// we evaluated `x' = x + 1`.
///
/// That's where snapshots are used
#[derive(Clone)]
pub struct Snapshot {
    pub next_vars: ImmutableMap<QuintName, VariableRegister>,
    // TODO:
    // nondet_picks
    // action_taken
}

#[derive(Default, Clone)]
pub struct Storage {
    // Registers for the values in the current state, to be read during evaluation
    pub vars: ImmutableMap<QuintName, Rc<RefCell<VariableRegister>>>,
    // Registers for values in the next state, to be written to during evaluation
    pub next_vars: ImmutableMap<QuintName, Rc<RefCell<VariableRegister>>>,
    // A list of caches to clear after every step, used to cache values during a single state only.
    pub caches_to_clear: Vec<Rc<RefCell<Option<Value>>>>,
    // TODO:
    // nondet_picks
    // action_taken
}

impl Storage {
    /// Move the values in `next_vars` registries to `vars` registries, and
    /// clear the caches.
    pub fn shift_vars(&mut self) {
        for (key, register_for_current) in self.vars.iter() {
            if let Some(register_for_next) = self.next_vars.get(key) {
                let mut current = register_for_current.borrow_mut();
                let mut next = register_for_next.borrow_mut();
                current.value = next.value.take();
            }
        }
        self.clear_caches();
    }

    /// Build a record with the current state variables' values, to be used in traces.
    pub fn as_record(&self) -> Value {
        let map = self.vars.values().filter_map(|register| {
            let reg = register.borrow().clone();
            reg.value.map(|v| (reg.name, v))
        });

        // TODO: add nondet picks and action taken
        Value::record(ImmutableMap::from_iter(map))
    }

    pub fn take_snapshot(&self) -> Snapshot {
        Snapshot {
            next_vars: self
                .next_vars
                .iter()
                .map(|(k, v)| (k.clone(), v.borrow().clone()))
                .collect(),
        }
    }

    pub fn restore(&mut self, snapshot: &Snapshot) {
        self.next_vars.iter().for_each(|(k, v)| {
            if let Some(next) = snapshot.next_vars.get(k) {
                v.borrow_mut().value = next.value.clone();
            }
        });
    }

    fn clear_caches(&mut self) {
        for cache in self.caches_to_clear.iter() {
            *cache.borrow_mut() = None;
        }
    }
}
