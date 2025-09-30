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

const octokit = new Octokit();


  // Get user repositories with proper error handling and typing
 
async function getUserRepos(
  username: string, 
  options: GitHubServiceOptions = {}
): Promise<GitHubRepo[]> {
  try {
    const { perPage = 30, page = 1 } = options;
    
    const response = await octokit.request("GET /users/{username}/repos", {
      username,
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc"
    });
    
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


  // Get pull requests for a specific repository with configurable state
 
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


  // Get all pull requests for a user across all their repositories
 
async function getAllPRsForUser(
  username: string, 
  state: PRState = "open",
  options: GitHubServiceOptions = {}
): Promise<RepoWithPRs[]> {
  try {
    const repos = await getUserRepos(username, options);
    const allPRs: RepoWithPRs[] = [];
    
    // Process repositories in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (repo) => {
        try {
          const prs = await getRepoPRs(username, repo.name, state, options);
          return prs.length > 0 ? { repo: repo.name, pullRequests: prs } : null;
        } catch (error) {
          
          console.warn(`Failed to fetch PRs for ${repo.name}:`, error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter((result): result is RepoWithPRs => result !== null);
      allPRs.push(...validResults);
      
      // Small delay between batches 
      if (i + batchSize < repos.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
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

export { 
  getUserRepos, 
  getRepoPRs,
  getAllPRsForUser,
  getOpenRepoPrs,
  getAllOpenPRsForUser
};
