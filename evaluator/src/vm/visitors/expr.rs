use super::Visitor;
use crate::ir::{OpDef, QuintEx, QuintId, QuintLambdaParameter, QuintName};
use crate::vm::{
    builtins::{emit_inlined_if, Builtin},
    compiler::Context,
    Op, Value,
};

impl Visitor for QuintEx {
    fn visit(self, ctx: &mut Context) {
        match self {
            QuintEx::QuintInt { value, .. } => emit_value(ctx, Value::Int(value)),
            QuintEx::QuintStr { value, .. } => emit_value(ctx, Value::Str(value)),
            QuintEx::QuintBool { value, .. } => emit_value(ctx, Value::Bool(value)),
            QuintEx::QuintName { name, .. } => emit_name(ctx, name),
            QuintEx::QuintApp { opcode, args, .. } => emit_app(ctx, opcode, args),
            QuintEx::QuintLet { opdef, expr, .. } => emit_let(ctx, *opdef, *expr),
            QuintEx::QuintLambda { id, params, expr } => emit_lambda(ctx, id, params, *expr),
        }
    }
}

fn emit_value(ctx: &mut Context, value: Value) {
    ctx.emit(Op::Push(value));
}

fn emit_app(ctx: &mut Context, opcode: QuintName, mut args: Vec<QuintEx>) {
    if opcode == "ite" {
        emit_inlined_if(ctx, args);
        return;
    }

    if ["actionAll", "actionOr", "and", "or"].contains(&opcode.as_str()) {
        todo!();
    }

    let arity: u8 = args.len().try_into().expect("too many arguments");
    for arg in args {
        ctx.visit(arg);
    }

    if let Ok(builtin) = Builtin::try_from(opcode.as_str()) {
        ctx.emit(Op::Call { builtin, arity });
    } else {
        ctx.emit(ctx.resolve(&opcode));
    }
}

fn emit_name(ctx: &mut Context, name: QuintName) {
    ctx.emit(ctx.resolve(&name));
}

fn emit_lambda(ctx: &mut Context, id: QuintId, params: Vec<QuintLambdaParameter>, expr: QuintEx) {
    let loc = {
        let mut scope = ctx.begin(format!("000_lambda_{}", id).into());
        for param in params.into_iter().rev() {
            let reg = scope.register(param.name);
            scope.emit(Op::Store(reg));
        }
        scope.visit(expr);
        scope.start_loc()
    };
    ctx.emit(Op::Push(Value::Lambda(loc)));
}

fn emit_let(ctx: &mut Context, opdef: OpDef, expr: QuintEx) {
    ctx.visit(opdef);
    ctx.visit(expr);
}
