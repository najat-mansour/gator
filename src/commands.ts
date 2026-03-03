import { readConfig, setUser } from "./config";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feed_follows";
import { createFeed, getAllFeeds, getFeedByUrl, getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { createPost, getPostsForUser } from "./lib/db/queries/posts";
import { createUser, deleteAllUsers, getAllUsers, getUserByName } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";
import { parseDuration } from "./utils";

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

export async function handlerAgg(user: User, timeBetweenReqs: string): Promise<void> {
    const duration = parseDuration(timeBetweenReqs);

    const interval = setInterval(() => {
        scrapeFeeds();
    }, duration);

    //! Code to stop the setInterval when exiting the program! 
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
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
    console.log(`User feed has been unfollowed successfully ...!`);
}

async function scrapeFeeds(): Promise<void> {
    //! Get the next feed to fetch from the DB.
    const nextFeedToFetch = await getNextFeedToFetch();
    //! Mark it as fetched.
    await markFeedFetched(nextFeedToFetch.id);
    //! Fetch the feed using the URL (we already wrote this function)
    const feedData = await fetchFeed(nextFeedToFetch.url);
    //! Iterate over the items in the feed and print their titles to the console.
    for(const item of feedData.channel.item) {
        await createPost(item.title, item.link, item.description, item.pubDate, nextFeedToFetch.id);
    }
    console.log(`Posts has been saved successfully ...!`);
}

export async function handlerBrowse(user: User, limit: string = "2"): Promise<void> {
    try {
        const posts = await getPostsForUser(user.id, Number(limit));
        for(const post of posts) {
            console.log(`Title: ${post.title}`);
            console.log(`URL: ${post.url}`);
            console.log(`Description: ${post.description}`);
            console.log(`Published at: ${post.publishedAt}`);
        }

    } catch(err: unknown) {
        if (err instanceof Error) {
            console.log(`Please, enter a valid number ...!`);
        }
    }
} 