use super::Visitor;
use crate::ir::QuintDeclaration;
use crate::vm::compiler::Context;

impl Visitor for QuintDeclaration {
    fn visit(self, ctx: &mut Context) {
        match self {
            QuintDeclaration::QuintOpDef(opdef) => ctx.visit(opdef),
            QuintDeclaration::QuintVar(var) => ctx.visit(var),
            QuintDeclaration::QuintAssume(_) => todo!(),
            QuintDeclaration::QuintConst(_) => todo!(),
            QuintDeclaration::QuintImport {} => todo!(),
            QuintDeclaration::QuintInstance {} => todo!(),
            QuintDeclaration::QuintExport {} => todo!(),
            QuintDeclaration::QuintTypeDef(_) => (), // ignore
        }
    }
}
