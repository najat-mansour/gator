import { db } from "..";
import { users, feeds } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) { 
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return result;
}

export async function getAllFeeds() {
    const result = await db
    .select({
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
    return result;
}

export type User = typeof users.$inferSelect; 
export type Feed = typeof feeds.$inferSelect; 

export function printFeed(user: User, feed: Feed) {
    console.log(`User ID: ${user.id}`);
    console.log(`User name: ${user.name}`);
    console.log(`Feed ID: ${feed.id}`);
    console.log(`Feed name: ${feed.name}`);
    console.log(`Feed URL: ${feed.url}`);
}