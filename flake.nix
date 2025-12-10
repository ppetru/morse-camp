{
  description = "Morse Camp development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            yarn
            firebase-tools
          ];

          shellHook = ''
            echo "Morse Camp dev environment"
            echo "Node: $(node --version)"
            echo "Yarn: $(yarn --version)"
            echo "Firebase: $(firebase --version)"
          '';
        };
      }
    );
}
