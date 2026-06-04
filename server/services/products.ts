/**
 * Stripe Products Configuration
 * Defines pricing tiers and product information for HYPETIMIZE
 */

export const STRIPE_PRODUCTS = {
  FREE: {
    id: "prod_free_tier",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    currency: "usd",
    interval: null, // One-time
    features: [
      "5 thumbnails/month",
      "Basic SEO optimization",
      "1 workspace",
      "Community support",
    ],
    limits: {
      thumbnailsPerMonth: 5,
      seoRunsPerMonth: 10,
      clipsPerMonth: 0,
      maxWorkspaces: 1,
      maxTeamMembers: 1,
    },
  },
  PRO: {
    id: "prod_pro_tier",
    name: "Pro",
    description: "For serious creators",
    price: 2999, // $29.99 in cents
    currency: "usd",
    interval: "month",
    features: [
      "100 thumbnails/month",
      "Advanced SEO optimization",
      "Unlimited workspaces",
      "Priority support",
      "Clip extraction (basic)",
    ],
    limits: {
      thumbnailsPerMonth: 100,
      seoRunsPerMonth: 100,
      clipsPerMonth: 20,
      maxWorkspaces: 10,
      maxTeamMembers: 3,
    },
  },
  STUDIO: {
    id: "prod_studio_tier",
    name: "Studio",
    description: "For content agencies",
    price: 9999, // $99.99 in cents
    currency: "usd",
    interval: "month",
    features: [
      "Unlimited thumbnails",
      "Premium SEO optimization",
      "Unlimited workspaces",
      "24/7 dedicated support",
      "Advanced clip extraction",
      "Team collaboration",
      "Custom branding",
    ],
    limits: {
      thumbnailsPerMonth: 999999,
      seoRunsPerMonth: 999999,
      clipsPerMonth: 999999,
      maxWorkspaces: 999,
      maxTeamMembers: 50,
    },
  },
};

/**
 * Get product by tier name
 */
export function getProductByTier(tier: "free" | "pro" | "studio") {
  const tierMap = {
    free: STRIPE_PRODUCTS.FREE,
    pro: STRIPE_PRODUCTS.PRO,
    studio: STRIPE_PRODUCTS.STUDIO,
  };
  return tierMap[tier];
}

/**
 * Format price for display
 */
export function formatPrice(priceInCents: number, currency: string = "usd"): string {
  const priceInDollars = priceInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceInDollars);
}

/**
 * Get all products as array
 */
export function getAllProducts() {
  return [STRIPE_PRODUCTS.FREE, STRIPE_PRODUCTS.PRO, STRIPE_PRODUCTS.STUDIO];
}
