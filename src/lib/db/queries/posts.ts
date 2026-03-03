import { db } from "..";
import { users, feeds, posts } from "../schema";
import { desc, eq } from "drizzle-orm";

export async function createPost(title: string, url: string, description: string, publishedAt: string, feedId: string) {
    const [result] = await db.insert(posts).values({
        title: title,
        url: url,
        description: description,
        publishedAt: new Date(publishedAt),
        feedId: feedId
    }).returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db.select({ 
            title: posts.title,  
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt
        })
        .from(posts)
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .innerJoin(users, eq(users.id, feeds.userId))
        .where(eq(users.id, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
    return result;
}