import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`No username is provided ...!`);
    }
    const username = args[0];
    setUser(username);
    console.log(`User ${username} has been set successfully ...!`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }   
    handler(cmdName, ...args);
}