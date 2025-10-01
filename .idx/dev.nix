{pkgs}: {
  channel = "stable-24.05";
  packages = [   pkgs.nodejs_20, pkgs.concurrently, pkgs.mongodb];
  
  idx.extensions = [
    "svelte.svelte-vscode",
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "sh",
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
}