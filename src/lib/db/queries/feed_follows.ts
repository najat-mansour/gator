import { db } from "..";
import { users, feeds, feedFollows } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    //! Insert a record into feed_follows table
    await db.insert(feedFollows).values({
        userId: userId,
        feedId: feedId
    });
    //! Select the returned data
    const [result] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userName: users.name,
        feedName: feeds.name
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(users.id, userId) && eq(feeds.id, feedId));
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userName: users.name,
        feedName: feeds.name
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(users.id, userId));
    return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    await db.delete(feedFollows).where(eq(feedFollows.userId, userId) && eq(feedFollows.feedId, feedId));
}