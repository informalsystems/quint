use super::{Repr, Value};
use std::ops::{Add, Div, Mul, Neg, Rem, Sub};

impl Value {
    pub const ZERO: Value = Value(Repr::Int(0));

    pub(super) fn as_int(&self) -> i64 {
        match self.0 {
            Repr::Int(n) => n,
            _ => panic!("not an int"),
        }
    }
}

impl Add for &Value {
    type Output = Value;
    fn add(self, rhs: Self) -> Self::Output {
        Value::int(self.as_int() + rhs.as_int())
    }
}

impl Sub for &Value {
    type Output = Value;
    fn sub(self, rhs: Self) -> Self::Output {
        Value::int(self.as_int() - rhs.as_int())
    }
}

impl Mul for &Value {
    type Output = Value;
    fn mul(self, rhs: Self) -> Self::Output {
        Value::int(self.as_int() * rhs.as_int())
    }
}

impl Div for &Value {
    type Output = Value;
    fn div(self, rhs: Self) -> Self::Output {
        Value::int(self.as_int() / rhs.as_int())
    }
}

impl Rem for &Value {
    type Output = Value;
    fn rem(self, rhs: Self) -> Self::Output {
        Value::int(self.as_int() % rhs.as_int())
    }
}

impl Neg for &Value {
    type Output = Value;
    fn neg(self) -> Self::Output {
        Value::int(-self.as_int())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_math_operators() {
        let a: Value = 4.into();
        let b: Value = 2.into();
        assert_eq!(&a + &b, 6.into());
        assert_eq!(&a - &b, 2.into());
        assert_eq!(&a * &b, 8.into());
        assert_eq!(&a / &b, 2.into());
        assert_eq!(&a % &b, Value::ZERO);
        assert_eq!(-&a, (-4).into());
    }
}
