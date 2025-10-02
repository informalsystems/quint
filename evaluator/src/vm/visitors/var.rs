use super::Visitor;
use crate::ir::QuintVar;
use crate::vm::compiler::Context;

impl Visitor for QuintVar {
    fn visit(self, ctx: &mut Context) {
        ctx.register(self.name);
    }
}
