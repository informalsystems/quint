//! Trace generation and data extraction from Quint specifications.
//!
//! This module handles generating execution traces using the Quint CLI and
//! provides utilities for iterating over and extracting trace data.

mod display;
mod generator;
mod iter;
mod step;

pub use display::display_value;
pub use generator::generate;
pub use iter::Iter;
pub use step::Step;

pub type Trace = itf::Trace<itf::Value>;
