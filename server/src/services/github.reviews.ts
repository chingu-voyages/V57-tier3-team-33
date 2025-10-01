import { Octokit } from "octokit";
import {
  GitHubReview,
  FormattedReview,
  RepoWithReviews,
  ReviewState,
  GitHubServiceOptions,
  GitHubError,
  GitHubRepo,
  GitHubPullRequest,
  FailedOperation,
  ReviewsWithErrors,
  RepoWithReviewsAndErrors
} from "../types/github.types";

const octokit = new Octokit();

/**
 * Maximum number of repositories to process for pull requests and reviews.
 * This limit helps improve performance and reduces API rate limiting issues.
 * Processing is limited to the first 200 repositories sorted by most recently updated.
 */
const MAX_REPOSITORIES_TO_PROCESS = 200;

// Utility: small delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility: detect GitHub API rate limit errors
function isRateLimitError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  const headers = error?.response?.headers || {};
  const remaining = headers['x-ratelimit-remaining'] ?? headers['X-RateLimit-Remaining'];
  const message: string = (error?.message || '').toLowerCase();
  return status === 403 && (remaining === '0' || message.includes('rate limit') || message.includes('quota exhausted'));
}

/**
 * Get reviews for a specific pull request
 */
async function getPullRequestReviews(
  owner: string,
  repo: string,
  pullNumber: number,
  options: GitHubServiceOptions = {}
): Promise<FormattedReview[]> {
  try {
    const { perPage = 30, page = 1 } = options;
    let response;
    try {
      response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
        owner,
        repo,
        pull_number: pullNumber,
        per_page: perPage,
        page
      });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on PR reviews ${owner}/${repo}#${pullNumber}. Retrying once.`);
        await sleep(1000);
        response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
          owner,
          repo,
          pull_number: pullNumber,
          per_page: perPage,
          page
        });
      } else {
        throw err;
      }
    }
    
    return response.data.map((review: any) => ({
      id: review.id,
      reviewer: review.user?.login,
      body: review.body,
      state: review.state as ReviewState,
      url: review.html_url,
      pull_request_number: pullNumber,
      repo,
      submitted_at: review.submitted_at,
      commit_id: review.commit_id
    }));
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching reviews for PR #${pullNumber} in ${owner}/${repo}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    
    console.error(`Error fetching reviews for PR #${pullNumber} in ${owner}/${repo}:`, githubError);
    throw githubError;
  }
}

/**
 * Get all reviews for a specific repository with optional state filtering
 */
async function getRepoReviews(
  owner: string,
  repo: string,
  state: ReviewState = "all",
  options: GitHubServiceOptions = {}
): Promise<ReviewsWithErrors> {
  try {
    const { perPage = 30, page = 1 } = options;
    
    // First get all pull requests for the repository
    let prsResponse;
    try {
      prsResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner,
        repo,
        state: "all", 
        per_page: perPage,
        page,
        sort: "updated",
        direction: "desc"
      });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on PR list for ${owner}/${repo}. Retrying once.`);
        await sleep(1000);
        prsResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
          owner,
          repo,
          state: "all", 
          per_page: perPage,
          page,
          sort: "updated",
          direction: "desc"
        });
      } else {
        throw err;
      }
    }
    
    const allReviews: FormattedReview[] = [];
    const failedOperations: FailedOperation[] = [];
    let successCount = 0;
    
    // Process PRs in batches to avoid rate limiting
    const batchSize = 5;
    const prs = prsResponse.data;
    let stopDueToRateLimit = false;
    
    for (let i = 0; i < prs.length; i += batchSize) {
      const batch = prs.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (pr: any) => {
        try {
          const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
          successCount++;
          return { success: true, reviews, prNumber: pr.number };
        } catch (error: any) {
          if (isRateLimitError(error)) {
            console.warn(`Rate limit on PR reviews for ${owner}/${repo} PR #${pr.number}. Retrying once, then stopping.`);
            await sleep(1000);
            try {
              const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
              successCount++;
              stopDueToRateLimit = true;
              return { success: true, reviews, prNumber: pr.number };
            } catch (retryErr: any) {
              stopDueToRateLimit = true;
              const failedOp: FailedOperation = {
                type: 'pull_request',
                identifier: `PR #${pr.number}`,
                reason: retryErr.message || `Failed to fetch reviews for PR #${pr.number} after retry`,
                error_code: retryErr.status,
                details: retryErr.documentation_url
              };
              failedOperations.push(failedOp);
              return { success: false, reviews: [], prNumber: pr.number };
            }
          }
          const failedOp: FailedOperation = {
            type: 'pull_request',
            identifier: `PR #${pr.number}`,
            reason: error.message || `Failed to fetch reviews for PR #${pr.number}`,
            error_code: error.status,
            details: error.documentation_url
          };
          failedOperations.push(failedOp);
          console.warn(`Failed to fetch reviews for PR #${pr.number} in ${repo}:`, error);
          return { success: false, reviews: [], prNumber: pr.number };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const successfulResults = batchResults.filter((result: any) => result.success);
      const flatResults = successfulResults.flatMap((result: any) => result.reviews);
      allReviews.push(...flatResults);
      
      // Small delay between batches
      if (i + batchSize < prs.length && !stopDueToRateLimit) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (stopDueToRateLimit) {
        console.warn("Stopping repo review aggregation due to rate limit after one retry attempt.");
        break;
      }
    }
    
    // Filter by state if not 'all'
    const filteredReviews = state !== "all" 
      ? allReviews.filter(review => review.state === state)
      : allReviews;
    
    return {
      reviews: filteredReviews,
      failed_operations: failedOperations,
      success_count: successCount,
      failure_count: failedOperations.length
    };
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching reviews for repository ${owner}/${repo}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    
    console.error(`Error fetching reviews for repository ${owner}/${repo}:`, githubError);
    throw githubError;
  }
}

/**
 * Get all reviews for a user across all their repositories
 */
async function getAllReviewsForUser(
  username: string,
  state: ReviewState = "all",
  options: GitHubServiceOptions = {}
): Promise<RepoWithReviewsAndErrors[]> {
  try {
    // Get user repositories
    let reposResponse;
    try {
      reposResponse = await octokit.request("GET /users/{username}/repos", {
        username,
        per_page: options.perPage || 30,
        page: options.page || 1,
        sort: "updated",
        direction: "desc"
      });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit fetching repos for reviews: ${username}. Retrying once.`);
        await sleep(1000);
        reposResponse = await octokit.request("GET /users/{username}/repos", {
          username,
          per_page: options.perPage || 30,
          page: options.page || 1,
          sort: "updated",
          direction: "desc"
        });
      } else {
        throw err;
      }
    }
    
    const repos = reposResponse.data as GitHubRepo[];
    
    // Limit to first MAX_REPOSITORIES_TO_PROCESS repositories to improve performance and reduce API calls
    const limitedRepos = repos.slice(0, MAX_REPOSITORIES_TO_PROCESS);
    console.log("Processing limited repos for reviews:", limitedRepos.length, "out of", repos.length);
    
    const allReviews: RepoWithReviewsAndErrors[] = [];
    const globalFailedOperations: FailedOperation[] = [];
    
    // Process repositories in batches to avoid rate limiting
    const batchSize = 3; // Smaller batch size since we're making multiple API calls per repo
    let stopDueToRateLimit = false;
    
    for (let i = 0; i < limitedRepos.length; i += batchSize) {
      const batch = limitedRepos.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (repo) => {
        try {
          const reviewsWithErrors = await getRepoReviews(username, repo.name, state, options);
          
          if (reviewsWithErrors.reviews.length > 0 || reviewsWithErrors.failed_operations.length > 0) {
            return {
              repo: repo.name,
              reviews: reviewsWithErrors.reviews,
              failed_operations: reviewsWithErrors.failed_operations,
              success_count: reviewsWithErrors.success_count,
              failure_count: reviewsWithErrors.failure_count
            };
          }
          return null;
        } catch (error: any) {
          if (isRateLimitError(error)) {
            console.warn(`Rate limit on repo ${repo.name} while aggregating user reviews. Retrying once, then stopping.`);
            await sleep(1000);
            try {
              const reviewsWithErrors = await getRepoReviews(username, repo.name, state, options);
              stopDueToRateLimit = true;
              return {
                repo: repo.name,
                reviews: reviewsWithErrors.reviews,
                failed_operations: reviewsWithErrors.failed_operations,
                success_count: reviewsWithErrors.success_count,
                failure_count: reviewsWithErrors.failure_count
              };
            } catch (retryErr: any) {
              stopDueToRateLimit = true;
              const failedOp: FailedOperation = {
                type: 'repository',
                identifier: repo.name,
                reason: retryErr.message || `Failed to fetch reviews for repository ${repo.name} after retry`,
                error_code: retryErr.status,
                details: retryErr.documentation_url
              };
              globalFailedOperations.push(failedOp);
              return {
                repo: repo.name,
                reviews: [],
                failed_operations: [failedOp],
                success_count: 0,
                failure_count: 1
              };
            }
          }
          const failedOp: FailedOperation = {
            type: 'repository',
            identifier: repo.name,
            reason: error.message || `Failed to fetch reviews for repository ${repo.name}`,
            error_code: error.status,
            details: error.documentation_url
          };
          globalFailedOperations.push(failedOp);
          console.warn(`Failed to fetch reviews for repository ${repo.name}:`, error);
          return {
            repo: repo.name,
            reviews: [],
            failed_operations: [failedOp],
            success_count: 0,
            failure_count: 1
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter((result): result is RepoWithReviewsAndErrors => result !== null);
      allReviews.push(...validResults);
      
      // Longer delay between batches due to multiple API calls
      if (i + batchSize < limitedRepos.length && !stopDueToRateLimit) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      if (stopDueToRateLimit) {
        console.warn("Stopping user review aggregation due to rate limit after one retry attempt.");
        break;
      }
    }
    
    return allReviews;
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching reviews for user ${username}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    
    console.error(`Error fetching all reviews for user ${username}:`, githubError);
    throw githubError;
  }
}

/**
 * Get reviews by a specific user (reviews they have submitted)
 */
async function getReviewsByUser(
  reviewer: string,
  state: ReviewState = "all",
  options: GitHubServiceOptions = {}
): Promise<ReviewsWithErrors> {
  try {
    // This is a more complex query that would require searching across repositories
    // For now, we'll implement a basic version that searches recent activity
    // Limit the search results to respect the MAX_REPOSITORIES_TO_PROCESS limit
    const searchQuery = `type:pr+reviewed-by:${reviewer}`;
    let response;
    try {
      response = await octokit.request("GET /search/issues", {
        q: searchQuery,
        sort: "updated",
        order: "desc",
        per_page: Math.min(options.perPage || 30, MAX_REPOSITORIES_TO_PROCESS),
        page: options.page || 1
      });
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`Rate limit on search issues for reviewer ${reviewer}. Retrying once.`);
        await sleep(1000);
        response = await octokit.request("GET /search/issues", {
          q: searchQuery,
          sort: "updated",
          order: "desc",
          per_page: Math.min(options.perPage || 30, MAX_REPOSITORIES_TO_PROCESS),
          page: options.page || 1
        });
      } else {
        throw err;
      }
    }
    
    const allReviews: FormattedReview[] = [];
    const failedOperations: FailedOperation[] = [];
    let successCount = 0;
    
    // Limit the number of PRs processed to respect the repository limit
    const limitedPRs = response.data.items.slice(0, MAX_REPOSITORIES_TO_PROCESS);
    console.log(`Processing ${limitedPRs.length} PRs (limited to ${MAX_REPOSITORIES_TO_PROCESS}) for reviewer ${reviewer}`);
    // Process each PR to get the actual reviews
    const batchSize = 5;
    let stopDueToRateLimit = false;
    
    for (let i = 0; i < limitedPRs.length; i += batchSize) {
      const batch = limitedPRs.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (pr: any) => {
        try {
          const [owner, repo] = pr.repository_url.split('/').slice(-2);
          const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
          
          // Filter to only reviews by the specified user
          const userReviews = reviews.filter(review => review.reviewer === reviewer);
          successCount++;
          return userReviews;
        } catch (error: any) {
          if (isRateLimitError(error)) {
            console.warn(`Rate limit on reviewer reviews for PR #${pr.number}. Retrying once, then stopping.`);
            await sleep(1000);
            try {
              const [owner, repo] = pr.repository_url.split('/').slice(-2);
              const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
              const userReviews = reviews.filter(review => review.reviewer === reviewer);
              successCount++;
              stopDueToRateLimit = true;
              return userReviews;
            } catch (retryErr: any) {
              stopDueToRateLimit = true;
              const failedOp: FailedOperation = {
                type: 'pull_request',
                identifier: `PR #${pr.number}`,
                reason: retryErr.message || `Failed to fetch reviews for PR #${pr.number} after retry`,
                error_code: retryErr.status,
                details: retryErr.documentation_url
              };
              failedOperations.push(failedOp);
              return [];
            }
          }
          const failedOp: FailedOperation = {
            type: 'pull_request',
            identifier: `PR #${pr.number}`,
            reason: error.message || `Failed to fetch reviews for PR #${pr.number}`,
            error_code: error.status,
            details: error.documentation_url
          };
          failedOperations.push(failedOp);
          console.warn(`Failed to fetch reviews for PR #${pr.number}:`, error);
          return [];
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const flatResults = batchResults.flat();
      allReviews.push(...flatResults);
      
      // Small delay between batches
      if (i + batchSize < limitedPRs.length && !stopDueToRateLimit) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (stopDueToRateLimit) {
        console.warn("Stopping reviewer-based aggregation due to rate limit after one retry attempt.");
        break;
      }
    }
    
    // Filter by state if not 'all'
    const filteredReviews = state !== "all" 
      ? allReviews.filter(review => review.state === state)
      : allReviews;
    
    return {
      reviews: filteredReviews,
      failed_operations: failedOperations,
      success_count: successCount,
      failure_count: failedOperations.length
    };
  } catch (error: any) {
    const githubError: GitHubError = {
      message: error.message || `Error fetching reviews by user ${reviewer}`,
      status: error.status,
      documentation_url: error.response?.data?.documentation_url
    };
    
    console.error(`Error fetching reviews by user ${reviewer}:`, githubError);
    throw githubError;
  }
}

export {
  getPullRequestReviews,
  getRepoReviews,
  getAllReviewsForUser,
  getReviewsByUser
};