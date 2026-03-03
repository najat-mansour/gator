import { readConfig, setUser } from "./config";
import { createUser, deleteAllUsers, getAllUsers, getUserByName } from "./lib/db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }   
    await handler(cmdName, ...args);
}

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`No username is provided ...!`);
    }
    const username = args[0];
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`User ${username} does not exist ...!`);
    }
    setUser(username);
    console.log(`User ${username} has been set successfully ...!`);
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`No username is provided ...!`);
    }
    const username = args[0];
    const user = await createUser(username);
    setUser(username);
    console.log(`User ${username} has been created successfully ...!`);
    console.log(user);
}

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    await deleteAllUsers();
    console.log(`All users have been deleted successfully ...!`);
}

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    const config = readConfig();
    const currentUserName = config.currentUserName;
    const users = await getAllUsers();
    for(const user of users) {
        console.log(`* ${user.name} ${user.name === currentUserName ? "(current)" : ""}`);
    }
}