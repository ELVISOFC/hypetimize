/**
 * AI Thumbnail Generation Service
 * Generates YouTube thumbnails using Manus AI image generation API
 */

import { generateImage } from "../_core/imageGeneration";

export interface ThumbnailVariant {
  id: string;
  title: string;
  style: string;
  url: string; // Real image URL from AI service
  prompt: string; // The prompt used to generate this thumbnail
}

/**
 * Generate AI-powered thumbnail variants with different styles
 * Each variant uses a specific prompt to create a unique design
 */
export async function generateAIThumbnails(
  videoTitle: string,
  videoDescription?: string
): Promise<ThumbnailVariant[]> {
  const variants: ThumbnailVariant[] = [];

  // Prepare context for better AI generation
  const titleSnippet = videoTitle.substring(0, 50);
  const descriptionSnippet = videoDescription?.substring(0, 100) || "";

  // Variant 1: Bold Headline Style
  const boldPrompt = `Create a YouTube thumbnail with bold, eye-catching design. 
    Large white text reading "${titleSnippet}" on a stark black background. 
    Add a bright red accent bar or element. 
    Make it high-contrast and attention-grabbing. 
    YouTube standard 1280x720px. Professional quality.`;

  try {
    const boldResult = await generateImage({ prompt: boldPrompt });
    if (boldResult.url) {
      variants.push({
        id: "thumb-bold",
        title: "Bold Headline",
        style: "High contrast with bold red accent",
        url: boldResult.url,
        prompt: boldPrompt,
      });
    }
  } catch (error) {
    console.error("Failed to generate bold thumbnail:", error);
  }

  // Variant 2: Curiosity Gap Style
  const curiosityPrompt = `Create a YouTube thumbnail with curiosity gap design.
    Large question mark with "${titleSnippet}?" in bold white text.
    Use yellow or gold highlights on black background.
    Include a subtle arrow or pointing element.
    YouTube standard 1280x720px. Professional quality.`;

  try {
    const curiosityResult = await generateImage({ prompt: curiosityPrompt });
    if (curiosityResult.url) {
      variants.push({
        id: "thumb-curiosity",
        title: "Curiosity Gap",
        style: "Question format with yellow highlight",
        url: curiosityResult.url,
        prompt: curiosityPrompt,
      });
    }
  } catch (error) {
    console.error("Failed to generate curiosity thumbnail:", error);
  }

  // Variant 3: Minimalist Clean
  const minimalistPrompt = `Create a clean, minimalist YouTube thumbnail.
    Simple white text reading "${titleSnippet}" centered on black background.
    Add subtle geometric shapes or lines in gray.
    Focus on readability and elegance.
    YouTube standard 1280x720px. Professional quality.`;

  try {
    const minimalistResult = await generateImage({ prompt: minimalistPrompt });
    if (minimalistResult.url) {
      variants.push({
        id: "thumb-minimal",
        title: "Minimalist",
        style: "Clean white text on dark background",
        url: minimalistResult.url,
        prompt: minimalistPrompt,
      });
    }
  } catch (error) {
    console.error("Failed to generate minimalist thumbnail:", error);
  }

  // If all AI generation fails, return empty array (frontend will handle gracefully)
  if (variants.length === 0) {
    console.warn("No thumbnails were successfully generated");
  }

  return variants;
}

/**
 * Generate a single custom thumbnail based on user specifications
 */
export async function generateCustomThumbnail(
  customPrompt: string
): Promise<{ url: string; prompt: string } | null> {
  try {
    const result = await generateImage({
      prompt: `Create a professional YouTube thumbnail based on this description:
        ${customPrompt}
        
        Requirements:
        - YouTube standard 1280x720px
        - High contrast and eye-catching
        - Professional quality
        - Suitable for YouTube platform`,
    });

    if (result.url) {
      return {
        url: result.url,
        prompt: customPrompt,
      };
    }
  } catch (error) {
    console.error("Failed to generate custom thumbnail:", error);
  }

  return null;
}

/**
 * Escape XML special characters for SVG content
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
