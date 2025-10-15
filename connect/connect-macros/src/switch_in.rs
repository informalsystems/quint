use syn::{
    Expr, Ident, Token, Type, braced, parenthesized,
    parse::{Parse, ParseStream},
    token::Paren,
};

#[derive(Debug)]
pub struct SwitchInput {
    pub driver: Expr,
    pub step: Expr,
    pub cases: Vec<SwitchCase>,
}

impl Parse for SwitchInput {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        // Example:
        //
        // switch! {
        //     (self, step) {
        //         init => self.init(),
        //         inc(n) => inc.inc(n)
        //     }
        // }
        let inputs; // (self, step) ...
        parenthesized!(inputs in input);

        let driver: Expr = inputs.parse()?;
        inputs.parse::<Token![,]>()?;
        let step: Expr = inputs.parse()?;

        let actions; // { case, ... }
        braced!(actions in input);
        let cases = actions
            .parse_terminated(SwitchCase::parse, Token![,])?
            .into_iter()
            .collect();

        Ok(Self {
            driver,
            step,
            cases,
        })
    }
}

#[derive(Debug)]
pub struct SwitchCase {
    pub action: Ident,
    pub params: Vec<ActionParam>,
    pub handler: Expr,
}

impl Parse for SwitchCase {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        // Example:
        //
        // inc(n) => self.inc(n)
        let action: Ident = input.parse()?; // inc ...

        let params = if input.peek(Paren) {
            let content; // (n) ...
            parenthesized!(content in input);
            content
                .parse_terminated(ActionParam::parse, Token![,])?
                .into_iter()
                .collect()
        } else {
            Vec::new() // no parenthesis, no params
        };

        input.parse::<Token![=>]>()?;
        let handler: Expr = input.parse()?; // self.inc(n) ...

        Ok(Self {
            action,
            params,
            handler,
        })
    }
}

#[derive(Debug)]
pub struct ActionParam {
    pub name: Ident,
    pub ty: Option<Type>,
}

impl Parse for ActionParam {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        // Example:
        //
        // n: Option<usize>
        let name: Ident = input.parse()?; // n ...
        let ty = if input.peek(Token![:]) {
            input.parse::<Token![:]>()?;
            Some(input.parse()?) // Option<usize>
        } else {
            None // no colon, no type annotation
        };
        Ok(Self { name, ty })
    }
}

impl ActionParam {
    /// Returns false iff the parameter was annotated with type information
    /// that starts with Option. Returns true otherwise.
    pub fn is_required(&self) -> bool {
        // XXX: This is hacky and I'm not sure it covers all cases. There's
        // probably a better way to match on the type information available.
        if let Some(ty) = &self.ty
            && let Type::Path(ty_path) = ty
        {
            return ty_path
                .path
                .segments
                .last()
                .is_some_and(|seg| seg.ident != "Option");
        }
        true
    }
}
