import { useMemo, useState } from "react";

type OptionId =
  | "YouTube"
  | "Instagram - Smeed AI"
  | "Instagram - Other"
  | "Facebook"
  | "ChatGPT / AI"
  | "Friend / Colleague"
  | "Reddit"
  | "Google Search"
  | "Other";

function LogoYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.01 3.01 0 0 0-2.118-2.13C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.38.556A3.01 3.01 0 0 0 .502 6.186 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .502 5.814 3.01 3.01 0 0 0 2.118 2.13C4.495 20.5 12 20.5 12 20.5s7.505 0 9.38-.556a3.01 3.01 0 0 0 2.118-2.13A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.502-5.814Z"
      />
      <path fill="#fff" d="M9.75 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function LogoInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#E1306C"
        d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6A5.2 5.2 0 0 1 16.8 22H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 1.8A3.4 3.4 0 0 0 3.8 7.2v9.6A3.4 3.4 0 0 0 7.2 20.2h9.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.4H7.2Z"
      />
      <path
        fill="#E1306C"
        d="M12 7.1A4.9 4.9 0 1 1 7.1 12 4.9 4.9 0 0 1 12 7.1Zm0 1.8A3.1 3.1 0 1 0 15.1 12 3.1 3.1 0 0 0 12 8.9Zm5.7-2.2a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z"
      />
    </svg>
  );
}

function LogoFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.405 18.627 0 12 0S0 5.405 0 12.07C0 18.1 4.388 23.09 10.125 24v-8.437H7.078V12.07h3.047V9.414c0-3.03 1.792-4.707 4.533-4.707 1.313 0 2.686.235 2.686.235v2.97H15.83c-1.49 0-1.954.93-1.954 1.885v2.273h3.328l-.532 3.492h-2.796V24C19.612 23.09 24 18.1 24 12.07Z"
      />
      <path
        fill="#fff"
        d="M16.672 15.562 17.204 12.07h-3.328V9.797c0-.955.464-1.885 1.954-1.885h1.514v-2.97s-1.373-.235-2.686-.235c-2.741 0-4.533 1.676-4.533 4.707v2.656H7.078v3.492h3.047V24c.62.1 1.26.153 1.875.153.615 0 1.255-.053 1.875-.153v-8.437h2.797Z"
      />
    </svg>
  );
}

function LogoReddit() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#FF4500"
        d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12Z"
      />
      <path
        fill="#fff"
        d="M18.49 12.53c.2-.42.32-.88.32-1.37a2.4 2.4 0 0 0-2.4-2.4c-.74 0-1.4.34-1.84.88-1.02-.64-2.36-1.05-3.86-1.12l.72-3.38 2.35.5a1.6 1.6 0 1 0 .18-.86l-2.93-.62a.5.5 0 0 0-.59.38l-.88 4.12c-1.54.06-2.91.47-3.95 1.12A2.38 2.38 0 0 0 4.59 8.77a2.4 2.4 0 0 0-2.4 2.4c0 .49.12.95.32 1.37-.07.23-.11.47-.11.72 0 3.23 4.17 5.86 9.2 5.86s9.2-2.63 9.2-5.86c0-.25-.04-.49-.11-.72Zm-10.2 1.54a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm6.6 3.06c-.9.9-2.63 1.02-3.3 1.02s-2.4-.12-3.3-1.02a.5.5 0 1 1 .7-.7c.55.55 1.86.73 2.6.73s2.05-.18 2.6-.73a.5.5 0 1 1 .7.7Zm.82-3.06a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
      />
    </svg>
  );
}

function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.42c-.23 1.22-1.41 3.58-5.42 3.58A6.33 6.33 0 0 1 12 5.02c1.8 0 3.01.77 3.7 1.43l2.52-2.42C16.6 2.5 14.53 1.5 12 1.5A10.5 10.5 0 1 0 12 22.5c6.04 0 10.02-4.25 10.02-10.23 0-.7-.08-1.23-.18-1.77H12Z"
      />
      <path fill="#34A853" d="M3.92 7.28l3.2 2.35A6.33 6.33 0 0 1 12 5.02c1.8 0 3.01.77 3.7 1.43l2.52-2.42C16.6 2.5 14.53 1.5 12 1.5c-4.03 0-7.54 2.33-9.2 5.78Z" opacity=".001" />
      <path fill="#FBBC05" d="M1.5 12c0 1.72.41 3.34 1.13 4.78l3.49-2.71A6.35 6.35 0 0 1 5.67 12c0-.72.12-1.41.33-2.06L2.63 7.22A10.46 10.46 0 0 0 1.5 12Z" />
      <path fill="#34A853" d="M12 22.5c2.92 0 5.38-.96 7.17-2.62l-3.3-2.56c-.9.63-2.08 1.06-3.87 1.06a6.33 6.33 0 0 1-5.99-4.36l-3.5 2.7A10.5 10.5 0 0 0 12 22.5Z" />
      <path fill="#4285F4" d="M22.02 12.27c0-.7-.08-1.23-.18-1.77H12v3.9h5.42c-.11.6-.44 1.5-1.19 2.2l.01-.01 3.3 2.56c1.92-1.77 3.48-4.38 3.48-6.88Z" />
    </svg>
  );
}

function LogoChatGPT() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#10A37F"
        d="M12 2.1a4.4 4.4 0 0 1 4.14 2.88 4.4 4.4 0 0 1 5.11 5.85A4.4 4.4 0 0 1 19.7 17.8 4.4 4.4 0 0 1 12 21.9a4.4 4.4 0 0 1-7.7-4.1 4.4 4.4 0 0 1-1.55-6.97A4.4 4.4 0 0 1 7.86 4.98 4.4 4.4 0 0 1 12 2.1Zm0 2c-.83 0-1.6.3-2.2.78.3.11.6.26.88.43l1.32.77 1.32-.77c.28-.17.58-.32.88-.43-.6-.48-1.37-.78-2.2-.78Zm-3.91 2.3a2.4 2.4 0 0 0-3.36 2.84c.22-.25.48-.49.77-.7l1.32-.77v-1.52c0-.33.04-.65.11-.95-.29.25-.55.54-.76.9Zm7.82 0c-.21-.36-.47-.65-.76-.9.07.3.11.62.11.95v1.52l1.32.77c.29.21.55.45.77.7a2.4 2.4 0 0 0-1.44-3.04ZM8.6 9.12 12 11.1l3.4-1.98-3.4-1.98-3.4 1.98Zm-1.9 1.1-1.32.77a2.4 2.4 0 0 0 1.44 4.36c.03-.33.1-.66.22-.97l.66-1.46V10.2Zm10.6 0v2.72l.66 1.46c.12.31.19.64.22.97a2.4 2.4 0 0 0 1.44-4.36l-1.32-.77ZM8.1 14.9l-1.32.77c-.28.17-.58.32-.88.43.6.48 1.37.78 2.2.78.83 0 1.6-.3 2.2-.78-.3-.11-.6-.26-.88-.43l-1.32-.77Zm7.8 0-1.32.77c-.28.17-.58.32-.88.43.6.48 1.37.78 2.2.78.83 0 1.6-.3 2.2-.78-.3-.11-.6-.26-.88-.43l-1.32-.77Z"
      />
    </svg>
  );
}

function LogoPeople() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4F46E5"
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm0 2c-3.04 0-5.5 1.79-5.5 4v1h11v-1c0-2.21-2.46-4-5.5-4Zm8 0c-.35 0-.7.03-1.03.08 1.74.79 2.93 2.18 2.93 3.92v1h6v-1c0-2.21-2.46-4-5.9-4Z"
      />
    </svg>
  );
}

function LogoDots() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#64748B"
        d="M6 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
      />
    </svg>
  );
}

export function DiscoveryOverlayModal(props: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { source: string; otherText?: string }) => Promise<void>;
}) {
  const { open, onClose, onSubmit } = props;
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [otherText, setOtherText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const options = useMemo(
    () =>
      [
        { id: "YouTube", icon: <LogoYouTube />, label: "YouTube" },
        {
          id: "Instagram - Smeed AI",
          icon: <LogoInstagram />,
          label: "Instagram - Smeed AI",
        },
        {
          id: "Instagram - Other",
          icon: <LogoInstagram />,
          label: "Instagram - Other",
        },
        { id: "Facebook", icon: <LogoFacebook />, label: "Facebook" },
        { id: "ChatGPT / AI", icon: <LogoChatGPT />, label: "ChatGPT / AI" },
        { id: "Friend / Colleague", icon: <LogoPeople />, label: "Friend / Colleague" },
        { id: "Reddit", icon: <LogoReddit />, label: "Reddit" },
        { id: "Google Search", icon: <LogoGoogle />, label: "Google Search" },
        { id: "Other", icon: <LogoDots />, label: "Other" },
      ] as const,
    [],
  );

  if (!open) return null;

  const needsOther = selected === "Other";
  const canContinue =
    !!selected && (!needsOther || otherText.trim().length >= 2) && !busy;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
      <div className="relative w-[92vw] max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="w-9" />
            <h2 className="text-lg font-bold text-gray-900 text-center">
              How did you discover Smeed AI?
            </h2>
            <button
              type="button"
              onClick={() => {
                if (busy) return;
                onClose();
              }}
              className="p-2 -m-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
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

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {options.map((o) => {
              const active = selected === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setError("");
                    setSelected(o.id);
                    if (o.id !== "Other") setOtherText("");
                  }}
                  className={[
                    "h-11 px-3.5 rounded-xl border text-left flex items-center gap-3 transition",
                    active
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      active ? "bg-white border border-indigo-200" : "bg-gray-100",
                    ].join(" ")}
                    aria-hidden
                  >
                    {o.icon}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-gray-900">
                    {o.label}
                  </span>
                  {active && (
                    <span
                      className="h-5 w-5 rounded-full bg-indigo-200 text-indigo-900 flex items-center justify-center text-xs font-bold"
                      aria-hidden
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {needsOther && (
            <div className="mt-4">
              <input
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Where did you find us?"
                className="w-full h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={!canContinue}
            onClick={async () => {
              if (!selected) return;
              if (selected === "Other" && otherText.trim().length < 2) return;
              setBusy(true);
              setError("");
              try {
                await onSubmit({
                  source: selected,
                  otherText: selected === "Other" ? otherText.trim() : undefined,
                });
                onClose();
              } catch (e: unknown) {
                const msg =
                  e && typeof e === "object" && "response" in e
                    ? (e as { response?: { data?: { message?: string } } })
                        .response?.data?.message
                    : "Could not save response";
                setError(msg || "Could not save response");
              } finally {
                setBusy(false);
              }
            }}
            className="mt-5 w-full h-11 rounded-xl bg-indigo-900 text-white font-semibold hover:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

