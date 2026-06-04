/**
 * Stripe Checkout Session Handler
 * Creates checkout sessions for subscription upgrades
 */

import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getProductByTier } from "./products";

const stripe = new Stripe(ENV.stripeSecretKey || "", {
  apiVersion: "2024-12-18.acacia",
});

export interface CheckoutSessionParams {
  userId: number;
  userEmail: string;
  userName: string;
  tier: "pro" | "studio";
  workspaceId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe checkout session for subscription upgrade
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<{ sessionUrl: string | null }> {
  try {
    const product = getProductByTier(params.tier);

    if (!product || product.price === 0) {
      throw new Error("Invalid product tier or free tier cannot be purchased");
    }

    // Create Stripe price if it doesn't exist
    // In production, you'd manage prices through Stripe dashboard
    const priceId = `price_${params.tier}_monthly`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: params.userEmail,
      client_reference_id: params.userId.toString(),
      metadata: {
        user_id: params.userId.toString(),
        workspace_id: params.workspaceId,
        customer_email: params.userEmail,
        customer_name: params.userName,
        tier: params.tier,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
      allow_promotion_codes: true,
    });

    return {
      sessionUrl: session.url,
    };
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    throw error;
  }
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to retrieve checkout session:", error);
    throw error;
  }
}

/**
 * Get customer subscriptions
 */
export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });
    return subscriptions.data;
  } catch (error) {
    console.error("Failed to retrieve subscriptions:", error);
    throw error;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    throw error;
  }
}
