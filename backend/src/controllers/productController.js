import { Product } from "../models/products.js";
import stripe from "../configs/stripeClient.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const stripeProduct = await stripe.products.create({
      name,
      description,
    });


    const product = await Product.create({
      name,
      description,
      stripeProductId: stripeProduct.id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        productId: product._id,
        name: product.name,
        stripeProductId: product.stripeProductId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};