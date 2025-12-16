import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  stripePriceId: { 
    type: String, 
    required: true 
   }, // Stripe price ID (price_XXX)
 
   stripeProductId: { 
    type: String, 
    required: true
   }, // which product

  unitAmount: { 
    type: Number, 
    required: true 
   }, // e.g. 49900 for ₹499
  currency: { 
    type: String, 
    required: true 
  }, // e.g. "inr"
  
  interval: { 
    type: String, 
    required: true 
  }, // recurring interval e.g. "month"
  
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // reference to Product
    required: true
  },
});

export const Price = mongoose.model("Price", priceSchema);
