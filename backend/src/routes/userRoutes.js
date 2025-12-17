import express from 'express'
const router = express.Router()
import {createUser, createStripeCustomer, getStripeCustomer} from '../controllers/userController.js'

router.post('/create-user',createUser);
router.post('/create-stripe-customer', createStripeCustomer);
router.get('/get-stripe-customer/:id', getStripeCustomer);

export default router;

