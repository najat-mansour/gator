import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commands";
import { argv, exit } from "process";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  if (argv.length === 2) { 
    console.error(`No command is provided ...!`);
    exit(1);
  }

  const cmdName = argv[2];
  const args = argv.slice(3);
  runCommand(registry, cmdName, ...args);
}

main();