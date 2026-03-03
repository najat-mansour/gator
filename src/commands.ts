import { readConfig, setUser } from "./config";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feed_follows";
import { createFeed, getAllFeeds, getFeedByUrl } from "./lib/db/queries/feeds";
import { createUser, deleteAllUsers, getAllUsers, getUserByName } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";

export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
}
export type UserCommandHandler = (user: User, ...args: string[]) => Promise<void>;
export type CommandHandler = (...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }   
    await handler(...args);
}

const config = readConfig();

export async function handlerLogin(userName: string): Promise<void> {
    if (!userName) {
        throw new Error(`No username is provided ...!`);
    }
    const user = await getUserByName(userName);
    if (!user) {
        throw new Error(`User ${userName} does not exist ...!`);
    }
    setUser(userName);
    console.log(`User ${userName} has been set successfully ...!`);
}

export async function handlerRegister(userName: string): Promise<void> {
    if (!userName) {
        throw new Error(`No username is provided ...!`);
    }
    const user = await createUser(userName);
    setUser(userName);
    console.log(`User ${userName} has been created successfully ...!`);
    console.log(user);
}

export async function handlerReset(): Promise<void> {
    await deleteAllUsers();
    console.log(`All users have been deleted successfully ...!`);
}

export async function handlerUsers(): Promise<void> {
    const users = await getAllUsers();
    for(const user of users) {
        console.log(`* ${user.name} ${user.name === config.currentUserName ? "(current)" : ""}`);
    }
}

export async function handlerAgg(): Promise<void> {
    const feed = await fetchFeed(`https://www.wagslane.dev/index.xml`);
    console.log(JSON.stringify(feed));
}

export async function handlerAddFeed(user: User, ...args: string[]): Promise<void> {
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    console.log(`Feed name: ${feed.name}`);
    console.log(`User name: ${config.currentUserName}`);
}

export async function handlerFeeds(): Promise<void> {
    const feeds = await getAllFeeds();
    console.log(feeds);
}

export async function handlerFollow(user: User, url: string): Promise<void> {
    const feed = await getFeedByUrl(url);
    const result = await createFeedFollow(user.id, feed.id);
    console.log(`Feed has been follow successfully ...!`);
    console.log(`User name: ${result.userName}`);
    console.log(`Feed name: ${result.feedName}`);
}

export async function handlerFollowing(user: User): Promise<void> {
    const result = await getFeedFollowsForUser(user.id);
    for(const record of result) {
        console.log(`${record.feedName}`);
    }
}

export async function handlerUnfollow(user: User, url: string): Promise<void> {
    const feed = await getFeedByUrl(url);
    await deleteFeedFollow(user.id, feed.id);
}