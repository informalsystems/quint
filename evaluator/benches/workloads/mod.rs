//! Seeded, in-process workloads shared by the criterion bench and the
//! allocation counter.
//!
//! A subdirectory module rather than `benches/workloads.rs` so Cargo's bench
//! auto-discovery does not build it as its own target. Parsing shells out to
//! the TypeScript `quint compile`; callers do it once, outside any timed or
//! counted region, and the workload functions only evaluate.

use std::path::Path;

use quint_evaluator::evaluator::{run, Env, Interpreter};
use quint_evaluator::helpers;
use quint_evaluator::ir::QuintOutput;
use quint_evaluator::simulator::ParsedQuint;
use quint_evaluator::value::Value;
use quint_evaluator::Verbosity;

/// Parses the tictactoe fixture (subprocess). Paths are relative to the crate
/// root, the cwd `cargo bench` runs benches from.
pub fn parse_tictactoe() -> ParsedQuint {
    helpers::parse_from_path(
        Path::new("fixtures/tictactoe.qnt"),
        "init",
        "step",
        Some("inv"),
        None,
    )
    .unwrap()
}

/// Parses the JMT fixture (subprocess).
pub fn parse_jmt() -> ParsedQuint {
    helpers::parse_from_path(
        Path::new("fixtures/jmt/apply_state_machine.qnt"),
        "init",
        "step_fancy",
        Some("allInvariants"),
        None,
    )
    .unwrap()
}

/// One seeded sample (seed 0x42) of `steps` steps, checking the first invariant
/// before every step.
pub fn simulate(parsed: &ParsedQuint, steps: usize) {
    let mut interpreter = Interpreter::new(parsed.table.clone());
    let mut env = Env::with_rand_state(interpreter.var_storage.clone(), 0x42, Verbosity::default());

    let init = interpreter.compile(&parsed.init);
    let step = interpreter.compile(&parsed.step);
    let invariant = interpreter.compile(&parsed.invariants[0]);

    init.execute(&mut env).expect("init failed");
    for _ in 1..=steps {
        interpreter.shift();
        invariant.execute(&mut env).expect("invariant failed");
        step.execute(&mut env).expect("step failed");
    }
}

/// `(name, expression)` workloads evaluated by both benches.
pub const WORKLOADS: [(&str, &str); 6] = [
    // Int-heavy: `Value::int` construction, `as_int`, and `Hash`/`Eq` of ints
    // inside imbl sets and records.
    ("int_fold", "1.to(200000).fold(0, (acc, i) => acc + i)"),
    (
        "int_set_membership",
        "val s = 1.to(50000).map(i => i * 3)  1.to(50000).forall(i => (i * 3).in(s))",
    ),
    (
        "int_records",
        "1.to(20000).map(i => { a: i, b: i % 7, c: i > 100 }).filter(r => r.b == 0).size()",
    ),
    // String-heavy counterparts: `Value::str` clone, `Hash`/`Eq` of strings as
    // set members, record fields and map keys.
    (
        "str_set_membership",
        r#"val s = Set("idle", "busy", "done", "init", "stop", "wait", "run", "halt")
    1.to(50000).forall(i => "busy".in(s) and not("crash".in(s)))"#,
    ),
    (
        "str_records",
        r#"1.to(20000).map(i => { name: if (i % 3 == 0) "alice" else "bob", n: i })
    .filter(r => r.name == "alice").size()"#,
    ),
    (
        "str_map_keys",
        r#"val m = Set("alice", "bob", "carol", "dave").mapBy(n => 0)
    1.to(50000).fold(m, (acc, i) => acc.setBy("bob", v => v + 1)).get("bob")"#,
    ),
];

/// Wraps `expr` in `module main { val input = <expr> }` and parses it (subprocess).
pub fn parse_expr(expr: &str) -> QuintOutput {
    let quint_content = format!(
        "module main {{
          val input = {expr}
        }}"
    );
    helpers::parse(&quint_content, None).expect("quint compile failed")
}

/// Evaluates the `input` definition; the caller black-boxes the result.
pub fn eval_input(parsed: &QuintOutput) -> Value {
    let def = parsed.find_definition_by_name("input").unwrap();
    run(&parsed.table, &def.expr).expect("evaluation failed")
}
