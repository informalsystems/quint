use crate::{logger::*, runner::Config, trace::Iter};
use std::{fmt::Display, path::Path, process::Command};
use tempdir::TempDir;

/// The default number of traces to generate.
const DEFAULT_TRACES: usize = 100;

/// Generates execution traces by invoking the Quint CLI.
///
/// Creates a temporary directory, runs `quint run` with the specified
/// configuration, and returns an iterator over the generated trace files.
pub fn generate(opts: &Config) -> Iter {
    let n_traces = opts.max_samples.unwrap_or(DEFAULT_TRACES).to_string();
    info!("Generating {} traces for {} ...", n_traces, opts.test_name);

    let temp_dir = TempDir::new(format!("{}_traces", opts.test_name).as_str())
        .expect("failed to create temporary directory");

    let mut cmd = Command::new("quint");
    cmd.arg("run")
        .arg(Path::new(&opts.spec_path))
        .arg("--n-traces")
        .arg(n_traces.clone())
        .arg("--max-samples")
        .arg(n_traces)
        .arg("--out-itf")
        .arg(format!(
            "{}/trace_{{seq}}.itf.json",
            temp_dir.path().to_str().unwrap()
        ))
        .arg("--mbt")
        .arg("--verbosity")
        .arg("0");

    opt_arg(&mut cmd, "--main", &opts.main_action);
    opt_arg(&mut cmd, "--max-steps", &opts.max_steps);

    match cmd.output() {
        Ok(out) => {
            if out.status.success() {
                Iter::new(temp_dir)
            } else {
                info!("{}", String::from_utf8(out.stderr).unwrap().trim_end());
                error!("Quint returned non-zero code. Please check your spec.");
                std::process::exit(1); // FIXME: return a Result instead.
            }
        }
        Err(err) => {
            panic!("unexpected error while generating traces: {}", err);
        }
    }
}

fn opt_arg<A: Display>(cmd: &mut Command, name: &str, value: &Option<A>) {
    if let Some(value) = value {
        cmd.arg(name).arg(value.to_string());
    }
}
