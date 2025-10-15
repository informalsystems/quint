//! Internal logging utilities for formatted terminal output.
//!
//! Provides macros for printing formatted messages to stderr with color coding
//! and indentation for test execution output.
//!
// XXX: This approach is simple but don't handle identation well. We should
// consider moving to a proper structured logging or terminal reporting library.

#[doc(hidden)]
pub use colored::Colorize;

/// If avilable, enables trace logs.
pub const VERBOSE: bool = option_env!("QUINT_VERBOSE").is_some();

/// Prints a bold section header with "== " prefix to stderr.
macro_rules! title {
    ($fmt:literal $(, $args:expr)*) => {
        eprint!("{}", "== ".bold());
        eprintln!("{}", format!($fmt $(,$args)*).bold());
    };
}

/// Prints an indented informational message to stderr.
macro_rules! info {
    ($fmt:literal $(, $args:expr)*) => {
        eprintln!("   {}", format!($fmt $(,$args)*));
    };
}

/// Prints an indented success message in bold green to stderr, followed by a
/// blank line.
macro_rules! success {
    ($fmt:literal $(, $args:expr)*) => {
        eprint!("{}", "   ".bold().green());
        eprintln!("{}\n", format!($fmt $(,$args)*).bold().green());
    };
}

/// Prints an indented error message in bold red to stderr.
macro_rules! error {
    ($fmt:literal $(, $args:expr)*) => {
        eprint!("{}", "   ".bold().red());
        eprintln!("{}", format!($fmt $(,$args)*).bold().red());
    };
}

/// Prints a dimmed debug message to stderr, only when `QUINT_VERBOSE`
/// environment variable is set.
macro_rules! trace {
    ($fmt:literal $(, $args:expr)*) => {
        if crate::logger::VERBOSE {
            eprint!("{}", "   ".dimmed().bright_white());
            eprintln!("{}", format!($fmt $(,$args)*).dimmed().bright_white());
        }
    };
}

pub(crate) use error;
pub(crate) use info;
pub(crate) use success;
pub(crate) use title;
pub(crate) use trace;
