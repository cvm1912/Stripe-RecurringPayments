import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String 
  },
  stripeCustomerId: { 
    type: String 
  }, 

  profileImage: {   // ✅ profile picture yahan
    type: String
  }, 

  address:{
    line1: { 
      type: String 
    },

    city: { 
      type: String 
    },
    state: { 
      type: String 
    },
    postal_code: { 
      type: String 
    },

    country: { 
      type: String 
    }
  }, 

  preferredLocales: [{ type: String }],
  paymentMethodId: { type: String }
});

export const User = mongoose.model("User", userSchema);
