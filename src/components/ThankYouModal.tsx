export function ThankYouModal(props: { open: boolean }) {
  if (!props.open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
      <div className="relative pointer-events-none w-[92vw] max-w-sm rounded-2xl bg-white border border-indigo-200 shadow-2xl ring-2 ring-indigo-200 px-6 py-5 text-center">
        <div className="text-lg font-bold text-slate-100">Thank you!</div>
        <div className="mt-1 text-sm text-slate-400">
          Continue using Smeed AI.
        </div>
      </div>
    </div>
  );
}

