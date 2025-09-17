{ pkgs, ... }: {
  # Let Nix handle a few common directories
  per-folder = {
    "." = {
      # The entrypoint for the dev environment.
      # This is the command that will be run when you start the project.
      entrypoint = "bash";
      
      # Tell VScode to use the dev-provided extensions
      vscode.extensions.useRecommended = true;

      # The list of processes to run
      # The key is the process name
      # The value is the process configuration
      processes = {
        dev = {
          command = [
            "bash",
            "-c",
            "concurrently \"cd FrontTurnos && pnpm install && pnpm start\" \"cd BackendTurnos && pnpm install && pnpm start\""
          ];
          env = {
            PORT = "$PORT";
            MONGOMS_SYSTEM_BINARY = "${pkgs.mongodb}/bin/mongod";
          };
          manager = "web";
        };
      };
    };
  };
}