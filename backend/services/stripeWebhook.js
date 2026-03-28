const Subscription = require('../models/Subscription');

const handleStripeWebhook = async (event) => {
  const { type, data } = event;
  const object = data.object;

  switch (type) {
    case 'invoice.paid':
      // Subscription created or renewed
      const subId = object.subscription;
      const stripeSubId = typeof subId === 'string' ? subId : subId.id;
      
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: stripeSubId },
        {
          status: 'active',
          currentPeriodStart: new Date(object.period_start * 1000),
          currentPeriodEnd: new Date(object.period_end * 1000),
        }
      );
      break;

    case 'customer.subscription.deleted':
      // Subscription cancelled
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: object.id },
        { status: 'cancelled' }
      );
      break;

    case 'invoice.payment_failed':
      // Payment failure
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: object.subscription },
        { status: 'lapsed' }
      );
      break;

    case 'customer.subscription.updated':
      // Sync plan and status
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: object.id },
        {
          status: object.status,
          currentPeriodEnd: new Date(object.current_period_end * 1000),
          cancelAtPeriodEnd: object.cancel_at_period_end,
        }
      );
      break;

    default:
      console.log(`Unhandled Stripe event type: ${type}`);
  }
};

module.exports = { handleStripeWebhook };
