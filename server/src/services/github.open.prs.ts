import { Octokit } from "octokit";
import {
  GitHubRepo,
  PRState,
  GitHubServiceOptions,
  GitHubError
} from "../types/github.types";
import { FormattedPullRequest, RepoWithPRs } from "../types/formatted.types";
import { PullRequestDTO } from "../dtos/PullRequestDTO";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isRateLimitError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  const headers = error?.response?.headers || {};
  const remaining = headers['x-ratelimit-remaining'] ?? headers['X-RateLimit-Remaining'];
  const message: string = (error?.message || '').toLowerCase();
  return status === 403 && (remaining === '0' || message.includes('rate limit') || message.includes('quota exhausted'));
}

async function getUserRepoCount(username: string): Promise<number> {
  try {
    const response = await octokit.request("GET /users/{username}", {
      username
    });

    const actualCount = response.data.public_repos;
    console.log(`User ${username} has ${actualCount} public repos`);
    return actualCount;
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || "Error fetching user repository count",
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };

    console.error("Error fetching user repository count:", githubError);
    throw githubError;
  }
}

async function getUserType(username: string): Promise<string> {
  const response = await octokit.request("GET /users/{username}", { username });
  return (response.data as any)?.type || "User";
}

async function getOwnerRepos(
  owner: string,
  options: GitHubServiceOptions = {}
): Promise<GitHubRepo[]> {
  try {
    const { perPage = 30, page = 1 } = options;
    const accountType = await getUserType(owner);
    const isOrg = accountType === "Organization";

    let response: any;
    try {
      response = await octokit.request(isOrg ? "GET /orgs/{org}/repos" : "GET /users/{username}/repos", {
        org: isOrg ? owner : undefined,
        username: isOrg ? undefined : owner,
        per_page: perPage,
        page,
        sort: "updated",
        direction: "desc"
      } as any);
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit encountered while fetching repos for ${owner}. Retrying once.`);
        await sleep(1000);
        response = await octokit.request(isOrg ? "GET /orgs/{org}/repos" : "GET /users/{username}/repos", {
          org: isOrg ? owner : undefined,
          username: isOrg ? undefined : owner,
          per_page: perPage,
          page,
          sort: "updated",
          direction: "desc"
        } as any);
      } else {
        throw err;
      }
    }

    return response.data as GitHubRepo[];
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || "Error fetching repositories",
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    console.error("Error fetching repositories:", githubError);
    throw githubError;
  }
}

async function getRepoPRs(
  owner: string,
  repo: string,
  state: PRState = "open",
  options: GitHubServiceOptions = {}
): Promise<FormattedPullRequest[]> {
  try {
    const { perPage = 30, page = 1 } = options;

    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner,
      repo,
      state,
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc"
    });

    return response.data.map((pr: any) => ({
      repo,
      number: pr.number,
      title: pr.title,
      user: pr.user?.login,
      url: pr.html_url,
      state: pr.state as 'open' | 'closed',
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      closed_at: pr.closed_at,
      merged_at: pr.merged_at,
    }));
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching ${state} pull requests for ${owner}/${repo}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };

    console.error(`Error fetching pull requests for ${owner}/${repo}:`, githubError);
    throw githubError;
  }
}

async function getAllPRsForUser(
  username: string,
  state: PRState = "open",
  options: GitHubServiceOptions = {}
): Promise<RepoWithPRs[]> {
  try {
    const { perPage = 30, page = 1 } = options;
    const accountType = await getUserType(username);
    const ownerQualifier = accountType === "Organization" ? `org:${username}` : `user:${username}`;
    const stateQualifier = state === "all" ? "" : state === "open" ? " is:open" : " is:closed";
    const q = `${ownerQualifier} is:pr${stateQualifier}`.trim();

    let response: any;
    try {
      response = await octokit.request("GET /search/issues", {
        q,
        sort: "updated",
        order: "desc",
        per_page: perPage,
        page
      });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on search issues for ${username}. Retrying once.`);
        await sleep(1000);
        response = await octokit.request("GET /search/issues", {
          q,
          sort: "updated",
          order: "desc",
          per_page: perPage,
          page
        });
      } else {
        throw err;
      }
    }

    const items = response.data.items || [];
    const formatted: FormattedPullRequest[] = items.map((item: any) => PullRequestDTO.fromGitHubSearchAPIToModel(item));

    const byRepo = new Map<string, FormattedPullRequest[]>();
    for (const pr of formatted) {
      if (!byRepo.has(pr.repo)) byRepo.set(pr.repo, []);
      byRepo.get(pr.repo)!.push(pr);
    }

    const grouped: RepoWithPRs[] = Array.from(byRepo.entries()).map(([repo, pullRequests]) => ({
      repo,
      pullRequests
    }));

    return grouped;
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching ${state} pull requests for user ${username}`,
      status: error.status
    };

    console.error(`Error fetching all PRs for user ${username}:`, githubError);
    throw githubError;
  }
}

const getOpenRepoPrs = (owner: string, repo: string, options?: GitHubServiceOptions) =>
  getRepoPRs(owner, repo, "open", options);

const getAllOpenPRsForUser = (username: string, options?: GitHubServiceOptions) =>
  getAllPRsForUser(username, "open", options);

async function getGitHubRateLimit(): Promise<{
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resetDate: string;
}> {
  try {
    const response = await octokit.request("GET /rate_limit");
    const rateLimit = response.data.rate;

    return {
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      reset: rateLimit.reset,
      used: rateLimit.used,
      resetDate: new Date(rateLimit.reset * 1000).toISOString()
    };
  } catch (error: any) {
    console.error("Error fetching GitHub rate limit:", error);
    return {
      limit: 5000,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + 3600,
      used: 5000,
      resetDate: new Date(Date.now() + 3600000).toISOString()
    };
  }
}

async function getTotalPRCountViaSearch(owner: string, state: PRState = "open"): Promise<number> {
  try {
    const accountType = await getUserType(owner);
    const ownerQualifier = accountType === "Organization" ? `org:${owner}` : `user:${owner}`;
    const stateQualifier = state === "all" ? "" : state === "open" ? " is:open" : " is:closed";
    const q = `${ownerQualifier} is:pr${stateQualifier}`.trim();

    let response;
    try {
      response = await octokit.request("GET /search/issues", { q, per_page: 1 });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on search issues for ${owner}. Retrying once.`);
        await sleep(1000);
        response = await octokit.request("GET /search/issues", { q, per_page: 1 });
      } else {
        throw err;
      }
    }

    const total = (response.data as any)?.total_count ?? 0;
    return total;
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching total PR count via search for ${owner}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    console.error(`Error fetching total PR count via search for ${owner}:`, githubError);
    throw githubError;
  }
}
export {
  getOwnerRepos,
  getUserRepoCount,
  getRepoPRs,
  getAllPRsForUser,
  getOpenRepoPrs,
  getAllOpenPRsForUser,
  getGitHubRateLimit,
  getTotalPRCountViaSearch,
};
