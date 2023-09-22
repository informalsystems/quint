with (import <nixpkgs> { });
let
  tree-sitter = (pkgs.tree-sitter.overrideAttrs (old: {
    preBuild = ''
      mkdir -p .emscriptencache
      export EM_CACHE=$(pwd)/.emscriptencache
      bash ./script/build-wasm --debug
    '';
  })).override { webUISupport = true; };
in pkgs.mkShell {
  name = "tree-sitter-quint-env";
  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.python3
    # tree-sitter
    # Dev env
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.prettier
  ];
}
