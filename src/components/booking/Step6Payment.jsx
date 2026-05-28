import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { base44 } from '@/api/base44Client';

let stripePromise = null;
const getStripePromise = async () => {
  if (!stripePromise) {
    const res = await base44.functions.invoke('getStripePublishableKey', {});
    stripePromise = loadStripe(res.data.publishableKey);
  }
  return stripePromise;
};

function PaymentForm({ onSuccess, onCancel, submitting }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setPaying(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment could not be completed. Please try again.');
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-body mb-4 text-center">{error}</p>
      )}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-taupe/10">
        <button
          type="button"
          onClick={onCancel}
          className="font-body text-sm text-charcoal/40 font-light hover:text-coral transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!stripe || paying || submitting}
          className="bg-coral text-white font-body text-sm tracking-wide px-10 py-3.5 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
        >
          {paying || submitting ? 'Processing...' : 'Pay $50 Deposit & Book →'}
        </button>
      </div>
    </form>
  );
}

export default function Step6Payment({ clientName, clientEmail, serviceLabel, onSuccess, onCancel, submitting }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.functions.invoke('createDepositPaymentIntent', { clientName, clientEmail, serviceLabel }),
      getStripePromise(),
    ]).then(([res, stripeInstance]) => {
      setClientSecret(res.data.clientSecret);
      setStripe(stripeInstance);
      setLoading(false);
    }).catch(() => {
      setError('Could not load payment. Please try again.');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin" />
        <p className="font-body text-sm text-charcoal/40 font-light">Setting up secure payment...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-red-500 font-body py-8">{error}</p>;
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Secure Your Spot</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-8">
        A <strong>$50 deposit</strong> holds your booking. It's applied to your total balance — no surprise charges, ever.
      </p>

      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-6" style={{ borderLeft: '3px solid #EB9486' }}>
        <p className="font-body text-xs text-charcoal/40 font-light mb-1">You're reserving</p>
        <p className="font-heading text-base font-semibold text-charcoal">{serviceLabel}</p>
        <p className="font-body text-sm text-charcoal/50 font-light mt-1">Deposit: <strong className="text-coral">$50.00</strong> — applied to your balance</p>
      </div>

      {clientSecret && stripe && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#EB9486',
                colorBackground: '#fdfcfb',
                colorText: '#333333',
                borderRadius: '12px',
                fontFamily: 'Lato, sans-serif',
              },
            },
          }}
        >
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} submitting={submitting} />
        </Elements>
      )}
    </div>
  );
}