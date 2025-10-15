use syn::{
    Ident, LitInt, LitStr, Token,
    parse::{Parse, ParseBuffer, ParseStream},
};

/// The attributes available to configure the `run` macro.
#[derive(Default)]
pub struct RunAttributes {
    pub spec_path: String,
    pub main_action: Option<String>,
    pub max_samples: Option<usize>,
    pub max_steps: Option<usize>,
}

impl Parse for RunAttributes {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let mut attrs = RunAttributes::default();

        while !input.is_empty() {
            let key: Ident = input.parse()?;
            let _: Token![=] = input.parse()?;
            let name = key.to_string();

            match name.as_str() {
                "spec" => attrs.spec_path = parse_str(input)?,
                "main" => attrs.main_action = Some(parse_str(input)?),
                "max_samples" => attrs.max_samples = Some(parse_num(input)?),
                "max_steps" => attrs.max_steps = Some(parse_num(input)?),
                _ => {
                    return Err(syn::Error::new(
                        key.span(),
                        format!("invalid attribute: {}", name),
                    ));
                }
            }

            if input.peek(Token![,]) {
                let _: Token![,] = input.parse()?;
            }
        }

        Ok(attrs)
    }
}

fn parse_str(input: &ParseBuffer<'_>) -> Result<String, syn::Error> {
    Ok(input.parse::<LitStr>()?.value())
}

fn parse_num(input: &ParseBuffer<'_>) -> Result<usize, syn::Error> {
    input.parse::<LitInt>()?.base10_parse::<usize>()
}
