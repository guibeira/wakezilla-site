import { describe, expect, it } from 'vitest';
import {
  LIFECYCLE_PHASES,
  handleLifecycleRequest,
  nextLifecyclePhase,
} from './lifecycle';

describe('Wakezilla lifecycle', () => {
  it('returns the response before waiting for idle shutdown', () => {
    expect(LIFECYCLE_PHASES).toEqual([
      'sleeping',
      'request',
      'checking',
      'waking',
      'forwarding',
      'responding',
      'idle',
      'shutdown',
    ]);

    expect(nextLifecyclePhase('forwarding')).toBe('responding');
    expect(nextLifecyclePhase('responding')).toBe('idle');
    expect(nextLifecyclePhase('idle')).toBe('shutdown');
    expect(nextLifecyclePhase('shutdown')).toBe('sleeping');
  });

  it('forwards a new request immediately while the server is in the idle window', () => {
    const forwardingPhase = handleLifecycleRequest('idle');

    expect(forwardingPhase).toBe('forwarding');
    expect(nextLifecyclePhase(forwardingPhase)).toBe('responding');
    expect(nextLifecyclePhase('responding')).toBe('idle');
  });

  it('starts the wake sequence when a request arrives while the server sleeps', () => {
    expect(handleLifecycleRequest('sleeping')).toBe('request');
  });
});
