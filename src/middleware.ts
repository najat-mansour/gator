import { CommandHandler, UserCommandHandler } from "./commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (...args: string[]) => {
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    await handler(user, ...args);
  };
}