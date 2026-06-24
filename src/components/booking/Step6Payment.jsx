import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

let stripePromise = null;

const getFunctionPayload = (result) => result?.data ?? result ?? {};

const getStripePromise = async () => {
  if (!stripePromise) {
    const res = await base44.functions.invoke('getStripePublishableKey', {});
    const payload = getFunctionPayload(res);
    if (!payload.publishableKey) {
      throw new Error('Stripe publishable key is missing.');
    }
    stripePromise = loadStripe(payload.publishableKey);
  }
  return stripePromise;
};

function PaymentForm({ onSuccess, onCancel, submitting, depositAmount }) {
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
          {paying || submitting ? 'Processing...' : `Pay $${depositAmount} Card Deposit & Book →`}
        </button>
      </div>
    </form>
  );
}

export default function Step6Payment({
  amount = 50,
  bookingData = {},
  clientName,
  clientEmail,
  serviceLabel,
  onSuccess,
  onCancel,
  submitting,
}) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedClientInfo = bookingData.clientInfo || {};
  const resolvedServiceKey = bookingData.serviceKey;
  const resolvedServiceLabel = serviceLabel || SERVICE_CONFIG[resolvedServiceKey]?.label || resolvedServiceKey || 'Clean Slate Club Visit';
  const resolvedClientName = clientName || resolvedClientInfo.name || '';
  const resolvedClientEmail = clientEmail || resolvedClientInfo.email || '';
  const depositAmount = Number(amount) || 50;

  useEffect(() => {
    let active = true;

    const setupPayment = async () => {
      setLoading(true);
      setError(null);
      try {
        const [res, stripeInstance] = await Promise.all([
          base44.functions.invoke('createDepositPaymentIntent', {
            data: {
              amount: depositAmount,
              clientName: resolvedClientName,
              clientEmail: resolvedClientEmail,
              serviceLabel: resolvedServiceLabel,
              bookingData,
            },
          }),
          getStripePromise(),
        ]);

        const payload = getFunctionPayload(res);
        if (!payload.clientSecret) {
          throw new Error('Stripe client secret is missing.');
        }

        if (active) {
          setClientSecret(payload.clientSecret);
          setStripe(stripeInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error('Deposit payment setup failed:', err);
        if (active) {
          setError('Could not load payment. Please try again.');
          setLoading(false);
        }
      }
    };

    setupPayment();
    return () => { active = false; };
  }, [depositAmount, resolvedClientName, resolvedClientEmail, resolvedServiceLabel]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin" />
        <p className="font-body text-sm text-charcoal/40 font-light">Setting up secure card payment...</p>
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
        A <strong>${depositAmount} card deposit</strong> holds your booking and is applied to your final balance. Your card also helps keep your appointment secure and makes checkout easier after your visit. No surprise charges, ever.
      </p>

      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-6" style={{ borderLeft: '3px solid #EB9486' }}>
        <p className="font-body text-xs text-charcoal/40 font-light mb-1">You're reserving</p>
        <p className="font-heading text-base font-semibold text-charcoal">{resolvedServiceLabel}</p>
        <p className="font-body text-sm text-charcoal/50 font-light mt-1">Deposit: <strong className="text-coral">${depositAmount}.00</strong> — applied to your balance</p>
        <p className="font-body text-xs text-charcoal/35 font-light mt-3">Deposit payments are card-only. Flexible payment options may be available later on your final checkout link.</p>
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
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} submitting={submitting} depositAmount={depositAmount} />
        </Elements>
      )}
    </div>
  );
}
