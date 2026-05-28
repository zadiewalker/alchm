type CrisisEventListener = () => void;

const listeners: CrisisEventListener[] = [];

export function onCrisisModalRequest(listener: CrisisEventListener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };
}

export function requestCrisisModal(): void {
  for (const listener of listeners) {
    listener();
  }
}
