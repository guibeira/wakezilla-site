import { describe, expect, it, vi } from 'vitest';
import {
  GITHUB_REPOSITORY_API_URL,
  fetchGitHubStars,
  formatGitHubStars,
  parseGitHubStarCount,
} from './githubStars';

describe('parseGitHubStarCount', () => {
  it('returns stargazers_count from a GitHub repository payload', () => {
    expect(parseGitHubStarCount({ stargazers_count: 123 })).toBe(123);
  });

  it('rejects payloads without a finite non-negative star count', () => {
    expect(() => parseGitHubStarCount({})).toThrow('stargazers_count');
    expect(() => parseGitHubStarCount({ stargazers_count: '123' })).toThrow('invalid');
    expect(() => parseGitHubStarCount({ stargazers_count: -1 })).toThrow('invalid');
    expect(() => parseGitHubStarCount({ stargazers_count: Number.NaN })).toThrow('invalid');
    expect(() => parseGitHubStarCount({ stargazers_count: Infinity })).toThrow('invalid');
  });
});

describe('formatGitHubStars', () => {
  it('formats the count with thousands separators', () => {
    expect(formatGitHubStars(1234)).toBe('1,234');
  });
});

describe('fetchGitHubStars', () => {
  it('fetches the Wakezilla repository and returns the star count', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ stargazers_count: 4321 }),
    }) as Response);

    await expect(fetchGitHubStars(fetchMock as unknown as typeof fetch)).resolves.toBe(4321);

    expect(fetchMock).toHaveBeenCalledWith(
      GITHUB_REPOSITORY_API_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }),
      }),
    );
  });

  it('throws when GitHub returns an unsuccessful response', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({}),
    }) as Response);

    await expect(fetchGitHubStars(fetchMock as unknown as typeof fetch)).rejects.toThrow(
      'GitHub stars request failed with 403',
    );
  });
});
