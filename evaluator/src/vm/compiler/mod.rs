mod debug;

use super::{visitors::Visitor, Loc, Op, Reg};
use crate::{ir::*, simulator::ParsedQuint, vm::Code};
use std::collections::HashMap;

type RegTable = HashMap<QuintName, Reg, fxhash::FxBuildHasher>;
type LocTable = HashMap<QuintName, Loc, fxhash::FxBuildHasher>;

pub struct Context {
    code: Code,
    memory: Vec<RegTable>,
    definitions: Vec<LocTable>,
}

impl Context {
    fn new() -> Self {
        Self {
            code: vec![],
            memory: vec![RegTable::default()],
            definitions: vec![LocTable::default()],
        }
    }

    pub fn begin(&mut self, name: QuintName) -> Scope<'_> {
        self.emit(Op::Decl {
            name: name.clone(),
            skip: Loc::MAX, // placeholder
        });

        let start = self.code.len();
        let _ = self
            .definitions
            .last_mut()
            .expect("broken definition stack")
            .insert(name.clone(), start)
            .is_none_or(|_| panic!("duplicated definition: {}", name));

        self.definitions.push(LocTable::default());
        self.memory.push(RegTable::default());
        Scope { ctx: self, start }
    }

    pub fn register(&mut self, name: QuintName) -> Reg {
        let level = self.memory.len() - 1;
        let regs = self.memory.last_mut().expect("broken memory stack");
        let reg = Reg::new(regs.len(), level);
        let _ = regs
            .insert(name.clone(), reg)
            .is_none_or(|_| panic!("duplicated register: {}", name));
        reg
    }

    pub fn resolve(&self, name: &QuintName) -> Op {
        for regs in self.memory.iter().rev() {
            if let Some(reg) = regs.get(name) {
                return Op::Load(*reg);
            }
        }
        for defs in self.definitions.iter().rev() {
            if let Some(loc) = defs.get(name) {
                return Op::Jump(*loc);
            }
        }
        panic!("unresolved name: {}", name);
    }

    pub fn reserve(&mut self) -> Loc {
        self.emit(Op::Noop)
    }

    pub fn emit(&mut self, op: Op) -> Loc {
        let loc = self.code.len();
        self.code.push(op);
        loc
    }

    pub fn replace(&mut self, loc: Loc, op: Op) {
        self.code[loc] = op;
    }

    pub fn visit<A: Visitor>(&mut self, value: A) {
        value.visit(self)
    }
}

pub struct Scope<'a> {
    ctx: &'a mut Context,
    start: Loc,
}

impl<'a> Scope<'a> {
    pub fn start_loc(&self) -> Loc {
        self.start
    }

    pub fn begin(&'a mut self, name: QuintName) -> Scope<'a> {
        self.ctx.begin(name)
    }

    pub fn register(&mut self, name: QuintName) -> Reg {
        self.ctx.register(name)
    }

    pub fn reserve(&mut self) -> Loc {
        self.ctx.reserve()
    }

    pub fn emit(&mut self, op: Op) -> Loc {
        self.ctx.emit(op)
    }

    pub fn replace(&mut self, loc: Loc, op: Op) {
        self.ctx.replace(loc, op)
    }

    pub fn visit<A: Visitor>(&mut self, value: A) {
        self.ctx.visit(value)
    }
}

impl<'a> Drop for Scope<'a> {
    fn drop(&mut self) {
        self.emit(Op::Return);
        let skip_to = self.ctx.code.len();

        let header = self.start - 1;
        match self.ctx.code.get_mut(header) {
            Some(Op::Decl { skip, .. }) => *skip = skip_to,
            _ => panic!("invalid scope header"),
        }

        self.ctx.definitions.pop();
        self.ctx.memory.pop();
    }
}

pub fn compile(parsed: ParsedQuint) {
    let ParsedQuint {
        init: _,
        step: _,
        invariant: _,
        modules,
        table: _,
    } = parsed;

    let mut ctx = Context::new();
    for module in modules {
        module.visit(&mut ctx);
    }

    debug::show_mem(&ctx.memory);
    debug::show_code(0, &ctx.code[..]);
    panic!("=== DONE!")
}
