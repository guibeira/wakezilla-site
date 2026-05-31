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

    const repoLinks = await screen.findAllByRole('link', { name: /GitHub repository, 1,234 stars/i });
    expect(
      repoLinks.some((link) => link.getAttribute('href') === 'https://github.com/guibeira/wakezilla'),
    ).toBe(true);

    const heroRepoLink = screen.getByRole('link', {
      name: /View on GitHub repository, 1,234 stars/i,
    });
    expect(heroRepoLink).toHaveAttribute('href', 'https://github.com/guibeira/wakezilla');
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

  it('keeps the full hero GitHub CTA copy visible at all breakpoints', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const ctaCopy = screen.getByText('View on GitHub');
    expect(ctaCopy).not.toHaveClass('hidden');
    expect(ctaCopy.closest('a')).toHaveAttribute('href', 'https://github.com/guibeira/wakezilla');
  });

  it('keeps GitHub links visible and shows a fallback when the star fetch fails', async () => {
    const fetchError = new Error('Network unavailable');
    const fetchMock = vi.fn(async () => {
      throw fetchError;
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findByText('Unavailable')).toBeInTheDocument();

    const repoLinks = screen.getAllByRole('link', { name: /GitHub repository, stars unavailable/i });
    expect(
      repoLinks.some((link) => link.getAttribute('href') === 'https://github.com/guibeira/wakezilla'),
    ).toBe(true);
    expect(
      screen.getByRole('link', { name: /View on GitHub repository, stars unavailable/i }),
    ).toHaveAttribute('href', 'https://github.com/guibeira/wakezilla');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load GitHub stars:', fetchError);
  });
});
