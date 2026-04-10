type TopLoaderListener = (activeRequests: number) => void;

let activeRequests = 0;
const listeners = new Set<TopLoaderListener>();

export function topLoaderSubscribe(listener: TopLoaderListener) {
  listeners.add(listener);
  listener(activeRequests);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const l of listeners) l(activeRequests);
}

export function topLoaderStart() {
  activeRequests += 1;
  emit();
}

export function topLoaderStop() {
  activeRequests = Math.max(0, activeRequests - 1);
  emit();
}

