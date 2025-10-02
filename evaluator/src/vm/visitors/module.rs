use super::Visitor;
use crate::ir::QuintModule;
use crate::vm::compiler::Context;

impl Visitor for QuintModule {
    fn visit(self, ctx: &mut Context) {
        for decl in self.declarations {
            ctx.visit(decl);
        }
    }
}
