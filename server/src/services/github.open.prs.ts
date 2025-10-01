import { Octokit } from "octokit";
import {
  GitHubRepo,
  GitHubPullRequest,
  FormattedPullRequest,
  RepoWithPRs,
  PRState,
  GitHubServiceOptions,
  GitHubError
} from "../types/github.types";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Maximum number of repositories to process for pull requests and reviews.
 * This limit helps improve performance and reduces API rate limiting issues.
 * Processing is limited to the first 200 repositories sorted by most recently updated.
 */
const MAX_REPOSITORIES_TO_PROCESS = 200;

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
    const limitedCount = Math.min(actualCount, MAX_REPOSITORIES_TO_PROCESS);
    
    console.log(`User ${username} has ${actualCount} public repos, returning ${limitedCount} (limited to ${MAX_REPOSITORIES_TO_PROCESS})`);
    
    return limitedCount;
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

async function getUserRepos(
  username: string, 
  options: GitHubServiceOptions = {}
): Promise<GitHubRepo[]> {
  try {
    const { perPage = 100, page = 1 } = options;
    const allRepos: GitHubRepo[] = [];
    let currentPage = page;
    let stopDueToRateLimit = false;
    
    while (allRepos.length < MAX_REPOSITORIES_TO_PROCESS) {
      try {
        const response = await octokit.request("GET /users/{username}/repos", {
          username,
          per_page: Math.min(perPage, MAX_REPOSITORIES_TO_PROCESS - allRepos.length),
          page: currentPage,
          sort: "updated",
          direction: "desc"
        });
        
        const repos = response.data as GitHubRepo[];
        
        if (repos.length === 0) {
          break;
        }
        
        allRepos.push(...repos);
        
        if (repos.length < perPage) {
          break;
        }
        
        currentPage++;
      } catch (err: any) {
        if (isRateLimitError(err)) {
          console.warn(`Rate limit encountered while fetching repos for ${username}. Retrying once, then ending loop.`);
          await sleep(1000);
          try {
            const retryResponse = await octokit.request("GET /users/{username}/repos", {
              username,
              per_page: Math.min(perPage, MAX_REPOSITORIES_TO_PROCESS - allRepos.length),
              page: currentPage,
              sort: "updated",
              direction: "desc"
            });
            const retryRepos = retryResponse.data as GitHubRepo[];
            allRepos.push(...retryRepos);
          } catch (retryErr: any) {
            console.warn(`Retry after rate limit failed for ${username}:`, retryErr?.message || retryErr);
          }
          stopDueToRateLimit = true;
          break;
        } else {
          throw err;
        }
      }
    }
    
    const limitedRepos = allRepos.slice(0, MAX_REPOSITORIES_TO_PROCESS);
    console.log(`Fetched ${limitedRepos.length} repositories (limited to ${MAX_REPOSITORIES_TO_PROCESS}) for user ${username}${stopDueToRateLimit ? ' - stopped due to rate limit' : ''}`);
    
    return limitedRepos;
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
    const repos = await getUserRepos(username, options);
    console.log("repos size", repos.length);
    
    const limitedRepos = repos.slice(0, MAX_REPOSITORIES_TO_PROCESS);
    console.log("Processing limited repos:", limitedRepos.length, "out of", repos.length);
    
    const allPRs: RepoWithPRs[] = [];
    
    const batchSize = 5;
    let stopDueToRateLimit = false;
    for (let i = 0; i < limitedRepos.length; i += batchSize) {
      const batch = limitedRepos.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (repo) => {
        try {
          const prs = await getRepoPRs(username, repo.name, state, options);
          return prs.length > 0 ? { repo: repo.name, pullRequests: prs } : null;
        } catch (error) {
          if (isRateLimitError(error)) {
            console.warn(`Rate limit encountered on repo ${repo.name}. Retrying once, then stopping further processing.`);
            await sleep(1000);
            try {
              const prs = await getRepoPRs(username, repo.name, state, options);
              stopDueToRateLimit = true;
              return prs.length > 0 ? { repo: repo.name, pullRequests: prs } : null;
            } catch (retryErr) {
              stopDueToRateLimit = true;
              console.warn(`Retry failed for repo ${repo.name}:`, (retryErr as any)?.message || retryErr);
              return null;
            }
          }
          console.warn(`Failed to fetch PRs for ${repo.name}:`, (error as any)?.message || error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter((result): result is RepoWithPRs => result !== null);
      allPRs.push(...validResults);
      
      if (i + batchSize < limitedRepos.length && !stopDueToRateLimit) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (stopDueToRateLimit) {
        console.warn("Stopping PR aggregation due to rate limit after one retry attempt.");
        break;
      }
    }
    
    return allPRs;
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching ${state} pull requests for user ${username}`,
      status: error.status
    };
    
    console.error(`Error fetching all PRs for user ${username}:`, githubError);
    throw githubError;
  }
}

// this code here is not necessary, we can just use getRepoPRs with state = "open"
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

export { 
  getUserRepos, 
  getUserRepoCount,
  getRepoPRs,
  getAllPRsForUser,
  getOpenRepoPrs,
  getAllOpenPRsForUser,
  getGitHubRateLimit
};
