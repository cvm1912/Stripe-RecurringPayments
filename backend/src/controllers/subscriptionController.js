import { Subscription } from "../models/subscription.js";
import { User } from "../models/user.js";
import { Price } from "../models/price.js";
import stripe from "../configs/stripeClient.js";

// Create subscription via Stripe
export const createSubscription = async (req, res) => {
  try {
    const { userId, priceId } = req.body;

    if (!userId || !priceId) {
      return res.status(400).json({
        success: false,
        message: "userId and priceId are required",
      });
    }

    const user = await User.findById(userId);
    const price = await Price.findById(priceId);

    if (!user || !price) {
      return res.status(404).json({
        success: false,
        message: "User or Price not found",
      });
    }

    // Stripe subscription creation
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: price.stripePriceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const paymentIntent = subscription.latest_invoice?.payment_intent;

    // Map Stripe subscription to DB model
    const subscriptionData = {
      user: userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: user.stripeCustomerId,
      stripePriceId: price.stripePriceId,
      status: subscription.status,
      price: priceId,
      currentPeriodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000)
        : undefined,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined,
    };

    const newSubscription = await Subscription.create(subscriptionData);

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscription: newSubscription,
        clientSecret: paymentIntent?.client_secret,
        paymentIntentId: paymentIntent?.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { userId, priceId } = req.body;

    if (!userId || !priceId) {
      return res.status(400).json({
        success: false,
        message: "userId and priceId are required",
      });
    }

    const user = await User.findById(userId);
    const price = await Price.findById(priceId);

    if (!user || !price) {
      return res.status(404).json({
        success: false,
        message: "User or Price not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate("user", "name email")
      .populate("price", "unitAmount currency interval");

    return res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
