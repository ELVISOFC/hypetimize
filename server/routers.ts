import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /**
   * Workspace procedures
   */
  workspace: router({
    create: protectedProcedure
      .input(z.object({ name: z.string().min(1).max(255), slug: z.string().min(1).max(255) }))
      .mutation(async ({ ctx, input }) => {
        const workspace = await db.createWorkspace(ctx.user.id, input.name, input.slug);
        // Create default Free subscription
        await db.createSubscription(workspace.id, "Free");
        return workspace;
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserWorkspaces(ctx.user.id);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getWorkspaceById(input.id);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getWorkspaceBySlug(input.slug);
      }),
  }),

  /**
   * Subscription procedures
   */
  subscription: router({
    getCurrent: protectedProcedure
      .input(z.object({ workspaceId: z.string() }))
      .query(async ({ input }) => {
        return await db.getSubscriptionByWorkspaceId(input.workspaceId);
      }),

    listPlans: publicProcedure
      .query(async () => {
        // Return hardcoded plans for now
        return [
          {
            id: "free",
            tier: "Free",
            name: "Free",
            priceMonthly: 0,
            videoLimitPerMonth: 2,
            features: ["2 videos/month", "Basic SEO metadata", "Standard thumbnails"],
          },
          {
            id: "pro",
            tier: "Pro",
            name: "Pro",
            priceMonthly: 2999,
            videoLimitPerMonth: 20,
            features: ["20 videos/month", "Advanced SEO optimization", "Premium thumbnails", "Highlight clips"],
          },
          {
            id: "studio",
            tier: "Studio",
            name: "Studio",
            priceMonthly: 9999,
            videoLimitPerMonth: -1,
            features: ["Unlimited videos", "Full AI suite", "Priority processing", "Team collaboration"],
          },
        ];
      }),
  }),

  /**
   * Video procedures
   */
  video: router({
    create: protectedProcedure
      .input(z.object({
        workspaceId: z.string(),
        title: z.string().min(1).max(255),
        sourceType: z.enum(["upload", "youtube_url"]),
        youtubeUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const video = await db.createVideo(input.workspaceId, input.title, input.sourceType, input.youtubeUrl);
        // Create processing jobs
        await db.createJob(video.id, "seo_metadata");
        await db.createJob(video.id, "thumbnail_generation");
        await db.createJob(video.id, "highlight_clip");
        return video;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getVideosByWorkspace(input.workspaceId, input.limit);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const video = await db.getVideoById(input.id);
        if (!video) throw new Error("Video not found");
        const jobs = await db.getJobsByVideo(input.id);
        return { ...video, jobs };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        // In production, also delete from S3
        return { success: true, deletedId: input.id };
      }),
  }),

  /**
   * Job procedures
   */
  job: router({
    list: protectedProcedure
      .input(z.object({ videoId: z.string() }))
      .query(async ({ input }) => {
        return await db.getJobsByVideo(input.videoId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getJobById(input.id);
      }),

    cancel: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return { success: true, jobId: input.id };
      }),
  }),

  /**
   * Notification procedures
   */
  notification: router({
    list: protectedProcedure
      .input(z.object({ workspaceId: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getNotificationsByWorkspace(input.workspaceId, input.limit);
      }),
  }),

  /**
   * YouTube account procedures
   */
  youtubeAccount: router({
    get: protectedProcedure
      .input(z.object({ workspaceId: z.string() }))
      .query(async ({ input }) => {
        return await db.getYouTubeAccountByWorkspace(input.workspaceId);
      }),

    connect: protectedProcedure
      .input(z.object({
        workspaceId: z.string(),
        channelId: z.string(),
        channelName: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createYouTubeAccount(input.workspaceId, input.channelId, input.channelName);
      }),
  }),
});

export type AppRouter = typeof appRouter;
