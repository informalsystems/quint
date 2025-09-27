//! The CLI has two main commands:
//!  1. `run`: Runs the simulation on a file with specified parameters,
//!     to be used for development and tests.
//!  2. `simulate-from-stdin`: Reads input from standard input (STDIN) and
//!     simulates based on that input, used in the integration with the `quint` typescript tool.

use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::PathBuf;
use std::rc::Rc;
use std::sync::Arc;
use std::time::Instant;

use argh::FromArgs;
use eyre::bail;
use quint_evaluator::evaluator::{CompiledExpr, Env, EvalResult, Interpreter};
use quint_evaluator::ir::{QuintError, QuintEx, QuintName, QuintOutput};
use quint_evaluator::progress;
use quint_evaluator::simulator::{ParsedQuint, SimulationResult, TraceStatistics};
use quint_evaluator::value::*;
use quint_evaluator::{helpers, log};
use serde::{Deserialize, Serialize};

#[derive(FromArgs)]
#[argh(description = "Quint simulator")]
struct TopLevel {
    #[argh(subcommand)]
    command: Command,
}

#[derive(FromArgs)]
#[argh(subcommand)]
enum Command {
    Run(RunArgs),
    SimulateFromStdin(SimulateQuintArgs),
    Xxx(Xxx),
}

#[derive(FromArgs)]
#[argh(subcommand, description = "...", name = "xxx")]
struct Xxx {}

/// Run simulation with command-line arguments
#[derive(FromArgs)]
#[argh(subcommand, name = "run")]
struct RunArgs {
    /// the file to read
    #[argh(positional)]
    file: PathBuf,

    /// name of the initializer action (default: "init")
    #[argh(option, default = "\"init\".to_string()")]
    init: String,

    /// name of the step action (default: "step")
    #[argh(option, default = "\"step\".to_string()")]
    step: String,

    /// name of the invariant to check
    #[argh(option)]
    inv: Option<String>,

    /// name of the main module to check (default: computed from filename)
    #[argh(option)]
    main: Option<String>,

    /// the maximum on the number of steps in every trace (default: 10)
    #[argh(option, default = "10")]
    max_steps: usize,

    /// the maximum number of runs to attempt before giving up (default: 10_000)
    #[argh(option, default = "10000")]
    max_samples: usize,

    /// how many traces to generate (only affects output to out-itf) (default: 1)
    #[argh(option, default = "1")]
    n_traces: usize,
}

/// Run simulation with input from STDIN
#[derive(FromArgs)]
#[argh(subcommand, name = "simulate-from-stdin")]
struct SimulateQuintArgs {}

/// Data expected on STDIN for simulation
#[derive(Serialize, Deserialize)]
struct SimulateInput {
    parsed: ParsedQuint,
    source: String,
    witnesses: Vec<QuintEx>,
    nruns: usize,
    nsteps: usize,
    ntraces: usize,
    #[serde(default)]
    nthreads: usize,
}

#[derive(Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
enum SimulationStatus {
    #[serde(rename = "ok")]
    Success,
    Violation,
    Error,
}

/// Data to be written to STDOUT after simulation
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Outcome {
    status: SimulationStatus,
    errors: Vec<QuintError>,
    best_traces: Vec<SimulationTrace>,
    trace_statistics: TraceStatistics,
    witnessing_traces: Vec<usize>,
    samples: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SimulationTrace {
    seed: usize,
    states: itf::Trace<itf::Value>,
    result: bool,
}

/// The CLI has two main commands: 1. `run`: Runs the simulation on a file with
/// specified parameters, to be used for development and tests. 2.
/// `simulate-from-stdin`: Reads input from standard input (STDIN) and simulates
/// based on that input, used in the integration with the `quint` typescript tool.
fn main() -> eyre::Result<()> {
    let top_level: TopLevel = argh::from_env();

    match top_level.command {
        Command::Run(args) => run_simulation(args),
        Command::SimulateFromStdin(_) => simulate_from_stdin(),
        Command::Xxx(_) => {
            xxx();
            Ok(())
        }
    }
}

fn xxx() {
    let input = r#"{"stage":"compiling","warnings":[],"modules":[{"id":37,"name":"main","declarations":[{"id":34,"kind":"def","name":"init","qualifier":"val","expr":{"id":33,"kind":"bool","value":true}},{"id":36,"kind":"def","name":"step","qualifier":"val","expr":{"id":35,"kind":"bool","value":true}},{"id":32,"kind":"def","name":"input","qualifier":"val","expr":{"id":31,"kind":"app","opcode":"map","args":[{"id":10,"kind":"app","opcode":"tuples","args":[{"id":3,"kind":"app","opcode":"to","args":[{"id":1,"kind":"int","value":1},{"id":2,"kind":"int","value":100}]},{"id":6,"kind":"app","opcode":"to","args":[{"id":4,"kind":"int","value":1},{"id":5,"kind":"int","value":100}]},{"id":9,"kind":"app","opcode":"to","args":[{"id":7,"kind":"int","value":1},{"id":8,"kind":"int","value":100}]}]},{"id":30,"kind":"lambda","params":[{"id":17,"name":"quintTupledLambdaParam17_30"}],"qualifier":"def","expr":{"id":26,"kind":"let","opdef":{"id":13,"kind":"def","name":"c","qualifier":"pureval","expr":{"id":27,"kind":"app","opcode":"item","args":[{"id":28,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":29,"kind":"int","value":3}]}},"expr":{"id":22,"kind":"let","opdef":{"id":12,"kind":"def","name":"b","qualifier":"pureval","expr":{"id":23,"kind":"app","opcode":"item","args":[{"id":24,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":25,"kind":"int","value":2}]}},"expr":{"id":18,"kind":"let","opdef":{"id":11,"kind":"def","name":"a","qualifier":"pureval","expr":{"id":19,"kind":"app","opcode":"item","args":[{"id":20,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":21,"kind":"int","value":1}]}},"expr":{"id":16,"kind":"app","opcode":"iadd","args":[{"id":14,"kind":"name","name":"a"},{"id":15,"kind":"name","name":"b"}]}}}}}]}},{"id":39,"kind":"def","name":"q::init","qualifier":"action","expr":{"id":38,"kind":"name","name":"init"}},{"id":41,"kind":"def","name":"q::step","qualifier":"action","expr":{"id":40,"kind":"name","name":"step"}}]}],"table":{"11":{"id":11,"kind":"def","name":"a","qualifier":"pureval","expr":{"id":19,"kind":"app","opcode":"item","args":[{"id":20,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":21,"kind":"int","value":1}]},"depth":5},"12":{"id":12,"kind":"def","name":"b","qualifier":"pureval","expr":{"id":23,"kind":"app","opcode":"item","args":[{"id":24,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":25,"kind":"int","value":2}]},"depth":4},"13":{"id":13,"kind":"def","name":"c","qualifier":"pureval","expr":{"id":27,"kind":"app","opcode":"item","args":[{"id":28,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":29,"kind":"int","value":3}]},"depth":3},"14":{"id":11,"kind":"def","name":"a","qualifier":"pureval","expr":{"id":19,"kind":"app","opcode":"item","args":[{"id":20,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":21,"kind":"int","value":1}]},"depth":5},"15":{"id":12,"kind":"def","name":"b","qualifier":"pureval","expr":{"id":23,"kind":"app","opcode":"item","args":[{"id":24,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":25,"kind":"int","value":2}]},"depth":4},"20":{"id":17,"name":"quintTupledLambdaParam17_30","kind":"param","depth":1},"24":{"id":17,"name":"quintTupledLambdaParam17_30","kind":"param","depth":1},"28":{"id":17,"name":"quintTupledLambdaParam17_30","kind":"param","depth":1},"32":{"id":32,"kind":"def","name":"input","qualifier":"val","expr":{"id":31,"kind":"app","opcode":"map","args":[{"id":10,"kind":"app","opcode":"tuples","args":[{"id":3,"kind":"app","opcode":"to","args":[{"id":1,"kind":"int","value":1},{"id":2,"kind":"int","value":100}]},{"id":6,"kind":"app","opcode":"to","args":[{"id":4,"kind":"int","value":1},{"id":5,"kind":"int","value":100}]},{"id":9,"kind":"app","opcode":"to","args":[{"id":7,"kind":"int","value":1},{"id":8,"kind":"int","value":100}]}]},{"id":30,"kind":"lambda","params":[{"id":17,"name":"quintTupledLambdaParam17_30"}],"qualifier":"def","expr":{"id":26,"kind":"let","opdef":{"id":13,"kind":"def","name":"c","qualifier":"pureval","expr":{"id":27,"kind":"app","opcode":"item","args":[{"id":28,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":29,"kind":"int","value":3}]}},"expr":{"id":22,"kind":"let","opdef":{"id":12,"kind":"def","name":"b","qualifier":"pureval","expr":{"id":23,"kind":"app","opcode":"item","args":[{"id":24,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":25,"kind":"int","value":2}]}},"expr":{"id":18,"kind":"let","opdef":{"id":11,"kind":"def","name":"a","qualifier":"pureval","expr":{"id":19,"kind":"app","opcode":"item","args":[{"id":20,"kind":"name","name":"quintTupledLambdaParam17_30"},{"id":21,"kind":"int","value":1}]}},"expr":{"id":16,"kind":"app","opcode":"iadd","args":[{"id":14,"kind":"name","name":"a"},{"id":15,"kind":"name","name":"b"}]}}}}}]},"depth":0},"34":{"id":34,"kind":"def","name":"init","qualifier":"val","expr":{"id":33,"kind":"bool","value":true},"depth":0},"36":{"id":36,"kind":"def","name":"step","qualifier":"val","expr":{"id":35,"kind":"bool","value":true},"depth":0},"38":{"id":34,"kind":"def","name":"init","qualifier":"val","expr":{"id":33,"kind":"bool","value":true},"depth":0},"39":{"id":39,"kind":"def","name":"q::init","qualifier":"action","expr":{"id":38,"kind":"name","name":"init"},"depth":0},"40":{"id":36,"kind":"def","name":"step","qualifier":"val","expr":{"id":35,"kind":"bool","value":true},"depth":0},"41":{"id":41,"kind":"def","name":"q::step","qualifier":"action","expr":{"id":40,"kind":"name","name":"step"},"depth":0}},"types":{"1":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"2":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"3":{"typeVariables":[],"rowVariables":[],"type":{"id":4,"kind":"set","elem":{"id":3,"kind":"int"}}},"4":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"5":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"6":{"typeVariables":[],"rowVariables":[],"type":{"id":4,"kind":"set","elem":{"id":3,"kind":"int"}}},"7":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"8":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"9":{"typeVariables":[],"rowVariables":[],"type":{"id":4,"kind":"set","elem":{"id":3,"kind":"int"}}},"10":{"typeVariables":[],"rowVariables":[],"type":{"kind":"set","elem":{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":3,"kind":"int"}},{"fieldName":"1","fieldType":{"id":3,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}},"id":10},"id":11}},"11":{"typeVariables":[],"rowVariables":[],"type":{"id":1,"kind":"int"}},"12":{"typeVariables":[],"rowVariables":[],"type":{"id":2,"kind":"int"}},"13":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"14":{"typeVariables":[],"rowVariables":[],"type":{"id":1,"kind":"int"}},"15":{"typeVariables":[],"rowVariables":[],"type":{"id":2,"kind":"int"}},"16":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"17":{"typeVariables":[],"rowVariables":[],"type":{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":1,"kind":"int"}},{"fieldName":"1","fieldType":{"id":2,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}}}},"18":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"19":{"typeVariables":[],"rowVariables":[],"type":{"id":1,"kind":"int"}},"20":{"typeVariables":[],"rowVariables":[],"type":{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":1,"kind":"int"}},{"fieldName":"1","fieldType":{"id":2,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}}}},"21":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"22":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"23":{"typeVariables":[],"rowVariables":[],"type":{"id":2,"kind":"int"}},"24":{"typeVariables":[],"rowVariables":[],"type":{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":1,"kind":"int"}},{"fieldName":"1","fieldType":{"id":2,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}}}},"25":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"26":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"27":{"typeVariables":[],"rowVariables":[],"type":{"id":3,"kind":"int"}},"28":{"typeVariables":[],"rowVariables":[],"type":{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":1,"kind":"int"}},{"fieldName":"1","fieldType":{"id":2,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}}}},"29":{"typeVariables":[],"rowVariables":[],"type":{"kind":"int"}},"30":{"typeVariables":[],"rowVariables":[],"type":{"kind":"oper","args":[{"kind":"tup","fields":{"kind":"row","fields":[{"fieldName":"0","fieldType":{"id":1,"kind":"int"}},{"fieldName":"1","fieldType":{"id":2,"kind":"int"}},{"fieldName":"2","fieldType":{"id":3,"kind":"int"}}],"other":{"kind":"empty"}}}],"res":{"id":3,"kind":"int"}}},"31":{"typeVariables":[],"rowVariables":[],"type":{"kind":"set","elem":{"id":3,"kind":"int"},"id":7}},"32":{"typeVariables":[],"rowVariables":[],"type":{"kind":"set","elem":{"id":3,"kind":"int"},"id":7}},"33":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"34":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"35":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"36":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"38":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"39":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"40":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}},"41":{"typeVariables":[],"rowVariables":[],"type":{"kind":"bool"}}},"effects":{"1":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"2":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"3":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"4":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"5":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"6":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"7":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"8":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"9":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"10":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"11":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]}},"12":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]}},"13":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]}},"14":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"15":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"16":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"17":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"18":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"19":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"20":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"21":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"22":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"23":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"24":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"25":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"26":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"27":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"28":{"effect":{"kind":"concrete","components":[{"kind":"read","entity":{"kind":"variable","name":"_v18"}}]},"effectVariables":[],"entityVariables":[]},"29":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"30":{"effect":{"kind":"arrow","params":[{"kind":"concrete","components":[]}],"result":{"kind":"concrete","components":[]}},"effectVariables":[],"entityVariables":[]},"31":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"32":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[]}},"33":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"34":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[]}},"35":{"effect":{"kind":"concrete","components":[]},"effectVariables":[],"entityVariables":[]},"36":{"effectVariables":[],"entityVariables":[],"effect":{"kind":"concrete","components":[]}}},"errors":[],"main":"main"}"#;
    let parsed: QuintOutput = serde_json::from_str(input).unwrap();
    let def = parsed.find_definition_by_name("input").unwrap();

    let mut interpreter = Interpreter::new(&parsed.table);
    let mut env = Env::new(interpreter.var_storage.clone());

    dbg!(std::mem::size_of::<Value>());
    dbg!(std::mem::size_of::<i64>());
    dbg!(std::mem::size_of::<bool>());
    dbg!(std::mem::size_of::<Str>());
    dbg!(std::mem::size_of::<ImmutableSet<Value>>());
    dbg!(std::mem::size_of::<ImmutableVec<Value>>());
    dbg!(std::mem::size_of::<ImmutableMap<QuintName, Value>>());
    dbg!(std::mem::size_of::<ImmutableMap<Value, Value>>());
    dbg!(std::mem::size_of::<Vec<Rc<RefCell<EvalResult>>>>());
    dbg!(std::mem::size_of::<CompiledExpr>());
    dbg!(std::mem::size_of::<Box<Value>>());
    dbg!(std::mem::size_of::<Rc<Value>>());
    dbg!(std::mem::size_of::<Vec<Value>>());
    dbg!(std::mem::size_of::<Vec<Value>>());
    dbg!(std::mem::size_of::<Cow<HashMap<Value, Value>>>());

    println!("Running...");
    let value = interpreter.eval(&mut env, def.expr.clone());
    match value {
        Ok(v) => assert!(v.to_string().contains("Set")),
        Err(e) => panic!("Error in simulation: {e}"),
    };
    println!("DONE!");
}

/// Utility to run the simulation with command-line arguments. Not meant to be
/// user-facing, but quite useful for development and testing. This calls the
/// `quint` typescript binary to parse the provided file (expects `quint` to be
/// installed and in the PATH).
fn run_simulation(args: RunArgs) -> eyre::Result<()> {
    log::set_json(false);

    if !fs::exists(&args.file)? {
        bail!("File not found: {}", args.file.display());
    }

    log!("Parsing", "Parsing file: {}", args.file.display());
    let parsed = helpers::parse_from_path(
        &args.file,
        args.init.as_str(),
        args.step.as_str(),
        args.inv.as_deref(),
        args.main.as_deref(),
    )
    .unwrap();

    let start = Instant::now();
    log!("Simulation", "Starting simulation");
    let result = parsed.simulate(
        args.max_steps,
        args.max_samples,
        args.n_traces,
        progress::no_report(),
    );

    let elapsed = start.elapsed();

    match result {
        Ok(result) => {
            log!("Result", "{}", result.result);
            for (i, trace) in result.best_traces.into_iter().enumerate() {
                let itf_trace = trace.to_itf(args.file.display().to_string());
                let json_data = serde_json::to_string(&itf_trace)?;
                let filename = format!("out_{i}.itf.json");
                let mut file = File::create(filename.clone())?;
                file.write_all(json_data.as_bytes())?;
                log!("Trace", "{filename}")
            }
        }
        Err(e) => log!("Error", "Simulation failed: {e}"),
    }

    log!("Elapsed", "{elapsed:.2?}");
    Ok(())
}

/// Reads input from standard input (STDIN), parses it, and performs a simulation based on the parsed input.
/// The result of the simulation is then printed in JSON format to standard output (STDOUT).
fn simulate_from_stdin() -> eyre::Result<()> {
    log::set_json(true);

    // Read all input from STDIN
    let mut input = String::new();
    io::stdin().read_to_string(&mut input)?;

    let SimulateInput {
        source,
        parsed,
        nsteps,
        nruns,
        ntraces,
        nthreads,
        ..
    } = serde_json::from_str(&input)?;

    let source = Arc::new(source);

    let outcome = if nthreads > 1 {
        simulate_in_parallel(source, parsed, nsteps, nruns, ntraces, nthreads)
    } else {
        let reporter = progress::json_std_err_report(nruns);
        let result = parsed.simulate(nsteps, nruns, ntraces, reporter);
        to_outcome(source, result)
    };

    // Serialize the outcome to JSON and print it to STDOUT
    println!("{}", serde_json::to_string(&outcome)?);

    Ok(())
}

/// Run simulation in parallel. It splits the `nruns` across `nthreads`. It
/// returns the outcome of the first non-successful thread, or the last
/// successful if all succeeded.
fn simulate_in_parallel(
    source: Arc<String>,
    parsed: ParsedQuint,
    nsteps: usize,
    nruns: usize,
    ntraces: usize,
    mut nthreads: usize,
) -> Outcome {
    assert!(nthreads > 1, "nthreads must be > 1");
    let mut threads = Vec::with_capacity(nthreads);
    let (out_tx, out_rx) = std::sync::mpsc::channel();
    let reporter_thread = progress::spawn_reporter_thread(nruns);

    for i in 0..nthreads {
        // FIXME: it should be possible to share the `ParsedQuint` across
        // threads since it's immutable after the parsing phase. However, its
        // internals use data structures that are thread-local. We'll clone the
        // whole `ParsedQuint` here for now.
        let parsed = parsed.clone();

        // In the case of a non-exact split, the first thread executes the
        // remain runs because it'll probably have the most CPU time avaible
        // since it starts before the other threads.
        let nruns = if i == 0 {
            (nruns / nthreads) + (nruns % nthreads)
        } else {
            nruns / nthreads
        };

        let reporter = Arc::clone(&reporter_thread.reporter);
        let source = Arc::clone(&source);
        let out_tx = out_tx.clone();

        let thread = std::thread::Builder::new()
            .name(format!("simulator-thread-{}", i))
            .spawn(move || {
                let result = parsed.simulate(nsteps, nruns, ntraces, reporter);
                let outcome = to_outcome(source, result);
                let _ = out_tx.send(outcome);
            })
            .expect("failed to spawn simulator thread");

        threads.push(thread);
    }

    let mut samples = 0;
    loop {
        let mut outcome = out_rx.recv().expect("closed channel");
        samples += outcome.samples;
        nthreads -= 1;
        if nthreads == 0 || outcome.status != SimulationStatus::Success {
            // Report back the total number of samples executed by all threads
            // instead of just this one. Note that trace statistics are
            // preserved, meaning that the final report will correspond to the
            // trace statistics of a single thread. Presuming the workload is
            // homogeneous (no thread is performing work that is significantly
            // different from the other threads), the report should still be
            // statistically correct when all threads succeed.
            outcome.samples = samples;
            return outcome;
        }
    }
}

/// Converts the result of a simulation into an `Outcome` struct.
///
/// The status is determined based on whether the simulation result indicates success, violation, or error.
/// Errors are collected into a vector if any are present.
/// Best traces are converted to the intermediate trace format (ITF).
fn to_outcome(source: Arc<String>, result: Result<SimulationResult, QuintError>) -> Outcome {
    let status = match &result {
        Ok(r) if r.result => SimulationStatus::Success,
        Ok(_) => SimulationStatus::Violation,
        Err(_) => SimulationStatus::Error,
    };

    let errors = result
        .as_ref()
        .err()
        .map_or_else(Vec::new, |e| vec![e.clone()]);

    let best_traces = result.as_ref().ok().map_or_else(Vec::new, |r| {
        r.best_traces
            .iter()
            .cloned()
            .map(|t| SimulationTrace {
                // TODO: Fetch seed from the random generator state
                seed: 0,
                states: t.clone().to_itf((*source).clone()),
                result: !t.violation,
            })
            .collect()
    });

    Outcome {
        status,
        errors,
        best_traces,
        trace_statistics: result
            .as_ref()
            .ok()
            .map_or_else(TraceStatistics::default, |r| r.trace_statistics.clone()),
        samples: result.as_ref().map_or(0, |r| r.samples),
        // TODO: This simulator is not tracking witnesses yet
        witnessing_traces: vec![],
    }
}
