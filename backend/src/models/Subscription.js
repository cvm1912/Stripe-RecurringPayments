import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },

    stripeCustomerId: {
      type: String,
      required: true,
    },

    stripePriceId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
      ],
    },

    currentPeriodStart: {
      type: Date,
    },

    currentPeriodEnd: {
      type: Date,
    },

    price: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema
);
