import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CheckoutProduct } from "../billing/plans";
import { processDummyPayment } from "../billing/dummyPaymentGateway";
import { useBillingStore } from "../store/billingStore";
import {
  createStripeCheckoutSession,
  fetchStripeCheckoutOptions,
  stripeCheckoutErrorMessage,
  type StripeCheckoutOptions,
} from "../api/stripePayments";

const formSchema = z.object({
  nameOnCard: z
    .string()
    .min(2, "Enter the name on the card")
    .max(80, "Name is too long"),
  cardNumber: z.string().min(1, "Card number is required"),
  expiry: z
    .string()
    .regex(
      /^\d{2}\s*\/\s*\d{2}$/,
      "Use MM / YY (e.g. 12 / 30)",
    ),
  cvc: z.string().regex(/^\d{3,4}$/, "3–4 digit security code"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  product: CheckoutProduct | null;
  billingTab: "credits" | "subscription" | "lifetime";
  onClose: () => void;
};

export function PaymentCheckoutModal({
  product,
  billingTab,
  onClose,
}: Props) {
  const applySuccessfulPurchase = useBillingStore(
    (s) => s.applySuccessfulPurchase,
  );
  const [step, setStep] = useState<"form" | "success">("form");
  const [txId, setTxId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [stripeCheckoutOpts, setStripeCheckoutOpts] =
    useState<StripeCheckoutOptions | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });

  useEffect(() => {
    if (!product) return;
    setStep("form");
    setTxId(null);
    setSubmitError(null);
    setStripeLoading(false);
    setShowDemo(false);
    setStripeCheckoutOpts(null);
    reset();
    void fetchStripeCheckoutOptions()
      .then(setStripeCheckoutOpts)
      .catch(() =>
        setStripeCheckoutOpts({
          checkoutCurrency: "USD",
          upiEnabled: false,
        }),
      );
  }, [product, reset]);

  if (!product) return null;

  const onSubmitDemo = async (data: FormValues) => {
    setSubmitError(null);
    const digits = data.cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      setSubmitError("Enter a valid card number (13–19 digits).");
      return;
    }

    const result = await processDummyPayment({
      productId: product.id,
      cardNumberDigits: digits,
    });

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    applySuccessfulPurchase(product);
    setTxId(result.transactionId);
    setStep("success");
  };

  const handleStripeCheckout = async () => {
    setSubmitError(null);
    setStripeLoading(true);
    try {
      const url = await createStripeCheckoutSession(product.id, billingTab);
      window.location.assign(url);
    } catch (e) {
      setSubmitError(stripeCheckoutErrorMessage(e));
      setShowDemo(true);
    } finally {
      setStripeLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setTxId(null);
    setSubmitError(null);
    setStripeLoading(false);
    setShowDemo(false);
    reset();
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

        {step === "form" ? (
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

            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1"
            >
              {showDemo
                ? "Hide local demo checkout"
                : "Use local demo checkout (no Stripe)"}
            </button>

            {showDemo ? (
              <form
                onSubmit={handleSubmit(onSubmitDemo)}
                className="space-y-4 pt-2 border-t border-gray-100"
              >
                <p className="text-xs text-gray-500">
                  Simulated payment only — stays in the browser; use any
                  13–19 digit card.{" "}
                  <span className="font-mono">4000…</span> simulates decline.
                </p>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Name on card
                  </label>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    className="input-field text-sm"
                    placeholder="Jane Doe"
                    {...register("nameOnCard")}
                  />
                  {errors.nameOnCard && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.nameOnCard.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Card number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="input-field text-sm font-mono"
                    placeholder="4242 4242 4242 4242"
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      autoComplete="cc-exp"
                      className="input-field text-sm font-mono"
                      placeholder="12 / 30"
                      {...register("expiry")}
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.expiry.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className="input-field text-sm font-mono"
                      placeholder="123"
                      maxLength={4}
                      {...register("cvc")}
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.cvc.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-secondary text-sm py-3 disabled:opacity-60"
                >
                  {isSubmitting ? "Processing…" : "Pay now (demo)"}
                </button>
              </form>
            ) : null}
          </div>
        ) : (
          <div className="p-8 text-center space-y-4 flex-1 flex flex-col justify-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Payment successful
            </h3>
            <p className="text-sm text-gray-600">
              This was a simulated charge. No real money was taken.
            </p>
            {txId && (
              <p className="text-xs text-gray-500 font-mono break-all">
                Reference: {txId}
              </p>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="saas-btn-primary w-full justify-center py-3 text-sm mt-2"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
