import { describe, it, expect } from "vitest";
import { generateMockThumbnails, svgToDataUrl } from "./thumbnailGenerator";

describe("Thumbnail Generation Service", () => {
  it("should generate 3 thumbnail variants", () => {
    const variants = generateMockThumbnails("Test Video Title");
    expect(variants).toHaveLength(3);
  });

  it("should generate variants with correct structure", () => {
    const variants = generateMockThumbnails("Test Video Title");
    
    variants.forEach((variant) => {
      expect(variant).toHaveProperty("id");
      expect(variant).toHaveProperty("title");
      expect(variant).toHaveProperty("style");
      expect(variant).toHaveProperty("svgContent");
    });
  });

  it("should create unique variant IDs", () => {
    const variants = generateMockThumbnails("Test Video Title");
    const ids = variants.map((v) => v.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });

  it("should include different styles", () => {
    const variants = generateMockThumbnails("Test Video Title");
    const styles = variants.map((v) => v.style);
    expect(styles).toContain("High contrast with bold red accent");
    expect(styles).toContain("Question format with yellow highlight");
    expect(styles).toContain("Clean white text on dark background");
  });

  it("should generate valid SVG content", () => {
    const variants = generateMockThumbnails("Test Video Title");
    
    variants.forEach((variant) => {
      expect(variant.svgContent).toContain("<svg");
      expect(variant.svgContent).toContain("</svg>");
      expect(variant.svgContent).toContain("Test Video Title");
    });
  });

  it("should convert SVG to data URL", () => {
    const svg = "<svg><text>Test</text></svg>";
    const dataUrl = svgToDataUrl(svg);
    
    expect(dataUrl).toContain("data:image/svg+xml");
    expect(dataUrl).toContain("Test");
  });

  it("should handle long titles by truncating", () => {
    const longTitle = "This is a very long video title that should be truncated because it exceeds the character limit";
    const variants = generateMockThumbnails(longTitle);
    
    variants.forEach((variant) => {
      expect(variant.svgContent).toContain("...");
    });
  });

  it("should escape XML special characters in titles", () => {
    const titleWithSpecialChars = "Video <Title> & \"Test\"";
    const variants = generateMockThumbnails(titleWithSpecialChars);
    
    variants.forEach((variant) => {
      // SVG content should escape special chars
      expect(variant.svgContent).not.toContain("<Title>");
      expect(variant.svgContent).toContain("&lt;");
      expect(variant.svgContent).toContain("&gt;");
    });
  });
});
