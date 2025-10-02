use super::{Loc, Op, RegTable};

pub fn show_mem(memory: &Vec<RegTable>) {
    println!("== Memory:");
    for (level, regs) in memory.iter().enumerate() {
        println!("{}:", level);
        for (name, reg) in regs {
            println!("  ({}) {}", reg.idx, name);
        }
    }
}

pub fn show_code(base: Loc, code: &[Op]) {
    println!("== Code:");
    for (i, op) in code.iter().enumerate() {
        let pos = base + i;
        match op {
            Op::Noop => println!("{:>4}: .noop", pos),
            Op::Return => println!("{:>4}: .return", pos),
            Op::Duplicate => println!("{:>4}: .dup", pos),
            Op::Push(value) => println!("{:>4}: .push {:?}", pos, value),
            Op::Store(reg) => println!("{:>4}: .store {}/{}", pos, reg.level, reg.idx),
            Op::Load(reg) => println!("{:>4}: .load {}/{}", pos, reg.level, reg.idx),
            Op::Call { builtin, arity } => println!("{:>4}: .call {:?} {}", pos, builtin, arity),
            Op::Decl { name, skip } => println!("{:>4}: .decl {} {}", pos, name, skip),
            Op::IfFalse(loc) => println!("{:>4}: .ifFalse {}", pos, loc),
            Op::Jump(loc) => {
                let name = match &code[loc - 1] {
                    Op::Decl { name, .. } => name.clone(),
                    _ => "<UNKNOWN>".into(),
                };
                println!("{:>4}: .jump {} # {}", pos, loc, name)
            }
        }
    }
}
