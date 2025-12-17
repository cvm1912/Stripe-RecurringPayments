import { Subscription } from "../models/Subscription.js";
import { User } from "../models/user.js";
import { Price } from "../models/price.js";
import stripe from "../configs/stripeClient.js";

// Create Subscription with Dynamic Time Autopay
export const createSubscription = async (req, res) => {
  try {
    const { userId, priceId, scheduleMinutes = 0 } = req.body;

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

    // Create payment method for autopay
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_visa' },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId,
    });

    let subscription;
    let message = "Autopay subscription created successfully";

    if (scheduleMinutes > 0) {
      // Scheduled subscription
      const billingCycleAnchor = Math.floor(Date.now() / 1000) + (scheduleMinutes * 60);
      
      subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: price.stripePriceId }],
        default_payment_method: paymentMethod.id,
        billing_cycle_anchor: billingCycleAnchor,
        proration_behavior: 'none',
      });
      
      message = `Autopay subscription scheduled to start in ${scheduleMinutes} minutes`;
    } else {
      // Immediate subscription
      subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: price.stripePriceId }],
        default_payment_method: paymentMethod.id,
      });
    }

    const newSubscription = await Subscription.create({
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
    });

    const responseData = {
      subscription: newSubscription,
      paymentMethodId: paymentMethod.id,
      status: subscription.status
    };

    if (scheduleMinutes > 0) {
      responseData.scheduledStart = new Date((Math.floor(Date.now() / 1000) + (scheduleMinutes * 60)) * 1000);
      responseData.scheduleMinutes = scheduleMinutes;
    }

    return res.status(201).json({
      success: true,
      message: message,
      data: responseData,
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