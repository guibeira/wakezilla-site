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

describe('App lifecycle explanation', () => {
  it('explains the complete request, response, idle, and shutdown cycle', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /let your servers sleep\./i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('GET /media').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RESPONSE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('200 OK').length).toBeGreaterThan(0);
    expect(screen.getByText(/new connections reset the timer/i)).toBeInTheDocument();
    expect(screen.getByText(/after your configured idle period.*power down/i)).toBeInTheDocument();
    expect(screen.getAllByText(/60 minutes/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^N min$/i)).not.toBeInTheDocument();
  });

  it('keeps every lifecycle stage understandable without animation', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    for (const stage of [
      'A request is all it takes.',
      'A clear path to your server.',
      'The answer finds its way back.',
      'Nothing to do? Time to rest.',
    ]) {
      expect(screen.getAllByText(stage).length).toBeGreaterThan(0);
    }

    expect(
      screen.getByRole('button', { name: /next step/i }),
    ).toBeInTheDocument();
  });

  it('uses the approved content order without implementation-language marketing', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent ?? '');
    const expectedHeadings = [
      'Why keep it running?',
      'From the first request to a well-earned rest.',
      'Everything in its right place.',
      'Big ideas. Smaller running hours.',
      'Your homelab can take it from here.',
      'Open source, by design',
      'Let your server sleep.',
    ];

    const headingPositions = expectedHeadings.map((heading) => headings.indexOf(heading));
    expect(headingPositions.every((position) => position >= 0)).toBe(true);
    expect(headingPositions).toEqual([...headingPositions].sort((a, b) => a - b));
    expect(screen.queryByText('Rust')).not.toBeInTheDocument();
    expect(screen.queryByText(/built for performance/i)).not.toBeInTheDocument();
  });

  it('shows the real Wakezilla dashboard instead of a fictional settings panel', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(
      screen.getByRole('img', { name: /wakezilla dashboard.*machine status and configured services/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/actual Wakezilla web interface/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/actual product/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/example machine settings/i)).not.toBeInTheDocument();
  });
});

describe('App documentation links', () => {
  it('links navigation and documentation calls to /docs/', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs/');
    expect(screen.getByRole('link', { name: /read the setup guide/i })).toHaveAttribute(
      'href',
      '/docs/',
    );

    const documentationLinks = screen.getAllByRole('link', { name: 'Documentation' });
    expect(documentationLinks).not.toHaveLength(0);
    documentationLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/docs/');
    });
  });
});
