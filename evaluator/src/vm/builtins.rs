use super::{compiler::Context, Op};
use crate::ir::QuintEx;

macro_rules! builtins {
    ($($name:ident => $ident:ident,)+) => {
        #[derive(Debug)]
        pub enum Builtin {
            $($ident,)+
        }

        impl TryFrom<&str> for Builtin {
            type Error = ();

            fn try_from(name: &str) -> Result<Self, Self::Error> {
                match name {
                    $(stringify!($name) => Ok(Self::$ident),)+
                    _ => Err(()),
                }
            }
        }
    };
}

builtins! {
    Tup          => Tup,
    Set          => Set,
    to           => To,
    tuples       => Tuples,
    variant      => Variant,
    matchVariant => MatchVariant,
    get          => Get,
    item         => Item,
    assign       => Assign,
    actionAll    => ActionAll,
    actionAny    => ActionAny,
    and          => And,
    or           => Or,
    not          => Not,
    eq           => Eq,
    forall       => Forall,
    exists       => Exists,
    filter       => Filter,
    size         => Size,
    mapBy        => MapBy,
    set          => MapSet,
    setBy        => MapSetBy,
    oneOf        => OneOf,
}

pub fn emit_inlined_if(ctx: &mut Context, mut args: Vec<QuintEx>) {
    assert!(args.len() == 3, "missing argument to if-then-else");
    let elze = args.pop().unwrap();
    let then = args.pop().unwrap();
    let cond = args.pop().unwrap();
    ctx.visit(cond);

    let if_loc = ctx.reserve();
    ctx.visit(then);

    let else_loc = ctx.emit(Op::Return) + 1;
    ctx.visit(elze);
    ctx.emit(Op::Return);

    ctx.replace(if_loc, Op::IfFalse(else_loc));
}
