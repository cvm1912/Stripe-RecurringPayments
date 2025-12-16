import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // reference to user
    required: true,
  },
  stripeSubscriptionId: { 
    type: String, 
    required: true 
  }, // Stripe subscription ID
  stripeCustomerId: { 
    type: String, 
    required: true 
},
  stripePriceId: { 
    type: String, 
    required: true 
},
  status: { 
    type: String, 
    required: true 
  }, // active, past_due, canceled, etc.
  currentPeriodStart: { 
    type: Date 
  },
  currentPeriodEnd: { type: Date },
  price: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Price" // reference to Price document
  }
}, { timestamps: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
