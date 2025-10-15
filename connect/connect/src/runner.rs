//! Test runner that orchestrates trace generation and execution.
//!
//! This module coordinates the model-based testing workflow by generating
//! traces from Quint specifications and executing them through driver
//! implementations.

use crate::{
    Driver, Status,
    logger::*,
    trace::{self, Iter as TraceIter, Step, Trace},
};

/// Configuration for running model-based tests.
#[derive(Debug)]
pub struct Config {
    pub test_name: String,
    pub spec_path: String,
    pub main_action: Option<String>,
    pub max_samples: Option<usize>,
    pub max_steps: Option<usize>,
}

/// Generates traces from a Quint specification and executes them through the
/// given driver.
pub fn generate_traces_and_run(driver: impl Driver, opts: Config) {
    title!("Running model based tests for {}", opts.test_name);
    let traces = trace::generate(&opts);
    run_traces(driver, traces);
    success!("[OK] {} ...", opts.test_name);
}

fn run_traces(mut driver: impl Driver, traces: TraceIter) {
    info!("Executing generated traces ...");
    for (trace, i) in traces.zip(1..) {
        trace!("[Trace {}]", i);
        run_trace(&mut driver, trace);
    }
}

fn run_trace(driver: &mut impl Driver, trace: Trace) {
    for (i, state) in trace.states.into_iter().enumerate() {
        let step: Step = state.value.into();

        // TODO: figure out logging strategy that handles indentation properly.
        // TODO: avoid extracting action and nondet_picks multiple times (here
        // and at driver.step(..)).
        trace!(
            "[Step {}] {}\n{}\n     > State:\n{}\n",
            i,
            driver
                .action_taken(&step)
                .as_deref()
                .unwrap_or("<no_action>"),
            driver.nondet_picks(&step),
            &step
        );

        match driver.step(&step) {
            Status::Ok => (),
            Status::Done => break,
            Status::Unimplemented(action) => {
                error!("Unimplemented action found: {}", action);
                info!("Nondet picks:\n{}", driver.nondet_picks(&step));
                std::process::exit(1); // FIXME: return a Result instead.
            }
            Status::UnknownParam { action, param } => {
                error!("Unknown parameter `{}` in action `{}`", param, action);
                info!("Nondet picks:\n{}", driver.nondet_picks(&step));
                std::process::exit(1); // FIXME: return a Result instead.
            }
        }

        driver.check(step);
    }
}
