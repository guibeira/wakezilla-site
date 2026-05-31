import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('App GitHub stars', () => {
  it('renders the fetched GitHub star count', async () => {
    const fetchMock = vi.fn(async () => (
      new Response(JSON.stringify({ stargazers_count: 1234 }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    ));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findAllByText('1,234')).not.toHaveLength(0);
    expect(screen.getByText('GitHub Stars')).toBeInTheDocument();

    const repoLinks = screen.getAllByRole('link', { name: /GitHub repository, 1,234 stars/i });
    expect(
      repoLinks.some((link) => link.getAttribute('href') === 'https://github.com/guibeira/wakezilla'),
    ).toBe(true);
  });

  it('keeps GitHub links visible while stars are loading', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const repoLinks = screen.getAllByRole('link', { name: /GitHub repository, stars loading/i });
    expect(
      repoLinks.some((link) => link.getAttribute('href') === 'https://github.com/guibeira/wakezilla'),
    ).toBe(true);
  });
});
