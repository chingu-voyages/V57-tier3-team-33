import { FormattedReview, RepoWithReviewsAndErrors, ReviewState } from "../types/formatted.types";
import { 
  PRReviewResponseFormat,
  RepoReviewResponseFormat,
  UserReviewResponseFormat,
  ReviewStatsResponseFormat,
} from "../types/github.types";

/**
 * Formats the response for pull request reviews
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatPRReviewResponse(params: {
  repo: string;
  pullNumber: number;
  reviews: FormattedReview[];
  pageNum: number;
  perPage: number;
  reviewState: ReviewState | 'all';
  username: string;
}): PRReviewResponseFormat {
  const { repo, pullNumber, reviews, pageNum, perPage, reviewState, username } = params;
  
  // Calculate total pages based on reviews count
  const totalPages = Math.ceil(reviews.length / perPage);
  
  return {
    success: true,
    data: {
      repo,
      pull_request_number: pullNumber,
      reviews
    },
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: reviews.length
    },
    filters: {
      state: reviewState,
      username,
      repo,
      pull_request_number: pullNumber
    }
  };
}

/**
 * Formats the response for repository reviews
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatRepoReviewResponse(params: {
  repo: string;
  reviewsWithErrors: RepoWithReviewsAndErrors;
  pageNum: number;
  perPage: number;
  reviewState: ReviewState | 'all';
  username: string;
}): RepoReviewResponseFormat {
  const { repo, reviewsWithErrors, pageNum, perPage, reviewState, username } = params;
  
  // Calculate total pages based on reviews count
  const totalPages = Math.ceil(reviewsWithErrors.reviews.length / perPage);
  
  return {
    success: true,
    data: {
      repo,
      reviews: reviewsWithErrors.reviews
    },
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: reviewsWithErrors.reviews.length
    },
    filters: {
      state: reviewState,
      username,
      repo
    },
    statistics: {
      success_count: reviewsWithErrors.success_count,
      failure_count: reviewsWithErrors.failure_count,
      total_attempts: reviewsWithErrors.success_count + reviewsWithErrors.failure_count
    },
    failed_operations: reviewsWithErrors.failed_operations
  };
}

/**
 * Formats the response for user reviews across repositories
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatUserReviewResponse(params: {
  reposWithReviewsAndErrors: RepoWithReviewsAndErrors[];
  pageNum: number;
  perPage: number;
  reviewState: ReviewState | 'all';
  username: string;
}): UserReviewResponseFormat {
  const { reposWithReviewsAndErrors, pageNum, perPage, reviewState, username } = params;
  
  // Calculate totals across all repositories
  const totalReviews = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.reviews.length, 0);
  const totalSuccessCount = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.success_count, 0);
  const totalFailureCount = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.failure_count, 0);
  const allFailedOperations = reposWithReviewsAndErrors.flatMap(repo => repo.failed_operations);
  
  // Calculate total pages based on repositories count
  const totalPages = Math.ceil(reposWithReviewsAndErrors.length / perPage);
  
  return {
    success: true,
    data: reposWithReviewsAndErrors,
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: reposWithReviewsAndErrors.length
    },
    filters: {
      state: reviewState,
      username
    },
    statistics: {
      success_count: totalSuccessCount,
      failure_count: totalFailureCount,
      total_attempts: totalSuccessCount + totalFailureCount
    },
    failed_operations: allFailedOperations
  };
}

/**
 * Formats the response for review statistics
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatReviewStatsResponse(params: {
  username: string;
  repo: string;
  allReviews: FormattedReview[];
  totalSuccessCount: number;
  totalFailureCount: number;
  allFailedOperations: any[];
}): ReviewStatsResponseFormat {
  const { username, repo, allReviews, totalSuccessCount, totalFailureCount, allFailedOperations } = params;
  
  return {
    success: true,
    data: {
      username,
      ...(repo && { repo }),
      statistics: {
        total_reviews: allReviews.length,
        approved: allReviews.filter(r => r.state === 'APPROVED').length,
        changes_requested: allReviews.filter(r => r.state === 'CHANGES_REQUESTED').length,
        commented: allReviews.filter(r => r.state === 'COMMENTED').length,
        pending: allReviews.filter(r => r.state === 'PENDING').length,
        dismissed: allReviews.filter(r => r.state === 'DISMISSED').length
      },
      operation_stats: {
        success_count: totalSuccessCount,
        failure_count: totalFailureCount,
        total_attempts: totalSuccessCount + totalFailureCount
      },
      failed_operations: allFailedOperations
    }
  };
}