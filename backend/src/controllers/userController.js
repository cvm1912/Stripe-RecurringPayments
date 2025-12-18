import { User } from "../models/user.js";
import stripe from "../configs/stripeClient.js";
import { hashPassword, comparePassword } from "../utils/password.utils.js";


export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "name, email, password is required",
    });
  }

  // check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "user already exists",
    });
  }

  // hash the password
  const hashedPassword = await hashPassword(password);

  // create user in datbase 
  const user = await User.create({ name, email, password: hashedPassword });

  // create customer in stripe using the newly created user
  const customer = await stripe.customers.create({
    name: user.name,
    email: user.email,
    metadata: { userId: user._id.toString() }
  });

  // save stripe id into database on the instance and persist
  user.stripeCustomerId = customer.id;
  await user.save();

  return res.json({
    success: true,
    message: "user created successfully",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      stripeCustomerId: customer.id
    },
  });
};

export const userlogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email, password is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  return res.json({
    success: true,
    message: "user logged in successfully",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      stripeCustomerId: user.stripeCustomerId
    },
  });

};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      profileImage,
      address,
      preferredLocales,
      paymentMethodId
    } = req.body;

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    if (profileImage) user.profileImage = profileImage;
    if (address) user.address =  address;
    if (preferredLocales) user.preferredLocales =  preferredLocales;
    if (paymentMethodId) user.paymentMethodId =  paymentMethodId;

    await user.save();

    if (user.stripeCustomerId) {
      await stripe.customers.update(user.stripeCustomerId, {
        address: address ? {
          line1: address.line1,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country
        } : undefined,

        preferred_locales: user.preferredLocales,

        invoice_settings: user.paymentMethodId
          ? { default_payment_method: user.paymentMethodId }
          : undefined
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        address: user.address || null,
        paymentMethodId: user.paymentMethodId || null,
        preferredLocales: user.preferredLocales || null,
        invoice_settings: user.paymentMethodId
          ? { default_payment_method: user.paymentMethodId }
          : null
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const customerList = async (req,res) =>{
   const customers = await  stripe.customers.list()

   res.status(200).json({
    success: true,
    count: customers.data.length,
    data: customers.data,
  });

}

export const customer = async (req,res) =>{
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user || !user.stripeCustomerId) {
    return res.status(404).json({
      success: false,
      message: "Stripe customer not found for this user",
    });
  }

  const customer = await stripe.customers.retrieve(user.stripeCustomerId);
  return res.status(200).json({
    success: true,
    data: customer,
  });

}
