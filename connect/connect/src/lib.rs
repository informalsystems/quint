//! Model-based testing for Rust using Quint specifications.
//!
//! `quint-connect` enables you to write model-based tests where
//! [Quint](https://quint-lang.org/) generates execution traces from a formal
//! specification and your Rust code validates that the implementation behaves
//! correctly. This approach helps catch bugs by exploring the state space of
//! your system automatically.
//!
//! # Overview
//!
//! Model-based testing with `quint-connect` involves three main components:
//!
//! 1. **A Quint specification** (`.qnt` file) - Describes the expected behavior
//!    of your system
//!
//! 2. **A Driver implementation** - Connects the specification to your Rust
//!    implementation
//!
//! 3. **Test functions** - Uses the `#[run]` macro to execute traces against
//!    your driver
//!
//! The workflow is:
//!
//! 1. Quint generates random execution traces exploring different paths through
//!    your specification
//!
//! 2. For each step in a trace, your driver executes the corresponding action
//!    in your implementation
//!
//! 3. After each step, your driver can verify that the implementation state
//!    matches the specification
//!
//! # Quick Start
//!
//! ## 1. Create a Quint Specification
//!
//! Create a file `specs/counter.qnt`:
//!
//! ```quint
//! module counter {
//!   var value: int
//!
//!   action increment = {
//!     value' = value + 1
//!   }
//!
//!   action reset = {
//!     value' = 0
//!   }
//!   
//!   action init = {
//!     value' = 0
//!   }
//!
//!   action step = any {
//!     increment,
//!     reset
//!   }
//! }
//! ```
//!
//! ## 2. Implement a Driver
//!
//! ```
//! use quint_connect::{Driver, Status, Step, run as quint_run, switch};
//!
//! #[derive(Default)]
//! struct CounterDriver {
//!     counter: i64,
//! }
//!
//! impl Driver for CounterDriver {
//!     fn step(&mut self, step: &Step) -> Status {
//!         switch! {
//!             (self, step) {
//!                 init => self.counter = 0,
//!                 increment => self.counter += 1,
//!                 reset => self.counter = 0
//!             }
//!         }
//!     }
//!
//!     fn check(&self, step: Step) {
//!         if let Some(expected) = step.get::<i64>("value") {
//!             assert_eq!(
//!                 self.counter, expected,
//!                 "Counter mismatch: impl={}, spec={}",
//!                 self.counter, expected
//!             );
//!         }
//!     }
//! }
//! ```
//!
//! ## 3. Write a Test
//!
//! ```ignore
//! #[quint_run(spec = "specs/counter.qnt")]
//! fn test_counter() -> impl Driver {
//!     CounterDriver::default()
//! }
//! ```
//!
//! ## 4. Run Tests
//!
//! ```bash
//! cargo test
//! ```
//!
//! Note that tests can be made verbose with:
//!
//! ```bash
//! QUINT_VERBOSE=1 cargo test -- --nocapture
//! ```
//!
//! # Core Concepts
//!
//! ## Driver Trait
//!
//! The [`Driver`] trait is the main interface for connecting your
//! implementation to Quint traces. It has two methods:
//!
//! - [`Driver::step`] - Executes an action from the trace
//! - [`Driver::check`] - Verifies state consistency (optional)
//!
//! ## The `switch!` Macro
//!
//! The [`switch!`] macro provides a convenient DSL for handling different
//! actions in your driver:
//!
//! ```ignore
//! switch! {
//!     (self, step) {
//!         init => /* initialization */,
//!         DoAction(param1, param2: Type) => /* handle action with parameters */,
//!         OptionalAction(value: Option<i64>) => /* handle optional parameters */
//!     }
//! }
//! ```
//!
//! ## The `#[run]` Macro
//!
//! The [`run`] attribute macro transforms a function into a test that generates
//! and executes Quint traces:
//!
//! ```ignore
//! #[run(
//!     spec = "path/to/spec.qnt",
//!     max_samples = 100,    // Control trace generation
//!     max_steps = 50,       // Limit trace length
//!     main = "mainAction"   // Specify entry point
//! )]
//! fn test_name() -> impl Driver {
//!     MyDriver::new()
//! }
//! ```
//!
//! # Error Handling
//!
//! Tests fail when:
//!
//! - An assertion in `step()` or `check()` fails
//! - The driver returns `Status::UnknownParam` (missing required parameter)
//! - The driver panics during execution
//! - Type deserialization fails (type mismatch between Rust and Quint)
//!
//! The library will show you:
//! - Which step in the trace failed
//! - The action being executed
//! - The state at that point
//! - The full trace leading to the failure
//!
//! # Requirements
//!
//! - [Quint](https://quint-lang.org/) must be installed and available in your PATH
//! - Your `.qnt` specification files must be valid

mod driver;
mod logger;
mod trace;

#[doc(hidden)]
pub mod runner;

pub use crate::driver::{Driver, NondetPicks, Status, Step};
pub use quint_connect_macros::{run, switch};
