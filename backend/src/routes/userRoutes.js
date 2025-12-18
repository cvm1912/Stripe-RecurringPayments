import express from 'express'
const router = express.Router()
import {userRegister,userlogin, updateProfile, getStripeCustomer} from '../controllers/userController.js'

router.post('/register-user',userRegister);
router.post('/login-user', userlogin);
router.put('/update-profile/:userId', updateProfile)
router.get('/get-stripe-customer/:id', getStripeCustomer);

export default router;

