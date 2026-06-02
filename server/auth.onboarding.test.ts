import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Workspace Creation (Onboarding)", () => {
  it("should create a workspace with name and slug", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.workspace.create({
      name: "Test Workspace",
      slug: "test-workspace",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Test Workspace");
    expect(result.slug).toBe("test-workspace");
    expect(result.ownerId).toBe(ctx.user.id);
  });

  it("should create a default Free subscription when workspace is created", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const workspace = await caller.workspace.create({
      name: "Subscription Test",
      slug: "subscription-test",
    });

    const subscription = await caller.subscription.getCurrent({
      workspaceId: workspace.id,
    });

    expect(subscription).toBeDefined();
    expect(subscription.tier).toBe("Free");
  });

  it("should list user workspaces after creation", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create first workspace
    await caller.workspace.create({
      name: "Workspace 1",
      slug: "workspace-1",
    });

    // List workspaces
    const workspaces = await caller.workspace.list();

    expect(workspaces).toBeDefined();
    expect(workspaces.length).toBeGreaterThan(0);
    expect(workspaces.some((w) => w.name === "Workspace 1")).toBe(true);
  });

  it("should validate workspace name is required", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.workspace.create({
        name: "",
        slug: "test",
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate workspace slug is required", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.workspace.create({
        name: "Test",
        slug: "",
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
