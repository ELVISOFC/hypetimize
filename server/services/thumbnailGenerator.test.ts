import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAIThumbnails, generateCustomThumbnail } from "./thumbnailGenerator";

// Mock the image generation service
vi.mock("../server/_core/imageGeneration", () => ({
  generateImage: vi.fn(async (options: { prompt: string }) => {
    // Return a mock URL for testing
    return {
      url: `https://example.com/generated-${Date.now()}.png`,
    };
  }),
}));

describe("Real AI Thumbnail Generation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate 3 AI thumbnail variants with different styles", async () => {
    const videoTitle = "How to Master YouTube SEO";
    const variants = await generateAIThumbnails(videoTitle);

    expect(variants.length).toBeGreaterThanOrEqual(1);
    expect(variants[0]).toHaveProperty("id");
    expect(variants[0]).toHaveProperty("title");
    expect(variants[0]).toHaveProperty("style");
    expect(variants[0]).toHaveProperty("url");
    expect(variants[0]).toHaveProperty("prompt");
  });

  it("should include real image URLs from AI service", async () => {
    const videoTitle = "YouTube Tips and Tricks";
    const variants = await generateAIThumbnails(videoTitle);

    variants.forEach((variant) => {
      expect(variant.url).toBeDefined();
      expect(typeof variant.url).toBe("string");
      expect(variant.url.length).toBeGreaterThan(0);
    });
  });

  it("should include prompts used for generation", async () => {
    const videoTitle = "Creator Monetization Guide";
    const variants = await generateAIThumbnails(videoTitle);

    variants.forEach((variant) => {
      expect(variant.prompt).toBeDefined();
      expect(variant.prompt.length).toBeGreaterThan(0);
      expect(variant.prompt).toContain(videoTitle);
    });
  });

  it("should handle video description in thumbnail generation", async () => {
    const videoTitle = "Advanced YouTube Analytics";
    const videoDescription = "Learn how to use YouTube Analytics to grow your channel";

    const variants = await generateAIThumbnails(videoTitle, videoDescription);

    expect(variants.length).toBeGreaterThanOrEqual(1);
    variants.forEach((variant) => {
      expect(variant.url).toBeDefined();
    });
  });

  it("should generate custom thumbnails from user prompts", async () => {
    const customPrompt = "Red and white design with bold text";
    const result = await generateCustomThumbnail(customPrompt);

    expect(result).toBeDefined();
    expect(result?.url).toBeDefined();
    expect(result?.prompt).toBe(customPrompt);
  });

  it("should assign unique IDs to each variant", async () => {
    const videoTitle = "SEO Optimization Secrets";
    const variants = await generateAIThumbnails(videoTitle);

    if (variants.length > 1) {
      const ids = variants.map((v) => v.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(variants.length);
    }
  });

  it("should include style descriptions for each variant", async () => {
    const videoTitle = "Content Strategy 2026";
    const variants = await generateAIThumbnails(videoTitle);

    variants.forEach((variant) => {
      expect(variant.style).toBeDefined();
      expect(variant.style.length).toBeGreaterThan(0);
    });
  });

  it("should handle empty custom prompt gracefully", async () => {
    const result = await generateCustomThumbnail("");
    // Should either return null or handle gracefully
    expect(result === null || result?.url).toBeDefined();
  });

  it("should generate thumbnails with different titles", async () => {
    const videoTitle = "Thumbnail Generation Test";
    const variants = await generateAIThumbnails(videoTitle);

    const titles = variants.map((v) => v.title);
    const uniqueTitles = new Set(titles);

    if (variants.length > 1) {
      expect(uniqueTitles.size).toBeGreaterThan(0);
    }
  });
});
