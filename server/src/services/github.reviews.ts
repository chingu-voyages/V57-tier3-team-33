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
    
    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: perPage,
      page
    });
    
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
    const prsResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner,
      repo,
      state: "all", 
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc"
    });
    
    const allReviews: FormattedReview[] = [];
    const failedOperations: FailedOperation[] = [];
    let successCount = 0;
    
    // Process PRs in batches to avoid rate limiting
    const batchSize = 5;
    const prs = prsResponse.data;
    
    for (let i = 0; i < prs.length; i += batchSize) {
      const batch = prs.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (pr: any) => {
        try {
          const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
          successCount++;
          return { success: true, reviews, prNumber: pr.number };
        } catch (error: any) {
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
      if (i + batchSize < prs.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
    const reposResponse = await octokit.request("GET /users/{username}/repos", {
      username,
      per_page: options.perPage || 30,
      page: options.page || 1,
      sort: "updated",
      direction: "desc"
    });
    
    const repos = reposResponse.data as GitHubRepo[];
    const allReviews: RepoWithReviewsAndErrors[] = [];
    const globalFailedOperations: FailedOperation[] = [];
    
    // Process repositories in batches to avoid rate limiting
    const batchSize = 3; // Smaller batch size since we're making multiple API calls per repo
    
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      
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
      if (i + batchSize < repos.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
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
    const searchQuery = `type:pr+reviewed-by:${reviewer}`;
    
    const response = await octokit.request("GET /search/issues", {
      q: searchQuery,
      sort: "updated",
      order: "desc",
      per_page: options.perPage || 30,
      page: options.page || 1
    });
    
    const allReviews: FormattedReview[] = [];
    const failedOperations: FailedOperation[] = [];
    let successCount = 0;
    
    // Process each PR to get the actual reviews
    const batchSize = 5;
    const prs = response.data.items;
    
    for (let i = 0; i < prs.length; i += batchSize) {
      const batch = prs.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (pr: any) => {
        try {
          const [owner, repo] = pr.repository_url.split('/').slice(-2);
          const reviews = await getPullRequestReviews(owner, repo, pr.number, options);
          
          // Filter to only reviews by the specified user
          const userReviews = reviews.filter(review => review.reviewer === reviewer);
          successCount++;
          return userReviews;
        } catch (error: any) {
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
      if (i + batchSize < prs.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
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