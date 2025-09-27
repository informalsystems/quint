mod int;
mod set;

#[derive(Eq, PartialEq, Hash, Clone, Debug)]
pub struct Value(Repr);

#[derive(Eq, PartialEq, Hash, Clone, Debug)]
enum Repr {
    Int(i64),
    Set(set::Set),
    Tuple(Vec<Value>),
}

impl Value {
    fn int(n: i64) -> Self {
        Value(Repr::Int(n))
    }

    fn tuple(elems: Vec<Value>) -> Self {
        Self(Repr::Tuple(elems))
    }

    pub fn cross_product(sets: Vec<Value>) -> Self {
        set::cross_product(sets)
    }

    pub fn interval(start: i64, end: i64) -> Self {
        set::interval(start, end)
    }
}

impl From<i64> for Value {
    fn from(n: i64) -> Self {
        Value::int(n)
    }
}
