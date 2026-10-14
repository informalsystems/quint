//! Runs each shared workload once under a counting global allocator and prints
//! its allocation count and bytes to stderr.
//!
//! Timing is noisy; the allocation count of a seeded workload is exact and
//! identical across machines, so it is the deterministic before/after number
//! for changes to `Value`'s representation. Not a `#[test]` with asserted
//! counts: those would go stale on every unrelated change. Diff the output by
//! hand.

mod workloads;

use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering::Relaxed};

struct Counting;

static ALLOCS: AtomicUsize = AtomicUsize::new(0);
static BYTES: AtomicUsize = AtomicUsize::new(0);

unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        ALLOCS.fetch_add(1, Relaxed);
        BYTES.fetch_add(layout.size(), Relaxed);
        System.alloc(layout)
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        System.dealloc(ptr, layout)
    }

    // A realloc counts as one allocation of the new size.
    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
        ALLOCS.fetch_add(1, Relaxed);
        BYTES.fetch_add(new_size, Relaxed);
        System.realloc(ptr, layout, new_size)
    }
}

#[global_allocator]
static A: Counting = Counting;

fn measure(name: &str, f: impl FnOnce()) {
    ALLOCS.store(0, Relaxed);
    BYTES.store(0, Relaxed);
    f();
    // stderr keeps stdout clean for `cargo criterion --message-format=json`.
    eprintln!(
        "{name:<24} allocs={:>10} bytes={:>12}",
        ALLOCS.load(Relaxed),
        BYTES.load(Relaxed)
    );
}

fn main() {
    // Parsing (subprocess + JSON) happens outside `measure`, so only
    // evaluation is counted. Optional filter, the first argument not starting
    // with `--` (`cargo bench` always passes `--bench`): run only workloads
    // whose name contains it, so one workload can be measured in isolation
    // (e.g. under `perf stat`).
    let filter = std::env::args()
        .skip(1)
        .find(|a| !a.starts_with("--"))
        .unwrap_or_default();
    let selected = |name: &str| name.contains(&filter);

    let name = "tictactoe/10steps";
    if selected(name) {
        let ttt = workloads::parse_tictactoe();
        measure(name, || workloads::simulate(&ttt, 10));
    }
    let name = "JMT/3steps";
    if selected(name) {
        let jmt = workloads::parse_jmt();
        measure(name, || workloads::simulate(&jmt, 3));
    }
    for (name, expr) in workloads::WORKLOADS {
        if selected(name) {
            let parsed = workloads::parse_expr(expr);
            measure(name, || {
                std::hint::black_box(workloads::eval_input(&parsed));
            });
        }
    }
}
