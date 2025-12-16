import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  stripeSubscriptionId: String,
  priceId: String,
  status: String,
  currentPeriodEnd: Date
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
