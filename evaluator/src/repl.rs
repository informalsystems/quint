// ! REPL mode for the Quint evaluator
//!
//! This module provides a stateful REPL evaluator that communicates via
//! line-delimited JSON over stdin/stdout. It maintains evaluation state
//! between commands, allowing incremental expression evaluation.

use crate::evaluator::{Env, Interpreter};
use crate::ir::{LookupTable, QuintEx};
use crate::storage::Storage;
use crate::value::Value;
use itf;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::io::{self, BufRead, Write};
use std::rc::Rc;

/// Commands that can be sent to the REPL evaluator
#[derive(Deserialize, Debug)]
#[serde(tag = "cmd")]
enum ReplCommand {
    /// Initialize the evaluator with a lookup table
    Initialize {
        table: LookupTable,
        #[serde(default)]
        seed: Option<u64>,
        #[serde(default)]
        verbosity: u8,
    },
    /// Update the lookup table with new definitions
    UpdateTable { table: LookupTable },
    /// Evaluate a single expression
    Evaluate { expr: QuintEx },
    /// Shift state variables and check for undefined vars
    ShiftAndCheck {},
    /// Get the current trace states for rendering
    GetTraceStates {},
    /// Reset the evaluator state
    Reset {},
}

/// Responses sent by the REPL evaluator
#[derive(Serialize, Debug)]
#[serde(tag = "response")]
enum ReplResponse {
    /// Confirmation of successful initialization
    Initialized { success: bool },
    /// Confirmation of table update
    TableUpdated { success: bool },
    /// Result of expression evaluation
    EvaluationResult {
        #[serde(flatten)]
        result: ReplResult,
    },
    /// Result of state shift
    ShiftResult {
        shifted: bool,
        missing_vars: Vec<String>,
    },
    /// Trace states in ITF format
    TraceStates { states: Vec<itf::Value> },
    /// Confirmation of reset
    ResetComplete {},
    /// Error response
    Error { message: String },
}

/// Wrapper for evaluation results to match TypeScript Either type
#[derive(Serialize, Debug)]
#[serde(untagged)]
enum ReplResult {
    Ok { ok: itf::Value },
    Err { err: crate::ir::QuintError },
}

/// Stateful REPL evaluator
pub struct ReplEvaluator {
    interpreter: Option<Interpreter>,
    env: Option<Env>,
    trace_states: Vec<Value>,
    verbosity: u8,
}

impl ReplEvaluator {
    pub fn new() -> Self {
        Self {
            interpreter: None,
            env: None,
            trace_states: Vec::new(),
            verbosity: 0,
        }
    }

    fn initialize(&mut self, table: LookupTable, seed: Option<u64>, verbosity: u8) -> ReplResponse {
        self.verbosity = verbosity;

        // Create the interpreter with the table
        self.interpreter = Some(Interpreter::new(&table));

        let storage = Rc::new(RefCell::new(Storage::default()));
        self.env = Some(if let Some(seed) = seed {
            Env::with_rand_state(storage, seed)
        } else {
            Env::new(storage)
        });

        self.trace_states = Vec::new();

        ReplResponse::Initialized { success: true }
    }

    fn update_table(&mut self, table: LookupTable) -> ReplResponse {
        // Update the interpreter's table if it exists, otherwise error
        match &mut self.interpreter {
            Some(interpreter) => {
                interpreter.update_table(&table);
            }
            None => {
                return ReplResponse::Error {
                    message: "Evaluator not initialized".to_string(),
                }
            }
        }

        ReplResponse::TableUpdated { success: true }
    }

    fn evaluate(&mut self, expr: QuintEx) -> ReplResponse {
        let interpreter = match &mut self.interpreter {
            Some(i) => i,
            None => {
                return ReplResponse::Error {
                    message: "Evaluator not initialized".to_string(),
                }
            }
        };

        let env = match &mut self.env {
            Some(e) => e,
            None => {
                return ReplResponse::Error {
                    message: "Evaluator not initialized".to_string(),
                }
            }
        };

        let compiled = interpreter.compile(&expr);

        match compiled.execute(env) {
            Ok(value) => {
                let result_itf = value.to_itf();
                ReplResponse::EvaluationResult {
                    result: ReplResult::Ok { ok: result_itf },
                }
            }
            Err(error) => ReplResponse::EvaluationResult {
                result: ReplResult::Err { err: error },
            },
        }
    }

    fn shift_and_check(&mut self) -> ReplResponse {
        let env = match &mut self.env {
            Some(e) => e,
            None => {
                return ReplResponse::Error {
                    message: "Evaluator not initialized".to_string(),
                }
            }
        };

        // Check for missing variables before shifting
        let mut missing_vars = Vec::new();
        let storage = env.var_storage.borrow();

        for (name, register) in storage.next_vars.iter() {
            let reg = register.borrow();
            if reg.value.is_none() {
                missing_vars.push(name.to_string());
            }
        }

        // Check if anything actually changed
        let any_changed = storage
            .next_vars
            .iter()
            .any(|(_, reg)| reg.borrow().value.is_some());

        drop(storage);

        if !any_changed {
            return ReplResponse::ShiftResult {
                shifted: false,
                missing_vars: vec![],
            };
        }

        // Save current state before shifting
        let storage_before_shift = env.var_storage.borrow().as_record();
        self.trace_states.push(storage_before_shift);

        // Shift the state
        env.var_storage.borrow_mut().shift_vars();

        ReplResponse::ShiftResult {
            shifted: true,
            missing_vars,
        }
    }

    fn get_trace_states(&self) -> ReplResponse {
        let states: Vec<itf::Value> = self.trace_states.iter().map(|v| v.to_itf()).collect();
        ReplResponse::TraceStates { states }
    }

    fn reset(&mut self) -> ReplResponse {
        if let Some(env) = &self.env {
            env.var_storage.borrow_mut().vars.clear();
            env.var_storage.borrow_mut().next_vars.clear();
        }
        self.trace_states.clear();
        ReplResponse::ResetComplete {}
    }

    fn handle_command(&mut self, command: ReplCommand) -> ReplResponse {
        match command {
            ReplCommand::Initialize {
                table,
                seed,
                verbosity,
            } => self.initialize(table, seed, verbosity),
            ReplCommand::UpdateTable { table } => self.update_table(table),
            ReplCommand::Evaluate { expr } => self.evaluate(expr),
            ReplCommand::ShiftAndCheck {} => self.shift_and_check(),
            ReplCommand::GetTraceStates {} => self.get_trace_states(),
            ReplCommand::Reset {} => self.reset(),
        }
    }
}

/// Run the REPL evaluator, reading commands from stdin and writing responses to stdout.
/// Commands and responses are line-delimited JSON (NDJSON).
pub fn run_repl_from_stdin() -> io::Result<()> {
    let stdin = io::stdin();
    let mut stdout = io::stdout();
    let mut evaluator = ReplEvaluator::new();

    for line in stdin.lock().lines() {
        let line = line?;

        // Parse the command
        let command: ReplCommand = match serde_json::from_str(&line) {
            Ok(cmd) => cmd,
            Err(e) => {
                // Send error response for invalid JSON
                let error_response = ReplResponse::Error {
                    message: format!("Invalid command JSON: {}", e),
                };
                serde_json::to_writer(&mut stdout, &error_response)?;
                stdout.write_all(b"\n")?;
                stdout.flush()?;
                continue;
            }
        };

        // Handle the command
        let response = evaluator.handle_command(command);

        // Send response
        serde_json::to_writer(&mut stdout, &response)?;
        stdout.write_all(b"\n")?;
        stdout.flush()?;
    }

    Ok(())
}
