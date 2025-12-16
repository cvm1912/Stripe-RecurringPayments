import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  description: { 
    type: String 
  },
  stripeProductId: { 
    type: String, 
    required: true
  }, // Stripe product ID (prod_XXX)
});

export const Product = mongoose.model("Product", productSchema);
