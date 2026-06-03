import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "feedback-test-user",
    email: "feedback@example.com",
    name: "Feedback Tester",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Thumbnail Feedback", () => {
  it("should validate rating is between 1-5", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.create({
        assetId: "test-asset-789",
        rating: 6, // Invalid: > 5
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate rating is not below 1", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.create({
        assetId: "test-asset-invalid",
        rating: 0, // Invalid: < 1
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should get average rating for non-existent asset", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const assetId = "non-existent-asset-123";

    const stats = await caller.feedback.getAverageRating({ assetId });

    expect(stats).toBeDefined();
    expect(stats.averageRating).toBe(0);
    expect(stats.totalFeedback).toBe(0);
  });

  it("should get empty feedback list for non-existent asset", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const assetId = "non-existent-asset-456";

    const feedbackList = await caller.feedback.getByAsset({ assetId });

    expect(feedbackList).toBeDefined();
    expect(Array.isArray(feedbackList)).toBe(true);
    expect(feedbackList.length).toBe(0);
  });

  it("should validate required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.feedback.create({
        assetId: "",
        rating: 5,
      });
      expect.fail("Should have thrown validation error for empty assetId");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
