// TODO: document
//   - The module
//   - The structs
//   - The traits
//   - The functions

pub trait Reporter {
    fn report(&self, samples: usize);
}

pub struct NoReport;

impl Reporter for NoReport {
    fn report(&self, _samples: usize) {}
}

pub struct JsonStdErr {
    total_samples: usize,
}

impl JsonStdErr {
    pub fn new(total_samples: usize) -> Self {
        Self { total_samples }
    }
}

impl Reporter for JsonStdErr {
    fn report(&self, samples: usize) {
        let percentage = (samples as f64 / self.total_samples as f64 * 100.0).round() as u32;
        let progress = serde_json::json!({
            "type": "progress",
            "current": samples,
            "total": self.total_samples,
            "percentage": percentage
        });
        // FIXME: this ends up being used in the main evaluation loop. Consider
        // implementing IO locking to avoid the lock/unlock cost of each eprint!
        // call. See https://doc.rust-lang.org/std/macro.println.html.
        eprintln!("{progress}");
    }
}
