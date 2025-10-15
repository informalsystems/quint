use crate::trace::Trace;
use std::{
    fs::{File, ReadDir},
    io::BufReader,
    path::Path,
};
use tempdir::TempDir;

/// Iterator over generated trace files from a temporary directory.
pub struct Iter {
    dir_iter: ReadDir,
    // Must hold the `TempDir` struct so it doesn't delete the temporary folder
    // while we're iterating on it.
    _temp_dir: TempDir,
}

impl Iter {
    pub(super) fn new(temp_dir: TempDir) -> Self {
        Self {
            dir_iter: std::fs::read_dir(temp_dir.path()).expect("can't list trace files"),
            _temp_dir: temp_dir,
        }
    }
}

impl Iterator for Iter {
    type Item = Trace;

    fn next(&mut self) -> Option<Self::Item> {
        if let Some(entry) = self.dir_iter.next() {
            let entry = entry.expect("can't list next trace file");
            return Some(trace_from_file(&entry.path()));
        }
        None
    }
}

fn trace_from_file(path: &Path) -> Trace {
    let file = File::open(path).expect("can't open trace file");
    let reader = BufReader::new(file);
    serde_json::from_reader(reader).expect("failed to parse trace file")
}
