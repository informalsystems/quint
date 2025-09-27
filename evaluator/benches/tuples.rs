use std::borrow::Cow;
use std::collections::HashSet;
use std::process::Command;
use std::process::Stdio;
use std::{io::Write, time::Duration};

use criterion::{criterion_group, criterion_main, Criterion};
use itertools::Itertools;
use quint_evaluator::value::ImmutableSet;
use quint_evaluator::value::ImmutableVec;
use quint_evaluator::{evaluator::run, ir::QuintOutput};
use tempfile::NamedTempFile;

fn run_in_rust(input: &str) -> Result<(), Box<dyn std::error::Error>> {
    let quint_content = format!(
        "module main {{
          val input = {input}
          val init = true
          val step = true
        }}"
    );

    // A unique filename so multiple tests can run in parallel
    let mut file = NamedTempFile::new()?;

    file.write_all(quint_content.as_bytes())?;

    let output = Command::new("quint")
        .arg("compile")
        .arg(file.path())
        .stdout(std::process::Stdio::piped())
        .output()
        .unwrap();

    let serialized_quint = String::from_utf8(output.stdout).unwrap();

    let parsed: QuintOutput = serde_json::from_str(serialized_quint.as_str()).unwrap();

    let def = parsed.find_definition_by_name("input").unwrap();

    let value = run(&parsed.table, &def.expr);
    match value {
        Ok(v) => assert!(v.to_string().contains("Set")),
        Err(e) => panic!("Error in simulation: {e}"),
    };

    Ok(())
}

fn run_in_quint_repl(input: &str) -> Result<(), Box<dyn std::error::Error>> {
    let quint_content = format!(
        "module main {{
          val input = {input}
          val init = true
          val step = true
        }}"
    );

    // A unique filename so multiple tests can run in parallel
    let mut file = NamedTempFile::new()?;
    file.write_all(quint_content.as_bytes())?;

    let mut quint = Command::new("quint")
        .arg("-r")
        .arg(format!("{}::{}", file.path().display(), "main"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();

    {
        let mut stdin = quint.stdin.take().unwrap();
        stdin.write_all(b"input").unwrap();
    }

    let output = quint.wait_with_output().unwrap();
    let result = std::str::from_utf8(&output.stdout).unwrap();
    assert!(result.contains("Set"));

    Ok(())
}

pub fn criterion_benchmark(c: &mut Criterion) {
    let mut group = c.benchmark_group("tuples");
    group.sample_size(10);
    group.warm_up_time(Duration::from_secs(10));
    group.measurement_time(Duration::from_secs(10));

    let tuples_expression = "tuples(1.to(100), 1.to(100), 1.to(100)).map(((a, b, c)) => a + b)";
    group.bench_function("rust", |b| b.iter(|| run_in_rust(tuples_expression)));
    group.bench_function("typescript", |b| {
        b.iter(|| run_in_quint_repl(tuples_expression))
    });
    group.finish();
}

#[derive(Eq, PartialEq, Hash, Clone)]
enum AValue {
    Int(i64),
    Tuple(Vec<AValue>),
    CrossProduct(Vec<AValue>),
    Interval(i64, i64),
}

impl AValue {
    fn as_set(self) -> HashSet<AValue, fxhash::FxBuildHasher> {
        match self {
            Self::Interval(start, end) => {
                let mut res = HashSet::with_capacity_and_hasher(
                    (end - start) as usize,
                    fxhash::FxBuildHasher::default(),
                );
                res.extend((start..=end).map(AValue::Int));
                res
            }
            Self::CrossProduct(sets) => {
                let mut inner_sets = Vec::with_capacity(sets.len());
                let mut cardinality = 1;
                for set in sets {
                    let set = set.as_set();
                    cardinality *= set.len();
                    inner_sets.push(set);
                }
                let mut res = HashSet::with_capacity_and_hasher(
                    cardinality,
                    fxhash::FxBuildHasher::default(),
                );
                res.extend(
                    inner_sets
                        .iter()
                        .multi_cartesian_product()
                        .map(|product| AValue::Tuple(product.into_iter().cloned().collect())),
                );
                res
            }
            _ => panic!("not a set"),
        }
    }
}

#[derive(Eq, PartialEq, Hash, Clone)]
enum BValue {
    Int(i64),
    Tuple(ImmutableVec<BValue>),
    CrossProduct(Vec<BValue>),
    Interval(i64, i64),
}

impl BValue {
    fn as_set(&self) -> Cow<'_, ImmutableSet<BValue>> {
        match self {
            Self::Interval(start, end) => Cow::Owned((*start..=*end).map(BValue::Int).collect()),
            Self::CrossProduct(sets) => {
                #[allow(clippy::unnecessary_to_owned)] // False positive
                let product_sets = sets
                    .iter()
                    .map(|set| set.as_set().into_owned().into_iter().collect::<Vec<_>>())
                    .multi_cartesian_product()
                    .map(|product| BValue::Tuple(ImmutableVec::from(product)))
                    .collect::<ImmutableSet<_>>();

                Cow::Owned(product_sets)
            }
            _ => panic!("not a set"),
        }
    }
}

pub fn experiment(c: &mut Criterion) {
    let mut group = c.benchmark_group("experiment");
    group.sample_size(10);
    group.warm_up_time(Duration::from_secs(10));
    group.measurement_time(Duration::from_secs(10));

    group.bench_function("before", |b| {
        b.iter(|| {
            let value = BValue::CrossProduct(vec![
                BValue::Interval(0, 100),
                BValue::Interval(0, 100),
                BValue::Interval(0, 100),
            ]);
            value.as_set().into_owned()
        })
    });
    group.bench_function("after", |b| {
        b.iter(|| {
            let value = AValue::CrossProduct(vec![
                AValue::Interval(0, 100),
                AValue::Interval(0, 100),
                AValue::Interval(0, 100),
            ]);
            value.as_set()
        })
    });
    group.finish();
}

criterion_group!(benches, criterion_benchmark, experiment);
criterion_main!(benches);
