use crate::trace::display_value;
use itf::{
    de::{self, As},
    value::{Record, Value},
};
use serde::{de::DeserializeOwned, Deserialize};
use std::{borrow::Cow, fmt};

pub use crate::trace::Step;

/// The result status of executing a step in the driver.
///
/// This enum represents the possible outcomes when a driver processes a step
/// from a trace. It's returned by the [`Driver::step`] method and used by the
/// test runner to determine how to proceed.
pub enum Status {
    /// The step was executed successfully.
    ///
    /// This indicates that the action was recognized and executed without
    /// errors. The test runner will continue to the next step in the trace.
    Ok,

    /// No more actions to execute (end of trace).
    ///
    /// This is returned when the trace has no action to take in the current
    /// step, typically indicating the end of a trace.
    Done,

    /// The action is not yet implemented in the driver.
    ///
    /// This is returned when the trace contains an action that the driver
    /// doesn't recognize or hasn't implemented yet. The string contains the
    /// name of the unimplemented action.
    ///
    /// This is useful during incremental development of a driver, allowing you
    /// to add action handlers one at a time.
    Unimplemented(String),

    /// A required parameter was missing from the trace.
    ///
    /// This is returned when the driver expected a parameter value in the set
    /// of nondeterministic choices but it wasn't present. This typically
    /// indicates a mismatch between the driver's expectations and what the
    /// Quint specification provides.
    UnknownParam {
        /// The name of the action that was missing a parameter
        action: String,
        /// The name of the missing parameter
        param: String,
    },
}

/// A trait for implementing model-based test drivers that execute actions from
/// Quint specifications.
///
/// The `Driver` trait connects a Quint specification to a concrete
/// implementation, allowing you to run model-based tests where Quint generates
/// execution traces and the driver replays them against your implementation.
///
/// # Overview
///
/// When you write a model-based test using the
/// [`quint_connect::run`](crate::run) attribute macro, Quint generates
/// execution traces from your specification. The driver's job is to:
///
/// 1. Execute each action from the trace against your implementation (via
///    [`step`](Driver::step))
///
/// 2. Optionally verify that your implementation's state matches the
///    specification (via [`check`](Driver::check))
///
/// # Example
///
/// ```ignore
/// use quint_connect::{run as quint_run, Driver, Status, Step, switch};
/// use my_game::*;
///
/// #[derive(Default)]
/// struct GameDriver {
///     game: Game,
/// }
///
/// impl Driver for GameDriver {
///     fn step(&mut self, step: &Step) -> Status {
///         switch! {
///             (self, step) {
///                 init => /* initialize variables */,
///                 MoveX(position) => /* move X to a position */,
///                 MoveO(position) => /* move O to a position */
///             }
///         }
///     }
///
///     fn check(&self, step: Step) {
///         // Assert the spec and game states match
///         if let Some(spec_state) = step.get::<SpecState>("variable") {
///             assert_eq!(self.game.state, spec_state.into());
///         }
///     }
/// }
///
/// #[quint_run(spec = "spec/game.qnt")]
/// fn test_game() -> impl Driver {
///     GameDriver::default()
/// }
/// ```
///
/// # The `switch!` Macro
///
/// The `switch!` macro provides a convenient DSL for matching actions from the
/// trace:
///
/// ```ignore
/// switch! {
///     (self, step) {
///         init => /* initialization code */,
///         ActionName(param1, param2: Type) => /* handle action */,
///         AnotherAction(optional_param: Option<Type>) => /* handle action */,
///     }
/// }
/// ```
///
/// - Parameters are automatically extracted from nondeterministic picks in the
///   trace
///
/// - Parameters are required by default (returns `Status::UnknownParam` if
///   missing)
///
/// - Parameters with `Option<T>` type are optional and won't fail if missing
///
/// - The macro returns `Status::Ok` for matched actions,
///   `Status::Unimplemented` for unknown actions, and `Status::Done` when no
///   action is present (end of trace)
///
/// # Helper Methods
///
/// The trait provides two helper methods for accessing trace data:
///
/// - [`action_taken`](Driver::action_taken): Returns the name of the action
///   taken in this step
///
/// - [`nondet_picks`](Driver::nondet_picks): Returns the nondeterministic
///   choices made by Quint for this step
///
/// These are typically used internally by the `switch!` macro but can be called
/// directly or overriden if needed.
pub trait Driver {
    /// Executes a single step from the trace against your implementation.
    ///
    /// This method is called for each step in the trace generated by Quint. Use
    /// the `switch!` macro or manually inspect the `step` to determine which
    /// action to execute.
    ///
    /// # Parameters
    ///
    /// - `step`: A reference to the current step from the trace, containing the
    ///   action name and any nondeterministic picks made by Quint
    ///
    /// # Returns
    ///
    /// A [`Status`] indicating the outcome:
    ///
    /// - [`Status::Ok`]: The step was executed successfully
    /// - [`Status::Done`]: No more actions to execute (end of trace)
    /// - [`Status::Unimplemented`]: The action is not yet implemented in the driver
    /// - [`Status::UnknownParam`]: A required parameter was missing from the trace
    ///
    /// # Example
    ///
    /// ```ignore
    /// fn step(&mut self, step: &Step) -> Status {
    ///     switch! {
    ///         (self, step) {
    ///             init => self.reset(),
    ///             DoAction(value) => self.perform_action(value),
    ///         }
    ///     }
    /// }
    /// ```
    fn step(&mut self, step: &Step) -> Status;

    /// Verifies that your implementation's state matches the specification's
    /// state.
    ///
    /// This method is called after each step to allow you to assert that your
    /// implementation's internal state is consistent with the state in the
    /// Quint specification. Use [`Step::get`] or [`Step::get_in`] to extract
    /// state variables from the trace.
    ///
    /// # Parameters
    ///
    /// - `step`: The current step from the trace, containing the
    ///   specification's state variables
    ///
    /// # Default Implementation
    ///
    /// The default implementation does nothing. Override this method if you
    /// want to verify state consistency between your implementation and the
    /// specification.
    ///
    /// # Example
    ///
    /// ```ignore
    /// fn check(&self, step: Step) {
    ///     // Extract a state variable from the spec
    ///     if let Some(expected_count) = step.get::<i64>("counter") {
    ///         assert_eq!(
    ///             self.actual_count, expected_count,
    ///             "counter mismatch: impl={}, spec={}",
    ///             self.actual_count, expected_count
    ///         );
    ///     }
    /// }
    /// ```
    fn check(&self, _step: Step) {}

    /// Returns the name of the action taken in this step.
    ///
    /// This method extracts the action name from the trace metadata. The action
    /// name corresponds to the action from your Quint specification that was
    /// chosen for this step.
    ///
    /// # Returns
    ///
    /// - `Some(action_name)` if an action was taken in this step
    /// - `None` if no action was taken (typically at the end of a trace)
    ///
    /// Note: The `switch!` macro calls this method internally, so you typically
    /// don't need to call it directly.
    fn action_taken(&self, step: &Step) -> Option<String> {
        step.get("mbt::actionTaken")
    }

    /// Returns the nondeterministic picks made by Quint for this step.
    ///
    /// When Quint generates a trace, it makes nondeterministic choices (like
    /// which value to pick from a set, or which action parameter to use). These
    /// choices are recorded in the trace and accessible via this method.
    ///
    /// # Parameters
    ///
    /// - `step`: The current step from the trace
    ///
    /// # Returns
    ///
    /// A [`NondetPicks`] object that allows you to retrieve individual pick
    /// values by name.
    ///
    /// # Panics
    ///
    /// Panics if the trace step doesn't contain nondeterministic picks metadata. This typically
    /// indicates a malformed trace.
    ///
    /// Note: The `switch!` macro calls this method internally to extract action
    /// parameters, so you typically don't need to call it directly.
    fn nondet_picks<'a>(&'a self, step: &'a Step) -> NondetPicks<'a> {
        if let Some(Value::Record(rec)) = step.get_value("mbt::nondetPicks") {
            return NondetPicks(Cow::Borrowed(rec));
        }
        panic!("can't find nondet picks from trace state");
    }
}

#[derive(Deserialize)]
// XXX: If `itf::de::QuintOption` was public, we wouldn't need this struct.
struct NondetPick<T: DeserializeOwned>(#[serde(with = "As::<de::Option<_>>")] Option<T>);

/// A collection of nondeterministic picks made by Quint for a trace step.
///
/// When Quint generates a trace from a specification, it makes nondeterministic
/// choices (such as picking values from sets, selecting action parameters,
/// etc.). These choices are recorded as "nondet picks" in the trace and can be
/// accessed through this type.
///
/// Note: The `switch!` macro automatically extracts parameters from
/// `NondetPicks`, so you typically don't need to use this type directly.
///
// TODO: Implement a mechanism (builder?) that allows users to override
// `Driver::nondet_picks` and build their own set of nondet choices when needed.
pub struct NondetPicks<'a>(Cow<'a, Record>);

impl NondetPicks<'_> {
    /// Retrieves a nondeterministic pick value by name.
    ///
    /// # Type Parameters
    ///
    /// - `T`: The type to deserialize the pick value into. Must implement
    ///   [`DeserializeOwned`].
    ///
    /// # Parameters
    ///
    /// - `name`: The name of the pick to retrieve (corresponds to the parameter
    ///   name in the spec)
    ///
    /// # Returns
    ///
    /// - `Some(value)` if the pick exists and was successfully deserialized
    /// - `None` if the pick doesn't exist or the Quint specification didn't
    ///   choose a value
    ///
    /// # Panics
    ///
    /// Panics if the pick value exists but cannot be deserialized into type
    /// `T`. This typically indicates a type mismatch between your Rust code and
    /// the Quint specification.
    pub fn get<T>(&self, name: &str) -> Option<T>
    where
        T: DeserializeOwned,
    {
        self.0.get(name).cloned().and_then(|value| {
            NondetPick::deserialize(value)
                .expect("failed to decode nondet pick")
                .0
        })
    }
}

impl<'a> fmt::Display for NondetPicks<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for (key, value) in self.0.iter() {
            write!(f, "     + {}: ", key)?;
            display_value(f, value)?;
            writeln!(f)?;
        }
        Ok(())
    }
}
