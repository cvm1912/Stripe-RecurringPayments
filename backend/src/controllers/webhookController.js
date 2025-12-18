import stripe from "../configs/stripeClient.js";
import { Subscription } from "../models/Subscription.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded:', invoice.id);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Payment failed:', failedInvoice.id);
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: updatedSubscription.id },
        { 
          status: updatedSubscription.status,
          currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000)
        }
      );
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: deletedSubscription.id },
        { status: 'canceled' }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};