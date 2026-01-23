use std::{
    cell::RefCell,
    env,
    io::Write,
    path::PathBuf,
    process::{Command, Stdio},
    rc::Rc,
};

use serde::Deserialize;

use quint_evaluator::{
    builtins::compile_eager_op,
    evaluator::{Env, Interpreter, run},
    helpers,
    ir::QuintName,
    storage::Storage,
    value::{ImmutableMap, Str, Value},
};

#[derive(Deserialize, Debug)]
struct TsError {
    code: String,
    message: String,
}

#[derive(Deserialize, Debug)]
struct TsOutput {
    ok: bool,
    value: Option<String>,
    #[serde(rename = "traceLen")]
    trace_len: Option<usize>,
    error: Option<TsError>,
}

fn ts_eval(input: serde_json::Value) -> TsOutput {
    let evaluator_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("quint");

    let mut cmd = Command::new("node");
    cmd.current_dir(&evaluator_dir)
        .arg("-r")
        .arg("ts-node/register")
        .arg("test/runtime/rustParityEval.ts")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit());

    let mut child = cmd.spawn().expect("failed to spawn node");
    let input_str = serde_json::to_string(&input).expect("failed to serialize input");
    child
        .stdin
        .as_mut()
        .expect("failed to open stdin")
        .write_all(input_str.as_bytes())
        .expect("failed to write stdin");

    let output = child.wait_with_output().expect("failed to read output");
    assert!(
        output.status.success(),
        "node process failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    serde_json::from_slice(&output.stdout).expect("failed to parse output")
}

fn eval_rust_expr(
    expr: &str,
    context: Option<&str>,
) -> Result<String, quint_evaluator::ir::QuintError> {
    let context_block = context.unwrap_or("");
    let quint_content = format!(
        "module main {{
          {context_block}
          val expr = {expr}
          val init = true
          val step = true
        }}"
    );

    let parsed = helpers::parse(&quint_content, "init", "step", None).unwrap();
    let input_def = parsed.find_definition_by_name("expr").unwrap();
    let value = run(&parsed.table, &input_def.expr)?;
    Ok(format!("{}", value.normalize()))
}

fn trace_len_after_run(callee: &str, input: &str) -> Result<usize, quint_evaluator::ir::QuintError> {
    let quint_content = format!(
        "module main {{
          val init = true
          val step = true
          {input}
        }}"
    );

    let parsed = helpers::parse(&quint_content, "init", "step", None).unwrap();
    let run_def = parsed.find_definition_by_name(callee).unwrap();
    let mut interpreter = Interpreter::new(&parsed.table);
    let mut env = Env::new(Rc::clone(&interpreter.var_storage));

    interpreter.eval(&mut env, run_def.expr.clone())?;
    env.shift();
    Ok(env.trace.len())
}

fn assert_eval_parity(expr: &str) {
    assert_eval_parity_with_context(expr, None);
}

fn assert_eval_parity_with_context(expr: &str, context: Option<&str>) {
    let ts_output = ts_eval(serde_json::json!({ "mode": "eval", "expr": expr, "context": context }));
    let rust_output = eval_rust_expr(expr, context);

    match (ts_output.ok, rust_output) {
        (true, Ok(value)) => {
            assert_eq!(ts_output.value.as_deref(), Some(value.as_str()));
        }
        (false, Err(err)) => {
            assert_eq!(ts_output.error.as_ref().map(|e| e.code.as_str()), Some(err.code.as_str()));
            assert_eq!(
                ts_output.error.as_ref().map(|e| e.message.as_str()),
                Some(err.message.as_str())
            );
        }
        (true, Err(err)) => panic!("TypeScript ok, Rust error: {:?}", err),
        (false, Ok(value)) => panic!("TypeScript error, Rust ok: {value}"),
    }
}

fn assert_builtin_field_missing_parity(field: &str) {
    let ts_output = ts_eval(serde_json::json!({ "mode": "builtinField", "field": field }));

    let mut record_map: ImmutableMap<QuintName, Value> = ImmutableMap::new();
    record_map.insert(QuintName::from("a"), Value::int(1));
    let record = Value::record(record_map);
    let args = vec![record, Value::str(Str::from(field))];
    let mut env = Env::new(Rc::new(RefCell::new(Storage::default())));
    let rust_output = compile_eager_op("field").execute(&mut env, args);

    match (ts_output.ok, rust_output) {
        (true, Ok(_value)) => panic!("TypeScript ok, Rust ok for missing field"),
        (false, Err(err)) => {
            assert_eq!(ts_output.error.as_ref().map(|e| e.code.as_str()), Some(err.code.as_str()));
            assert_eq!(
                ts_output.error.as_ref().map(|e| e.message.as_str()),
                Some(err.message.as_str())
            );
        }
        (true, Err(err)) => panic!("TypeScript ok, Rust error: {:?}", err),
        (false, Ok(value)) => panic!("TypeScript error, Rust ok: {value}"),
    }
}

#[test]
fn parity_assert_return_value() {
    assert_eval_parity("assert(1 == 1)");
}

#[test]
fn parity_missing_field_error() {
    assert_builtin_field_missing_parity("b");
}

#[test]
fn parity_negative_modulo() {
    assert_eval_parity("(-5) % 2");
}

#[test]
fn parity_expect_trace_length() {
    let context = "var n: int\nrun run1 = (n' = 0).then(n' = 3).expect(n == 3)\n";
    let ts_output = ts_eval(serde_json::json!({
        "mode": "trace",
        "callee": "run1",
        "context": context
    }));

    let rust_trace_len = trace_len_after_run("run1", context).unwrap();
    assert_eq!(ts_output.trace_len, Some(rust_trace_len));
}
