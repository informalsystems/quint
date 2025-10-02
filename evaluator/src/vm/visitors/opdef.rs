use super::Visitor;
use crate::ir::{OpDef, OpQualifier, QuintEx};
use crate::vm::compiler::Context;
use crate::vm::{Loc, Op, Value};

impl Visitor for OpDef {
    fn visit(self, ctx: &mut Context) {
        match self.qualifier {
            OpQualifier::Val => emit_def(ctx, self),
            OpQualifier::Def => emit_def(ctx, self),
            OpQualifier::Action => emit_def(ctx, self),
            OpQualifier::PureVal => emit_pure_val(ctx, self),
            OpQualifier::Nondet => emit_def(ctx, self),
            OpQualifier::Temporal => (), // ignore
            OpQualifier::PureDef => todo!(),
            OpQualifier::Run => todo!(),
        }
    }
}

fn emit_def(ctx: &mut Context, opdef: OpDef) {
    let mut scope = ctx.begin(opdef.name);
    match opdef.expr {
        // Inline lambda definition in the def itself
        QuintEx::QuintLambda { params, expr, .. } => {
            for param in params.into_iter().rev() {
                let reg = scope.register(param.name);
                scope.emit(Op::Store(reg));
            }
            scope.visit(*expr);
        }
        other => scope.visit(other),
    }
}

fn emit_pure_val(ctx: &mut Context, opdef: OpDef) {
    let reg = ctx.register(opdef.name.clone());
    let mut scope = ctx.begin(opdef.name);
    scope.emit(Op::Load(reg));

    let if_loc = scope.reserve();
    let then_loc = scope.emit(Op::Return);

    scope.visit(opdef.expr);
    scope.emit(Op::Duplicate);
    scope.emit(Op::Store(reg));

    scope.replace(if_loc, Op::IfFalse(then_loc + 1));
}
