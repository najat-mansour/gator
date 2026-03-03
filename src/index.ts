import { 
  CommandsRegistry, 
  handlerAddFeed, 
  handlerAgg, 
  handlerBrowse, 
  handlerFeeds, 
  handlerFollow, 
  handlerFollowing, 
  handlerLogin, 
  handlerRegister, 
  handlerReset, 
  handlerUnfollow, 
  handlerUsers, 
  registerCommand, 
  runCommand 
} from "./commands";
import { argv } from "process";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", middlewareLoggedIn(handlerReset));
  registerCommand(registry, "users", middlewareLoggedIn(handlerUsers));
  registerCommand(registry, "agg", middlewareLoggedIn(handlerAgg));
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", middlewareLoggedIn(handlerFeeds));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));
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