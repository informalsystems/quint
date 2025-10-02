mod decl;
mod expr;
mod module;
mod opdef;
mod var;

use crate::vm::compiler::Context;

pub trait Visitor {
    fn visit(self, ctx: &mut Context);
}
