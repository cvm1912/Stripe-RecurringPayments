import { User } from "../models/user.js";
import stripe from "../configs/stripeClient.js";

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE STRIPE CUSTOMER
export const createStripeCustomer = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already exists → return existing
    if (user.stripeCustomerId) {
      return res.status(200).json({
        success: true,
        message: "Stripe customer already exists",
        data: {
          stripeCustomerId: user.stripeCustomerId,
        },
      });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user._id.toString(),
      },
    });

    user.stripeCustomerId = customer.id;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Stripe customer created successfully",
      data: {
        userId: user._id,
        stripeCustomerId: customer.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStripeCustomer = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.stripeCustomerId) {
      return res.status(404).json({
        success: false,
        message: "Stripe customer not found",
      });
    }

    const customer = await stripe.customers.retrieve(user.stripeCustomerId);

    return res.status(200).json({
      success: true,
      message: "Stripe customer retrieved successfully",
      data: {
        userId: user._id,
        stripeCustomerId: customer.id,
        customer,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

console.log("hello");