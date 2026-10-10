// The REPL should resolve this import relative to this file,
// even when it is started from another directory.
module replRelativeImport {
  import m.* from "./_1045polymorphicTypeDecl"

  val pair: MonoPair[int] = (1, 2)
}
