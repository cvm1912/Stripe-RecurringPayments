import express from 'express';
import { handleStripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook endpoint - raw body needed for signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;