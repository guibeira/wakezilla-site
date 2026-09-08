import { StrictMode } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LifecycleDiagram } from './LifecycleDiagram';

function mockMotionPreference(reduced: boolean) {
  const events = new EventTarget();
  const query = {
    matches: reduced,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => query),
  );
  return { query, events };
}

function advancePhase() {
  act(() => vi.advanceTimersToNextTimer());
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  mockMotionPreference(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Continuous lifecycle demo', () => {
  it('automatically completes and repeats the full request and response cycle', () => {
    render(<LifecycleDiagram />);
    for (let cycle = 0; cycle < 2; cycle++) {
      expect(screen.getByRole('status')).toHaveTextContent('Sleeping');
      for (const label of [
        'Request received',
        'Checking the service',
        'Waking up',
        'Forwarding the request',
        'Returning the response',
        'Idle timer running',
        'Time to rest',
        'Sleeping',
      ]) {
        advancePhase();
        expect(screen.getByRole('status')).toHaveTextContent(label);
      }
      expect(vi.getTimerCount()).toBe(1);
      expect(
        screen.getByRole('button', { name: 'Pause demo' }),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole('button', { name: /send.*request/i }),
    ).not.toBeInTheDocument();
  });

  it('resets the scenario and continues playing automatically', () => {
    render(<LifecycleDiagram />);
    advancePhase();
    advancePhase();
    fireEvent.click(
      screen.getByRole('button', { name: 'Local AI', pressed: false }),
    );
    expect(
      screen.getByRole('button', { name: 'Local AI', pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('article', { name: 'GPU workstation: Sleeping' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Port 11434')).toBeInTheDocument();
    expect(screen.getByText('POST /api/chat')).toBeInTheDocument();
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
    fireEvent.click(screen.getByRole('button', { name: 'Game server' }));
    expect(screen.getByText('Minecraft')).toBeInTheDocument();
    expect(screen.getByText('TCP CONNECT')).toBeInTheDocument();
    expect(screen.queryByText('200 OK')).not.toBeInTheDocument();
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
  });

  it('pauses and resumes the current phase', () => {
    render(<LifecycleDiagram />);
    advancePhase();
    fireEvent.click(screen.getByRole('button', { name: 'Pause demo' }));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Play demo' }));
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Checking the service',
    );
  });

  it('keeps the user pause when selecting another scenario', () => {
    render(<LifecycleDiagram />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Local AI' }));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Sleeping');
    expect(
      screen.getByRole('button', { name: 'Play demo' }),
    ).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('advances with Next without changing the play or pause setting', () => {
    render(<LifecycleDiagram />);
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Checking the service',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pause demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByRole('status')).toHaveTextContent('Waking up');
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Waking up');
    expect(
      screen.getByRole('button', { name: 'Play demo' }),
    ).toBeInTheDocument();
  });

  it('also advances automatically with reduced motion while retaining both controls', () => {
    mockMotionPreference(true);
    render(<LifecycleDiagram />);
    expect(
      screen.getByRole('button', { name: 'Pause demo' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next step' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reduced motion: animations off/i),
    ).toBeInTheDocument();
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
    fireEvent.click(screen.getByRole('button', { name: 'Pause demo' }));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
  });

  it('retains playback when the motion preference changes', () => {
    const { query, events } = mockMotionPreference(false);
    render(<LifecycleDiagram />);
    advancePhase();
    act(() => {
      query.matches = true;
      events.dispatchEvent(new Event('change'));
    });
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Checking the service',
    );
    expect(
      screen.getByText(/reduced motion: animations off/i),
    ).toBeInTheDocument();
  });

  it('suspends playback while the page is hidden and resumes on return', () => {
    render(<LifecycleDiagram />);
    advancePhase();
    act(() => {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Request received');
    act(() => {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    advancePhase();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Checking the service',
    );
  });

  it('cleans up timers under Strict Mode and on unmount', () => {
    const { unmount } = render(
      <StrictMode>
        <LifecycleDiagram />
      </StrictMode>,
    );
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
