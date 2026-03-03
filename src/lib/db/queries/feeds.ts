import { db } from "..";
import { users, feeds } from "../schema";
import { eq } from "drizzle-orm";
import { createFeedFollow } from "./feed_follows";

export async function createFeed(name: string, url: string, userId: string) { 
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    //! Also, create a feed follow record
    const feed = await getFeedByUrl(url);
    await createFeedFollow(userId, feed.id);
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

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}