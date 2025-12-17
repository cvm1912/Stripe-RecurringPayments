import express from 'express'
const router = express.Router()
import { createSubscription, getSubscriptions, createCheckoutSession } from '../controllers/subscriptionController.js'

router.post('/create-subscription', createSubscription);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/get-subscriptions', getSubscriptions);

export default router;