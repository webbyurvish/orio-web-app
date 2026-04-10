import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { submitFeedback } from "../api/feedback";

function IconChatBubble() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12a5 5 0 0 1-8 3.9L9 21v-3.5A5 5 0 1 1 21 12Z" />
    </svg>
  );
}

const thankYouAutoCloseMs = 2600;

export function FeedbackFab() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  const [formOpen, setFormOpen] = useState(false);
  const [thanksOpen, setThanksOpen] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeForm = useCallback(() => {
    if (submitting) return;
    setFormOpen(false);
    setError(null);
  }, [submitting]);

  useEffect(() => {
    if (!thanksOpen) return;
    const t = window.setTimeout(() => setThanksOpen(false), thankYouAutoCloseMs);
    return () => window.clearTimeout(t);
  }, [thanksOpen]);

  if (!isAuthenticated || !token) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormOpen(true);
          setError(null);
        }}
        className="fixed bottom-5 right-4 sm:right-6 z-[60] inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
        style={{
          backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        }}
        aria-haspopup="dialog"
        aria-expanded={formOpen}
      >
        <IconChatBubble />
        Feedback
      </button>

      {formOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeForm}
            aria-hidden
          />
          <div
            className="relative z-[71] w-full max-w-md rounded-3xl bg-white shadow-2xl border border-indigo-100/80 p-6 sm:p-7"
            role="dialog"
            aria-labelledby="feedback-dialog-title"
            aria-modal="true"
          >
            <h2
              id="feedback-dialog-title"
              className="text-xl font-bold text-gray-900"
            >
              Share your feedback
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              What&apos;s on your mind? Bug, feature request, anything.
            </p>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us what you think..."
              rows={5}
              disabled={submitting}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-y min-h-[120px] disabled:opacity-60"
            />

            {error ? (
              <p className="mt-2 text-sm text-rose-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || text.trim().length < 3}
                onClick={async () => {
                  const msg = text.trim();
                  if (msg.length < 3) return;
                  setSubmitting(true);
                  setError(null);
                  try {
                    await submitFeedback(msg);
                    setText("");
                    setFormOpen(false);
                    setThanksOpen(true);
                  } catch (err: unknown) {
                    const ax = err as {
                      response?: { data?: { message?: string } };
                    };
                    const apiMsg = ax.response?.data?.message;
                    setError(
                      typeof apiMsg === "string"
                        ? apiMsg
                        : "Could not send feedback. Please try again.",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-[1.02]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                }}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {thanksOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center px-4 pointer-events-none">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" />
          <div
            className="relative z-[76] pointer-events-auto w-[92vw] max-w-sm rounded-3xl bg-white border border-indigo-100 shadow-2xl px-6 py-8 text-center"
            role="alertdialog"
            aria-live="polite"
            aria-labelledby="feedback-thanks-title"
          >
            <div className="text-4xl mb-2" aria-hidden>
              🙏
            </div>
            <h3
              id="feedback-thanks-title"
              className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent"
            >
              Thank you!
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your feedback helps us improve Smeed AI.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
