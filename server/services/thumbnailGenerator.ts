/**
 * Mock AI Thumbnail Generation Service
 * Generates realistic YouTube thumbnail previews using SVG
 */

export interface ThumbnailVariant {
  id: string;
  title: string;
  style: string;
  svgContent: string;
  downloadUrl?: string;
}

/**
 * Generate mock thumbnail variants with different styles
 * Each variant represents a different AI-generated design approach
 */
export function generateMockThumbnails(videoTitle: string): ThumbnailVariant[] {
  const variants: ThumbnailVariant[] = [];

  // Variant 1: Bold Text with Red Accent
  variants.push({
    id: "thumb-1",
    title: "Bold Headline",
    style: "High contrast with bold red accent",
    svgContent: createThumbnailSVG(
      videoTitle,
      "#FF0000",
      "#FFFFFF",
      "#000000",
      "Bold"
    ),
  });

  // Variant 2: Curiosity Gap Style
  variants.push({
    id: "thumb-2",
    title: "Curiosity Gap",
    style: "Question format with yellow highlight",
    svgContent: createThumbnailSVG(
      `${videoTitle}?`,
      "#FFD700",
      "#FFFFFF",
      "#000000",
      "Curiosity"
    ),
  });

  // Variant 3: Minimalist Clean
  variants.push({
    id: "thumb-3",
    title: "Minimalist",
    style: "Clean white text on dark background",
    svgContent: createThumbnailSVG(
      videoTitle,
      "#1A1A1A",
      "#FFFFFF",
      "#333333",
      "Minimal"
    ),
  });

  return variants;
}

/**
 * Create an SVG thumbnail with the given parameters
 * YouTube standard: 1280x720px
 */
function createThumbnailSVG(
  text: string,
  accentColor: string,
  textColor: string,
  bgColor: string,
  _style: string
): string {
  const width = 1280;
  const height = 720;

  // Truncate text if too long
  const displayText = text.length > 40 ? text.substring(0, 37) + "..." : text;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${bgColor}"/>
    
    <!-- Accent bar -->
    <rect width="${width}" height="120" y="${height - 120}" fill="${accentColor}" opacity="0.9"/>
    
    <!-- Text shadow for depth -->
    <text
      x="${width / 2}"
      y="${height / 2 + 40}"
      font-size="96"
      font-weight="bold"
      font-family="Arial, sans-serif"
      text-anchor="middle"
      fill="#000000"
      opacity="0.2"
    >
      ${escapeXml(displayText)}
    </text>
    
    <!-- Main text -->
    <text
      x="${width / 2}"
      y="${height / 2 + 20}"
      font-size="96"
      font-weight="bold"
      font-family="Arial, sans-serif"
      text-anchor="middle"
      fill="${textColor}"
    >
      ${escapeXml(displayText)}
    </text>
    
    <!-- Bottom accent text -->
    <text
      x="${width / 2}"
      y="${height - 40}"
      font-size="48"
      font-weight="bold"
      font-family="Arial, sans-serif"
      text-anchor="middle"
      fill="${bgColor}"
    >
      ▶ WATCH NOW
    </text>
  </svg>`;
}

/**
 * Convert SVG to a data URL for display
 */
export function svgToDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Simulate AI processing delay
 */
export async function simulateAIProcessing(delayMs: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
