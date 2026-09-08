// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from './entry-server';

afterEach(() => vi.unstubAllGlobals());

describe('Homepage pre-rendering', () => {
  it('renders real content without window, document or network calls', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    const html = render();
    expect(html).toContain('<h1');
    expect(html).toContain('Let your servers');
    expect(html).toContain('Wake-on-LAN proxy');
    expect(html).toContain('href="/docs/"');
    expect(html).toContain('https://wakezilla.dev/install.sh');
    expect(html).toContain('wakezilla-dashboard.webp');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('generates deterministic HTML for hydration', () => {
    expect(render()).toBe(render());
  });
});
