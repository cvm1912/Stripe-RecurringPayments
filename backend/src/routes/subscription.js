import express from 'express'
const router = express.Router()
import { createSubscription, getSubscriptions } from '../controllers/subscriptionController.js'

router.post('/create-subscription', createSubscription);
router.get('/get-subscriptions', getSubscriptions);

export default router;