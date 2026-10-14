mod workloads;

use criterion::{black_box, criterion_group, criterion_main, Criterion};

pub fn criterion_benchmark(c: &mut Criterion) {
    let mut group = c.benchmark_group("evaluator");

    let parsed = workloads::parse_tictactoe();
    group.bench_function("tictactoe", |b| {
        b.iter(|| workloads::simulate(black_box(&parsed), 10))
    });

    let parsed = workloads::parse_jmt();
    group.bench_function("JMT", |b| {
        b.iter(|| workloads::simulate(black_box(&parsed), 3))
    });

    group.finish();

    let mut group = c.benchmark_group("values");
    for (name, expr) in workloads::WORKLOADS {
        let parsed = workloads::parse_expr(expr);
        group.bench_function(name, |b| {
            b.iter(|| workloads::eval_input(black_box(&parsed)))
        });
    }
    group.finish();
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
