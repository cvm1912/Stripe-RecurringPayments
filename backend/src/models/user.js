import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
   password: {
    type: String,
    required: true
  },
  stripeCustomerId: String
});

const User = mongoose.model("User", userSchema);


