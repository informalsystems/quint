mod builtins;
mod compiler;
mod visitors;

use crate::{
    ir::{QuintId, QuintName},
    simulator::ParsedQuint,
};
use builtins::Builtin;

type Code = Vec<Op>;
type Loc = usize;

#[derive(Debug, Clone, Copy)]
struct Reg {
    idx: u8,
    level: u8,
}

impl Reg {
    fn new(index: usize, level: usize) -> Self {
        Self {
            idx: index.try_into().expect("to many registers"),
            level: level.try_into().expect("to many levels"),
        }
    }
}

#[derive(Debug)]
enum Op {
    Push(Value),
    Duplicate,
    Load(Reg),
    Store(Reg),
    Jump(Loc),
    Call { builtin: Builtin, arity: u8 },
    Decl { name: QuintName, skip: Loc },
    IfFalse(Loc),
    Return,
    Noop,
}

#[derive(Debug)]
enum Value {
    Int(i64),
    Bool(bool),
    Str(QuintName),
    Lambda(Loc),
}

pub fn run_with_vm(parsed: ParsedQuint) {
    compiler::compile(parsed);
}
