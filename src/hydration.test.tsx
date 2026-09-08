import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { act, fireEvent, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { render } from './entry-server';

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  container?.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Homepage hydration', () => {
  it.each([false, true])(
    'preserves static HTML with reduced motion = %s and detects Windows after hydration',
    async (reducedMotion) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(() => new Promise<Response>(() => {})),
      );
      vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
          matches: reducedMotion,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      );
      const errors = vi.fn();
      container = document.createElement('div');
      container.innerHTML = render();
      document.body.appendChild(container);
      const originalHeading = container.querySelector('h1');
      expect(container.textContent).toContain('curl -fsSL');

      await act(async () => {
        root = hydrateRoot(
          container!,
          <StrictMode>
            <App />
          </StrictMode>,
          { onRecoverableError: errors },
        );
      });

      expect(container.querySelector('h1')).toBe(originalHeading);
      expect(errors).not.toHaveBeenCalled();
      expect(container.textContent).toContain(
        'irm https://wakezilla.dev/install.ps1 | iex',
      );
      const page = within(container);
      expect(Boolean(page.queryByText(/reduced motion: animations off/i))).toBe(
        reducedMotion,
      );
      fireEvent.click(page.getByRole('button', { name: 'Pause demo' }));
      expect(
        page.getByRole('button', { name: 'Play demo' }),
      ).toBeInTheDocument();
      fireEvent.click(page.getByRole('button', { name: 'Next step' }));
      expect(page.getByRole('status')).toHaveTextContent('Request received');
    },
  );
});
