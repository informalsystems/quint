mod attrs;
mod switch_in;

use crate::{
    attrs::RunAttributes,
    switch_in::{ActionParam, SwitchCase, SwitchInput},
};
use proc_macro::TokenStream;
use quote::quote;
use syn::ItemFn;

// NOTE: When quote! expands a value of type None, it omits its tokens. This
// macro makes it so None or Some(value) are quoted verbatim instead. It can
// optionally receive a transformation method to apply to value if
// Some(value) exists.
macro_rules! quote_opt {
    ($opt:tt $(, $transform:ident)?) => {
        match $opt {
            Some(val) => quote! { Some(#val$(.$transform())?) },
            None => quote! { None },
        }
    };
}

/// An attribute macro for creating model-based tests using Quint
/// specifications.
///
/// The `#[run]` attribute transforms a function returning a [`Driver`] into a
/// complete test that generates traces from a Quint specification and executes
/// them against your implementation. This enables model-based testing where
/// Quint explores the state space of your specification and validates that your
/// implementation behaves correctly.
///
/// # Syntax
///
/// ```ignore
/// #[quint_run(spec = "path/to/spec.qnt", ...options)]
/// fn test_name() -> impl Driver {
///     MyDriver::new()
/// }
/// ```
///
/// The annotated function must:
/// - Have no parameters
/// - Return a type that implements [`Driver`]
/// - Have a body that constructs and returns the driver instance
///
/// # Required Parameters
///
/// - `spec`: Path to the Quint specification file (`.qnt`). The path is
///   relative to the crate root (where `Cargo.toml` is located).
///
/// # Optional Parameters
///
/// - `main`: Name of the main action in your Quint specification. Use this if
///   your spec has multiple modules.
///
/// - `max_samples`: Maximum number of random samples to generate per test.
///   Controls how many different execution paths Quint explores.
///
/// - `max_steps`: Maximum number of steps in each generated trace. Limits how
///   long each execution path can be.
///
/// # Examples
///
/// ## Basic Usage
///
/// ```ignore
/// #[quint_run(
///     spec = "specs/counter.qnt",
///     main = "simulation"
/// )]
/// fn test_counter() -> impl Driver {
///     CounterDriver { counter: 0 }
/// }
/// ```
///
/// # Running Tests
///
/// Tests created with `#[run]` are standard Rust tests and can be executed
/// with:
///
/// ```bash
/// cargo test
/// ```
///
/// Or to run a specific test:
///
/// ```bash
/// cargo test test_counter
/// ```
///
/// # Requirements
///
/// - Quint must be installed and available in your PATH
/// - The specified `.qnt` file must exist and be valid
/// - The driver must implement both `step()` and optionally `check()`
///
/// # Test Failures
///
/// A test will fail if:
/// - Quint cannot generate traces from the specification
/// - The driver returns `Status::Unimplemented` for an action
/// - The driver returns `Status::UnknownParam` for a required parameter
/// - An assertion in `driver.step()` or `driver.check()` fails
/// - The driver panics during execution
#[allow(rustdoc::broken_intra_doc_links)]
#[proc_macro_attribute]
pub fn run(attr: TokenStream, item: TokenStream) -> TokenStream {
    let RunAttributes {
        spec_path,
        main_action,
        max_samples,
        max_steps,
    } = syn::parse_macro_input!(attr as RunAttributes);

    let main_action = quote_opt!(main_action, to_string);
    let max_samples = quote_opt!(max_samples);
    let max_steps = quote_opt!(max_steps);

    let test_fn = syn::parse_macro_input!(item as ItemFn);
    let fn_ident = &test_fn.sig.ident;
    let fn_name = fn_ident.to_string();
    let fn_block = &test_fn.block;

    let output = quote! {
        #[test]
        fn #fn_ident() {
            let driver = #fn_block;
            let opts = quint_connect::runner::Config {
                spec_path: #spec_path.to_string(),
                test_name: #fn_name.to_string(),
                main_action: #main_action,
                max_samples: #max_samples,
                max_steps: #max_steps,
            };
            quint_connect::runner::generate_traces_and_run(driver, opts);
        }
    };

    output.into()
}

/// A declarative macro for dispatching actions from Quint traces to handler
/// code.
///
/// The `switch!` macro provides a convenient DSL for matching actions from a
/// Quint trace and executing corresponding handler code. It automatically
/// extracts action names and parameters from the trace, making it easy to
/// connect your Quint specification to your Rust implementation.
///
/// # Syntax
///
/// ```ignore
/// switch! {
///     (driver_expr, step_expr) {
///         ActionName => handler_expr,
///         ActionWithParams(param1, param2: Type) => handler_expr,
///         AnotherAction(optional: Option<Type>) => handler_expr,
///     }
/// }
/// ```
///
/// # Parameters
/// - `driver_expr`: An expression that evaluates to a value implementing
///   [`Driver`] (typically `self` within a `Driver::step` implementation)
/// - `step_expr`: An expression that evaluates to a `&Step` reference
///
/// # Action Cases
///
/// Each action case has the form:
///
/// ```ignore
/// ActionName(param1, param2: Type, ...) => handler_code
/// ```
///
/// Where:
///
/// - `ActionName`: The name of the action from your Quint specification
///   (case-sensitive)
/// - `(param1, ...)`: Optional parameter list extracted from nondeterministic
///   picks
/// - `handler_code`: The Rust code to execute when this action is matched
///
/// # Parameter Extraction
///
/// Parameters are automatically extracted from the trace's nondeterministic
/// picks using [`Driver::nondet_picks`]. Each parameter can optionally specify
/// a type:
///
/// ## Required Parameters (without `Option<T>`)
///
/// Parameters without an explicit type annotation, or with a non-`Option` type,
/// are required:
///
/// ```ignore
/// ActionName(x, y: i64) => { /* x and y must exist */ }
/// ```
///
/// If a required parameter is missing from the trace, the macro returns
/// `Status::UnknownParam`.
///
/// ## Optional Parameters (with `Option<T>`)
///
/// Parameters with an `Option<T>` type are optional and won't cause an error if
/// missing:
///
/// ```ignore
/// ActionName(maybe_val: Option<i64>) => {
///     if let Some(val) = maybe_val {
///         // handle the case when val is present
///     }
/// }
/// ```
///
/// # Return Value
///
/// The macro expands to an expression that returns a [`Status`]:
///
/// - `Status::Ok`: When a case matches and its handler executes successfully
/// - `Status::Unimplemented(action)`: When the action is in the trace but no
///   case matches
/// - `Status::Done`: When no action is present in the step (end of trace)
/// - `Status::UnknownParam { action, param }`: When a required parameter is
///   missing
///
/// # Examples
///
/// ## Basic Usage
///
/// ```ignore
/// use quint_connect::{Driver, Status, Step, switch};
///
/// impl Driver for MyDriver {
///     fn step(&mut self, step: &Step) -> Status {
///         switch! {
///             (self, step) {
///                 init => self.counter = 0,
///                 SetValue(x) => self.counter = x, // x is required, type inferred
///                 Increment(amount: Option<i64>) => self.counter += amount.unwrap_of(1),
///             }
///         }
///     }
/// }
/// ```
///
/// # Type Requirements
///
/// Parameter types must implement [`serde::de::DeserializeOwned`] to be
/// extracted from the trace. Common types that work:
///
/// - Primitives: `i64`, `u64`, `f64`, `bool`, `String`
/// - Tuples: `(i64, i64)`, `(String, u64)`
/// - Custom types with `#[derive(Deserialize)]`
#[proc_macro]
#[allow(rustdoc::broken_intra_doc_links)]
pub fn switch(input: TokenStream) -> TokenStream {
    let SwitchInput {
        driver,
        step,
        cases,
    } = syn::parse_macro_input!(input as SwitchInput);

    // TODO: This is large! Figure out a way to break code generation into
    // separate blocks. Currently this is challenging because quote! returns
    // proc_macro2::TokenStream which is not available out of the box for
    // proc-macro crates. Maybe we add that dependency explicitly if it'll make
    // it easier to refactor the code.
    let cases = cases.into_iter().map(|case| {
        let SwitchCase {
            action: action_ident,
            params,
            handler,
        } = case;

        let action_name = action_ident.to_string();
        let params = params.into_iter().map(|param| {
            let ActionParam {
                name: param_ident,
                ty: param_type,
            } = &param;

            let param_name = param_ident.to_string();
            let mut param_type_ann = None;

            // TODO: Avoid generating this check if the switch param is not
            // required. We should extract this to a function/macro. See the
            // comment above.
            let mut param_check = Some(quote! {
                if #param_ident.is_none() {
                    return Status::UnknownParam {
                        action: #action_name.to_string(),
                        param: #param_name.to_string(),
                    };
                }
                let #param_ident = #param_ident.unwrap();
            });

            if let Some(param_type) = param_type {
                if param.is_required() {
                    param_type_ann = Some(quote! { : Option<#param_type> });
                } else {
                    param_type_ann = Some(quote! { : #param_type });
                    param_check = None;
                }
            }

            quote! {
                let #param_ident #param_type_ann = #driver
                    .nondet_picks(&#step)
                    .get(#param_name);
                #param_check
            }
        });

        quote! {
            Some(#action_name) => {
                #(#params)*
                #handler;
                Status::Ok
            }
        }
    });

    let output = quote! {
        use quint_connect::Status;
        match #driver.action_taken(&#step).as_deref() {
            #(#cases,)*
            Some(action) => Status::Unimplemented(action.to_string()),
            None => Status::Done,
        }
    };

    output.into()
}
