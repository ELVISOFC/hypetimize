import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, workspaces, subscriptions, videos, jobs, usageRecords, notifications, workspaceMembers, youtubeAccounts, thumbnailFeedback, InsertThumbnailFeedback } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Workspace queries
 */
export async function createWorkspace(ownerId: number, name: string, slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(workspaces).values({ id, ownerId, name, slug });
  return { id, ownerId, name, slug };
}

export async function getWorkspaceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getWorkspaceById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserWorkspaces(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(workspaces).where(eq(workspaces.ownerId, userId));
}

/**
 * Subscription queries
 */
export async function getSubscriptionByWorkspaceId(workspaceId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.workspaceId, workspaceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(workspaceId: string, tier: "Free" | "Pro" | "Studio" = "Free") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(subscriptions).values({ id, workspaceId, tier });
  return { id, workspaceId, tier };
}

/**
 * Video queries
 */
export async function createVideo(workspaceId: string, title: string, sourceType: "upload" | "youtube_url", youtubeUrl?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(videos).values({ id, workspaceId, title, sourceType, youtubeUrl });
  return { id, workspaceId, title, sourceType, youtubeUrl };
}

export async function getVideosByWorkspace(workspaceId: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(videos).where(eq(videos.workspaceId, workspaceId)).limit(limit);
}

export async function getVideoById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Job queries
 */
export async function createJob(videoId: string, type: "thumbnail_generation" | "highlight_clip" | "seo_metadata" | "video_transcode" | "caption_generation", status: "pending" | "queued" | "processing" | "completed" | "failed" | "canceled" = "pending") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(jobs).values({ id, videoId, type, status });
  return { id, videoId, type, status };
}

export async function getJobsByVideo(videoId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(jobs).where(eq(jobs.videoId, videoId));
}

export async function getJobById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Usage queries
 */
export async function getUsageRecord(workspaceId: string, periodStart: Date, periodEnd: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(usageRecords).where(
    and(eq(usageRecords.workspaceId, workspaceId), eq(usageRecords.periodStart, periodStart), eq(usageRecords.periodEnd, periodEnd))
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Notification queries
 */
export async function createNotification(workspaceId: string, type: "job_completed" | "job_failed" | "subscription_updated" | "team_invited", title: string, content?: string, jobId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(notifications).values({ id, workspaceId, type, title, content, jobId });
  return { id, workspaceId, type, title, content, jobId };
}

export async function getNotificationsByWorkspace(workspaceId: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.workspaceId, workspaceId)).limit(limit);
}

/**
 * YouTube account queries
 */
export async function getYouTubeAccountByWorkspace(workspaceId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(youtubeAccounts).where(eq(youtubeAccounts.workspaceId, workspaceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createYouTubeAccount(workspaceId: string, channelId: string, channelName: string, accessToken?: string, refreshToken?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  await db.insert(youtubeAccounts).values({ id, workspaceId, channelId, channelName, accessToken, refreshToken });
  return { id, workspaceId, channelId, channelName, accessToken, refreshToken };
}

/**
 * Thumbnail feedback queries
 */
export async function createThumbnailFeedback(assetId: string, userId: number, rating: number, comment?: string, helpful?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = Math.random().toString(36).substring(2, 15);
  const feedback: InsertThumbnailFeedback = { id, assetId, userId, rating, comment, helpful };
  await db.insert(thumbnailFeedback).values(feedback);
  return { id, assetId, userId, rating, comment, helpful };
}

export async function getFeedbackByAsset(assetId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(thumbnailFeedback).where(eq(thumbnailFeedback.assetId, assetId));
}

export async function getFeedbackByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(thumbnailFeedback).where(eq(thumbnailFeedback.userId, userId));
}

export async function getAverageRatingByAsset(assetId: string) {
  const db = await getDb();
  if (!db) return 0;
  const feedback = await db.select().from(thumbnailFeedback).where(eq(thumbnailFeedback.assetId, assetId));
  if (feedback.length === 0) return 0;
  const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
  return Math.round((sum / feedback.length) * 10) / 10;
}
