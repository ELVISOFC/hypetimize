import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  bigint,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow (from template).
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workspace: Team/creator workspace for organizing videos and settings
 */
export const workspaces = mysqlTable("workspaces", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  ownerId: int("ownerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

/**
 * WorkspaceMember: Team members and their roles
 */
export const workspaceMembers = mysqlTable("workspaceMembers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

/**
 * WorkspaceInvitation: Pending invites for team members
 */
export const workspaceInvitations = mysqlTable("workspaceInvitations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type InsertWorkspaceInvitation = typeof workspaceInvitations.$inferInsert;

/**
 * YouTubeAccount: Connected YouTube channel for a workspace
 */
export const youtubeAccounts = mysqlTable("youtubeAccounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().unique().references(() => workspaces.id, { onDelete: "cascade" }),
  channelId: varchar("channelId", { length: 255 }).notNull().unique(),
  channelName: varchar("channelName", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YouTubeAccount = typeof youtubeAccounts.$inferSelect;
export type InsertYouTubeAccount = typeof youtubeAccounts.$inferInsert;

/**
 * Subscription: Billing and plan information per workspace
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().unique().references(() => workspaces.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["Free", "Pro", "Studio"]).default("Free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd"),
  status: mysqlEnum("status", ["active", "past_due", "canceled", "trialing", "incomplete"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * SubscriptionPlan: Pricing and feature tiers
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tier: mysqlEnum("tier", ["Free", "Pro", "Studio"]).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  priceMonthly: int("priceMonthly").default(0),
  videoLimitPerMonth: int("videoLimitPerMonth").default(2),
  features: json("features"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Video: Uploaded or linked video for processing
 */
export const videos = mysqlTable("videos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sourceType: mysqlEnum("sourceType", ["upload", "youtube_url"]).notNull(),
  youtubeUrl: varchar("youtubeUrl", { length: 2048 }),
  youtubeVideoId: varchar("youtubeVideoId", { length: 255 }),
  rawStoragePath: varchar("rawStoragePath", { length: 2048 }),
  rawStorageBucket: varchar("rawStorageBucket", { length: 255 }),
  durationSeconds: int("durationSeconds"),
  fileSizeBytes: bigint("fileSizeBytes", { mode: "number" }),
  processingStatus: mysqlEnum("processingStatus", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  processingError: text("processingError"),
  generatedTitle: varchar("generatedTitle", { length: 255 }),
  generatedDescription: text("generatedDescription"),
  generatedTags: json("generatedTags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Asset: Generated outputs (thumbnails, clips, captions)
 */
export const assets = mysqlTable("assets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  videoId: varchar("videoId", { length: 64 }).notNull().references(() => videos.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["thumbnail", "highlight_clip", "caption_file", "raw_video", "transcoded_video"]).notNull(),
  storagePath: varchar("storagePath", { length: 2048 }).notNull(),
  storageBucket: varchar("storageBucket", { length: 255 }).notNull(),
  fileSizeBytes: bigint("fileSizeBytes", { mode: "number" }),
  mimeType: varchar("mimeType", { length: 100 }),
  metadata: json("metadata"),
  thumbnailVariant: int("thumbnailVariant"),
  clipStartTime: decimal("clipStartTime", { precision: 10, scale: 2 }),
  clipEndTime: decimal("clipEndTime", { precision: 10, scale: 2 }),
  clipDuration: decimal("clipDuration", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Job: Background job for processing (transcription, thumbnail gen, SEO, clips)
 */
export const jobs = mysqlTable("jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  videoId: varchar("videoId", { length: 64 }).notNull().references(() => videos.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["thumbnail_generation", "highlight_clip", "seo_metadata", "video_transcode", "caption_generation"]).notNull(),
  status: mysqlEnum("status", ["pending", "queued", "processing", "completed", "failed", "canceled"]).default("pending").notNull(),
  queueJobId: varchar("queueJobId", { length: 255 }),
  priority: int("priority").default(0),
  progress: int("progress").default(0),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  errorMessage: text("errorMessage"),
  errorStack: text("errorStack"),
  attempts: int("attempts").default(0),
  maxAttempts: int("maxAttempts").default(3),
  dependsOnJobId: varchar("dependsOnJobId", { length: 64 }),
  resultData: json("resultData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * UsageRecord: Track usage against subscription limits
 */
export const usageRecords = mysqlTable("usageRecords", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  videosProcessed: int("videosProcessed").default(0),
  thumbnailsGenerated: int("thumbnailsGenerated").default(0),
  clipsGenerated: int("clipsGenerated").default(0),
  seoMetadataGenerated: int("seoMetadataGenerated").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageRecord = typeof usageRecords.$inferSelect;
export type InsertUsageRecord = typeof usageRecords.$inferInsert;

/**
 * Notification: In-app notifications for job completion/failure
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  workspaceId: varchar("workspaceId", { length: 64 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["job_completed", "job_failed", "subscription_updated", "team_invited"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  jobId: varchar("jobId", { length: 64 }),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * ThumbnailFeedback: User ratings and comments on generated thumbnails
 */
export const thumbnailFeedback = mysqlTable("thumbnailFeedback", {
  id: varchar("id", { length: 64 }).primaryKey(),
  assetId: varchar("assetId", { length: 64 }).notNull().references(() => assets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  helpful: boolean("helpful"), // Did this help improve results?
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThumbnailFeedback = typeof thumbnailFeedback.$inferSelect;
export type InsertThumbnailFeedback = typeof thumbnailFeedback.$inferInsert;
