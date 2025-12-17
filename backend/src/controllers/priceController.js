import {Price} from "../models/price.js"
import {Product} from "../models/products.js"
import stripe from "../configs/stripeClient.js";

export const productPrice = async (req,res)=>{
    try{
    const {productId, unitAmount, currency, interval, intervalCount} = req.body

    if(!productId || !unitAmount || !currency || !interval || !intervalCount){
        return res.status(400).json({message: "All fields are required"})
    }

    const product = await Product.findById(productId);

    if(!product){
        return res.status(400).json({message: "Product not found"})
    }

    //   3️⃣ Create price in Stripe

    const productprice = await stripe.prices.create({
        product: product.stripeProductId,
        unit_amount: unitAmount,
        currency: currency,
        recurring: {
          interval: interval,
          interval_count: intervalCount,
        },
        billing_scheme: "per_unit",
      });

      //   save in database  
      const price = await Price.create({
        stripePriceId: productprice.id,
        stripeProductId: product.stripeProductId,
        unitAmount: unitAmount,
        currency: currency,
        interval: interval,
        intervalCount: intervalCount,
        product: productId,
      });

      return res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: {
        priceId: price._id,
        stripePriceId: price.stripePriceId,
        unitAmount: price.unitAmount,
        currency: price.currency,
        interval: price.interval,
        intervalCount: price.intervalCount,
        product: {
          id: product._id,
          name: product.name,
        },
      },
    })

}catch(error){
    console.error(error);
    return res.status(500).json({message: "Internal server error"})
}

}

export const getallproductprice = async(req,res) =>{
  try{
    const prices = await Price.find({}).populate("product");

    return res.status(200).json({
      success: true,
      message: "All prices retrieved successfully",
      data: prices
    })

  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}