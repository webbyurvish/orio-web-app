import { useEffect, useState } from "react";
import type { CheckoutProduct } from "../billing/plans";
import {
  createStripeCheckoutSession,
  fetchStripeCheckoutOptions,
  stripeCheckoutErrorMessage,
  type StripeCheckoutOptions,
} from "../api/stripePayments";

type Props = {
  product: CheckoutProduct | null;
  billingTab: "credits" | "subscription";
  onClose: () => void;
};

export function PaymentCheckoutModal({
  product,
  billingTab,
  onClose,
}: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeCheckoutOpts, setStripeCheckoutOpts] =
    useState<StripeCheckoutOptions | null>(null);

  useEffect(() => {
    if (!product) return;
    setSubmitError(null);
    setStripeLoading(false);
    setStripeCheckoutOpts(null);
    void fetchStripeCheckoutOptions()
      .then(setStripeCheckoutOpts)
      .catch(() =>
        setStripeCheckoutOpts({
          checkoutCurrency: "USD",
          upiEnabled: false,
        }),
      );
  }, [product]);

  if (!product) return null;

  const handleStripeCheckout = async () => {
    setSubmitError(null);
    setStripeLoading(true);
    try {
      const url = await createStripeCheckoutSession(product.id, billingTab);
      window.location.assign(url);
    } catch (e) {
      setSubmitError(stripeCheckoutErrorMessage(e));
    } finally {
      setStripeLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitError(null);
    setStripeLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close checkout"
        onClick={handleClose}
      />
      <div
        className="relative z-[61] w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden max-h-[min(90vh,720px)] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div
          className="px-6 py-5 text-white shrink-0"
          style={{
            backgroundImage: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Checkout
              </p>
              <h2 id="checkout-title" className="text-lg font-bold mt-1">
                {product.title}
              </h2>
              <p className="text-sm text-white/90 mt-0.5">{product.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-lg text-white/90 hover:bg-white/10 shrink-0"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold">{product.amountInr}</span>
            <span className="text-sm text-white/85">{product.amountUsd}</span>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-3 py-2.5 text-xs text-indigo-950 space-y-1.5">
            <p className="font-semibold text-indigo-900">
              Pay with Stripe (test mode — no real charges)
            </p>
            {stripeCheckoutOpts?.upiEnabled ? (
              <p className="text-indigo-800/90">
                Checkout is in <strong>INR</strong> with <strong>card and UPI</strong>{" "}
                (Stripe shows UPI when your account and customer are eligible). Use
                Stripe test cards for cards, or complete a test UPI flow from the
                Stripe docs for your region.
              </p>
            ) : (
              <p className="text-indigo-800/90">
                Checkout opens on Stripe’s secure page. Use test card{" "}
                <span className="font-mono font-medium">4242 4242 4242 4242</span>
                , any future expiry, any CVC. Charges use{" "}
                <strong>{stripeCheckoutOpts?.checkoutCurrency ?? "USD"}</strong> as
                configured on the server (
                <span className="font-mono">Stripe:CheckoutCurrency</span>
                — set to <span className="font-mono">INR</span> to enable UPI).
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleStripeCheckout}
            disabled={stripeLoading}
            className="saas-btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {stripeLoading ? "Opening Stripe…" : "Continue to Stripe Checkout"}
          </button>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
