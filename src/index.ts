import { CommandsRegistry, handlerLogin, handlerRegister, handlerReset, handlerUsers, registerCommand, runCommand } from "./commands";
import { argv } from "process";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  if (argv.length === 2) { 
    console.error(`No command is provided ...!`);
    process.exit(1);
  }

  const cmdName = argv[2];
  const args = argv.slice(3);
  await runCommand(registry, cmdName, ...args);
  process.exit(0);
}

main();