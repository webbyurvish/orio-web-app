function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export type DummyPaymentRequest = {
  productId: string;
  /** Card digits only */
  cardNumberDigits: string;
};

export type DummyPaymentResult =
  | { ok: true; transactionId: string }
  | { ok: false; error: string };

/**
 * Simulates a payment provider. Replace with Stripe/Razorpay etc. later.
 * Cards starting with 400000 are declined (Stripe-style test behavior).
 */
export async function processDummyPayment(
  req: DummyPaymentRequest,
): Promise<DummyPaymentResult> {
  await delay(800 + Math.random() * 700);

  if (req.cardNumberDigits.startsWith("400000")) {
    return {
      ok: false,
      error: "Your card was declined (demo). Try another card or use 4242…",
    };
  }

  if (req.cardNumberDigits.length < 13 || req.cardNumberDigits.length > 19) {
    return { ok: false, error: "Invalid card number." };
  }

  return {
    ok: true,
    transactionId: `demo_tx_${Date.now()}_${req.productId.slice(0, 8)}`,
  };
}
