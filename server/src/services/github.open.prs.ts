import { Octokit } from "octokit";
import {
  PRState,
  GitHubServiceOptions,
  GitHubError
} from "../types/github.types";
import { FormattedPullRequest, RepoWithPRs } from "../types/formatted.types";
import { PullRequestDTO } from "../dtos/PullRequestDTO";
import { fetchLastReviewOfPullRequest } from "./github.repos";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isRateLimitError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  const headers = error?.response?.headers || {};
  const remaining = headers['x-ratelimit-remaining'] ?? headers['X-RateLimit-Remaining'];
  const message: string = (error?.message || '').toLowerCase();
  return status === 403 && (remaining === '0' || message.includes('rate limit') || message.includes('quota exhausted'));
}

async function getUserType(octokit: Octokit, username: string): Promise<string> {
  const response = await octokit.request("GET /users/{username}", { username });
  return (response.data as any)?.type || "User";
}

async function getAllPRsForUser(
  octokit: Octokit,
  username: string,
  state: PRState = "open",
  options: GitHubServiceOptions = {}
): Promise<RepoWithPRs[]> {
  try {
    const { perPage = 30, page = 1 } = options;
    const accountType = await getUserType(octokit, username);
    const ownerQualifier = accountType === "Organization" ? `org:${username}` : `user:${username}`;
    const stateQualifier = state === "all" ? "" : state === "open" ? " is:open" : " is:closed";
    const q = `is:pr${stateQualifier} author:${username}`.trim();

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

    const items = [];
    for (const pr of response.data.items) {
      const [owner, repo] = pr.repository_url?.split("/").slice(-2);
      const lastReview = await fetchLastReviewOfPullRequest(octokit, owner, repo, pr.number);
      pr.last_review = lastReview;
      items.push(pr);
    }

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

async function getGitHubRateLimit(octokit: Octokit): Promise<{
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

async function getTotalPRCountViaSearch(octokit: Octokit, username: string, state: PRState = "open"): Promise<number> {
  try {
    const accountType = await getUserType(octokit, username);
    const ownerQualifier = accountType === "Organization" ? `org:${username}` : `user:${username}`;
    const stateQualifier = state === "all" ? "" : state === "open" ? " is:open" : " is:closed";
    const q = `is:pr${stateQualifier} author:${username}`.trim();

    let response;
    try {
      response = await octokit.request("GET /search/issues", { q, per_page: 1 });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on search issues for ${username}. Retrying once.`);
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
      message: error.message || `Error fetching total PR count via search for ${username}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    console.error(`Error fetching total PR count via search for ${username}:`, githubError);
    throw githubError;
  }
}
export {
  getAllPRsForUser,
  getGitHubRateLimit,
  getTotalPRCountViaSearch,
};
