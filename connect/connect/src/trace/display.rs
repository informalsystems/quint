// XXX: It feels non-idiomatic to call a formatting function instead of relying
// on `std::fmt::Display` implementation. We should consider wrapping ITF values
// into a struct or maybe implement display on that crate instead.
//
// TODO: States can become large fast. We should implement a concise rendering
// format or, perhaps, a diff rendering format.

use itf::value::{Record, Value};
use std::fmt;

/// Formats an ITF value for human-readable display.
///
/// Handles Quint types including primitives, collections, records, and
/// algebraic data types with special formatting for tagged variants.
pub fn display_value(f: &mut fmt::Formatter<'_>, value: &Value) -> fmt::Result {
    match value {
        Value::Bool(v) => write!(f, "{}", v)?,
        Value::Number(v) => write!(f, "{}", v)?,
        Value::BigInt(v) => write!(f, "{}", v)?,
        Value::String(v) => write!(f, "\"{}\"", v)?,
        Value::Tuple(values) => write_list(f, "(", values.iter(), ")")?,
        Value::List(values) => write_list(f, "[", values.iter(), "]")?,
        Value::Set(values) => write_list(f, "Set(", values.iter(), ")")?,
        Value::Map(values) => write_map(f, "Map(", values.iter(), ")")?,
        Value::Record(values) => write_record(f, values)?,
        Value::Unserializable(_) => write!(f, "<unserializable>")?, // panic here?
    }
    Ok(())
}

fn write_list<'a, Iter>(
    f: &mut fmt::Formatter<'_>,
    l_delim: &str,
    values: Iter,
    r_delim: &str,
) -> Result<(), fmt::Error>
where
    Iter: IntoIterator<Item = &'a Value>,
{
    write!(f, "{}", l_delim)?;
    for (i, value) in values.into_iter().enumerate() {
        if i > 0 {
            write!(f, ", ")?;
        }
        display_value(f, value)?;
    }
    write!(f, "{}", r_delim)
}

fn write_map<'a, Iter>(
    f: &mut fmt::Formatter<'_>,
    l_delim: &str,
    values: Iter,
    r_delim: &str,
) -> Result<(), fmt::Error>
where
    Iter: IntoIterator<Item = (&'a Value, &'a Value)>,
{
    write!(f, "{}", l_delim)?;
    for (i, (key, value)) in values.into_iter().enumerate() {
        if i > 0 {
            write!(f, ", ")?;
        }
        display_value(f, key)?;
        write!(f, " -> ")?;
        display_value(f, value)?;
    }
    write!(f, "{}", r_delim)
}

fn write_record(f: &mut fmt::Formatter<'_>, rec: &Record) -> Result<(), fmt::Error> {
    // XXX: This seems error prone. I'm not sure there are stronger assumptions
    // about how ITF encodes type variants other than `tag` and `value` records.
    if let Some(Value::String(tag)) = rec.get("tag")
        && let Some(value) = rec.get("value")
    {
        write!(f, "{}", tag)?;
        if !is_empty_variant(value) {
            write!(f, "(")?;
            display_value(f, value)?;
            write!(f, ")")?;
        }
    } else {
        write!(f, "{{ ")?;
        for (i, (k, v)) in rec.iter().enumerate() {
            if i > 0 {
                write!(f, ", ")?;
            }
            write!(f, "{}: ", k)?;
            display_value(f, v)?;
        }
        write!(f, " }}")?;
    }
    Ok(())
}

fn is_empty_variant(value: &Value) -> bool {
    match value {
        Value::Tuple(values) => values.is_empty(),
        _ => false,
    }
}
