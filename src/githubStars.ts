export const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/guibeira/wakezilla';

type GitHubRepositoryPayload = {
  stargazers_count?: unknown;
};

export function parseGitHubStarCount(payload: unknown): number {
  if (!payload || typeof payload !== 'object' || !('stargazers_count' in payload)) {
    throw new Error('GitHub response did not include stargazers_count');
  }

  const starCount = (payload as GitHubRepositoryPayload).stargazers_count;

  if (typeof starCount !== 'number' || !Number.isFinite(starCount) || starCount < 0) {
    throw new Error('GitHub response included an invalid stargazers_count');
  }

  return starCount;
}

export function formatGitHubStars(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

export async function fetchGitHubStars(fetcher: typeof fetch = fetch): Promise<number> {
  const response = await fetcher(GITHUB_REPOSITORY_API_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub stars request failed with ${response.status}`);
  }

  return parseGitHubStarCount(await response.json());
}
