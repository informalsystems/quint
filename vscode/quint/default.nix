with (import <nixpkgs> {});
let
  shell = mkShell {
    name = "typescript-env";
    buildInputs = [
      pkgs.nodejs-16_x
    ];
  };
in
shell
