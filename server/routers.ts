import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { generateAIThumbnails, generateCustomThumbnail } from "./services/thumbnailGenerator";
import { getDb, createThumbnailFeedback, getFeedbackByAsset, getAverageRatingByAsset } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  workspace: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!db) return [];
      return await db.getWorkspacesByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return null;
        const workspace = await db.getWorkspace(input.id);
        if (workspace?.ownerId !== ctx.user.id) return null;
        return workspace;
      }),

    create: protectedProcedure
      .input(z.object({ name: z.string(), slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.createWorkspace(input.name, input.slug, ctx.user.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const workspace = await db.getWorkspace(input.id);
        if (workspace?.ownerId !== ctx.user.id) throw new Error("Unauthorized");
        return await db.deleteWorkspace(input.id);
      }),
  }),

  video: router({
    list: protectedProcedure
      .input(z.object({ workspaceId: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return [];
        return await db.getVideosByWorkspace(input.workspaceId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return null;
        return await db.getVideo(input.id);
      }),

    create: protectedProcedure
      .input(z.object({ workspaceId: z.string(), title: z.string(), youtubeUrl: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.createVideo(input.workspaceId, input.title, input.youtubeUrl);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.deleteVideo(input.id);
      }),
  }),

  job: router({
    list: protectedProcedure
      .input(z.object({ videoId: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return [];
        return await db.getJobsByVideo(input.videoId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return null;
        return await db.getJob(input.id);
      }),

    cancel: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.cancelJob(input.id);
      }),
  }),

  subscription: router({
    getCurrent: protectedProcedure
      .input(z.object({ workspaceId: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!db) return null;
        return await db.getSubscription(input.workspaceId);
      }),

    listPlans: publicProcedure.query(async () => {
      return [
        { id: "free", name: "Free", price: 0, limits: { thumbnails: 10, seoRuns: 5, clipsPerMonth: 3 } },
        { id: "pro", name: "Pro", price: 29, limits: { thumbnails: 100, seoRuns: 50, clipsPerMonth: 20 } },
        { id: "studio", name: "Studio", price: 99, limits: { thumbnails: 500, seoRuns: 200, clipsPerMonth: 100 } },
      ];
    }),

    upgrade: protectedProcedure
      .input(z.object({ workspaceId: z.string(), planId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return await db.updateSubscription(input.workspaceId, input.planId);
      }),
  }),

  thumbnail: router({
    generate: protectedProcedure
      .input(z.object({ videoTitle: z.string(), videoDescription: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Generate AI-powered thumbnails
          const variants = await generateAIThumbnails(input.videoTitle, input.videoDescription);

          // Return generated thumbnails with real URLs
          return variants.map((v) => ({
            id: v.id,
            title: v.title,
            style: v.style,
            downloadUrl: v.url, // Real image URL from AI service
            prompt: v.prompt,
          }));
        } catch (error) {
          console.error("Thumbnail generation failed:", error);
          throw new Error("Failed to generate thumbnails. Please try again.");
        }
      }),

    generateCustom: protectedProcedure
      .input(z.object({ prompt: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await generateCustomThumbnail(input.prompt);
          if (!result) {
            throw new Error("Failed to generate custom thumbnail");
          }
          return {
            id: "custom-thumbnail",
            title: "Custom",
            style: "User-specified design",
            downloadUrl: result.url,
            prompt: result.prompt,
          };
        } catch (error) {
          console.error("Custom thumbnail generation failed:", error);
          throw new Error("Failed to generate custom thumbnail. Please try again.");
        }
      }),
  }),

  /**
   * Thumbnail feedback procedures
   */
  feedback: router({
    create: protectedProcedure
      .input(z.object({ assetId: z.string().min(1), rating: z.number().min(1).max(5), comment: z.string().optional(), helpful: z.boolean().optional() }))
      .mutation(async ({ ctx, input }) => {
        try {
          return await createThumbnailFeedback(input.assetId, ctx.user.id, input.rating, input.comment, input.helpful);
        } catch (error: any) {
          if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error('Asset not found. Please ensure the thumbnail has been saved before providing feedback.');
          }
          throw error;
        }
      }),

    getByAsset: publicProcedure
      .input(z.object({ assetId: z.string() }))
      .query(async ({ input }) => {
        return await getFeedbackByAsset(input.assetId);
      }),

    getAverageRating: publicProcedure
      .input(z.object({ assetId: z.string() }))
      .query(async ({ input }) => {
        const avgRating = await getAverageRatingByAsset(input.assetId);
        const allFeedback = await getFeedbackByAsset(input.assetId);
        return { averageRating: avgRating, totalFeedback: allFeedback.length };
      }),
  }),
});

export type AppRouter = typeof appRouter;
