import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    stripePriceId: {
      type: String,
      required: true,
      unique: true,
    },

    stripeProductId: {
      type: String,
      required: true,
    },

    unitAmount: {
      type: Number,
      required: true, // in smallest currency unit (paise, cents)
    },

    currency: {
      type: String,
      required: true,
      lowercase: true,
    },

    interval: {
      type: String,
      required: true,
      enum: ["day", "week", "month", "year"],
    },

    intervalCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export const Price = mongoose.model("Price", priceSchema);
