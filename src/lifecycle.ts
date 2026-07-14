export const LIFECYCLE_PHASES = [
  'sleeping',
  'request',
  'checking',
  'waking',
  'forwarding',
  'responding',
  'idle',
  'shutdown',
] as const;

export type LifecyclePhase = (typeof LIFECYCLE_PHASES)[number];

export function nextLifecyclePhase(phase: LifecyclePhase): LifecyclePhase {
  const currentIndex = LIFECYCLE_PHASES.indexOf(phase);
  const nextIndex = (currentIndex + 1) % LIFECYCLE_PHASES.length;

  return LIFECYCLE_PHASES[nextIndex];
}

export function handleLifecycleRequest(phase: LifecyclePhase): LifecyclePhase {
  return phase === 'idle' ? 'forwarding' : 'request';
}
