import { Request, Response } from "express";
import {
  getPullRequestReviews,
  getRepoReviews,
  getAllReviewsForUser,
  getReviewsByUser
} from "../services/github.reviews";
import { getGitHubRateLimit } from "../services/github.open.prs";
import { GitHubError } from "../types/github.types";
import {
  formatPRReviewResponse,
  formatRepoReviewResponse,
  formatUserReviewResponse,
  formatReviewStatsResponse
} from "../utils/reviewFormatter";
import { ReviewState } from "../types/formatted.types";


export async function getPRReviews(req: Request, res: Response) {
  try {
    const { username, repo, pullNumber } = req.params;
    const {
      state = 'all',
      per_page = '30',
      page = '1'
    } = req.query;

    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';

    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);
    const pullNum = parseInt(pullNumber);

    if (isNaN(pullNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pull request number"
      });
    }

    const options = { perPage, page: pageNum };

    const [reviews, rateLimit] = await Promise.all([
      getPullRequestReviews(username, repo, pullNum, options),
      getGitHubRateLimit()
    ]);

    const filteredReviews = reviewState !== 'all'
      ? reviews.filter(review => review.state === reviewState)
      : reviews;

    const response = formatPRReviewResponse({
      repo,
      pullNumber: pullNum,
      reviews: filteredReviews,
      pageNum,
      perPage,
      reviewState,
      username
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit
    });
  } catch (error: any) {
    console.error("Error in getPRReviews:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching pull request reviews",
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getUserRepoReviews(req: Request, res: Response) {
  try {
    const { username, repo } = req.params;
    const {
      state = 'all',
      per_page = '30',
      page = '1'
    } = req.query;

    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';

    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [reviewsWithErrors, rateLimit] = await Promise.all([
      getRepoReviews(username, repo, reviewState, options),
      getGitHubRateLimit()
    ]);

    const repoWithReviewsAndErrors = {
      repo,
      ...reviewsWithErrors
    };

    const response = formatRepoReviewResponse({
      repo,
      reviewsWithErrors: repoWithReviewsAndErrors,
      pageNum,
      perPage,
      reviewState,
      username
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit
    });
  } catch (error: any) {
    console.error("Error in getUserRepoReviews:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching repository reviews",
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getUserReviews(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const {
      state = 'all',
      per_page = '10',
      page = '1'
    } = req.query;

    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';

    const perPage = Math.min(Math.max(parseInt(per_page as string) || 10, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [reposWithReviewsAndErrors, rateLimit] = await Promise.all([
      getAllReviewsForUser(username, reviewState, options),
      getGitHubRateLimit()
    ]);

    const response = formatUserReviewResponse({
      reposWithReviewsAndErrors,
      pageNum,
      perPage,
      reviewState,
      username
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit
    });
  } catch (error: any) {
    console.error("Error in getUserReviews:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching user reviews",
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getReviewsByReviewer(req: Request, res: Response) {
  try {
    const { reviewer } = req.params;
    const {
      state = 'all',
      per_page = '30',
      page = '1'
    } = req.query;

    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';

    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [reviewsWithErrors, rateLimit] = await Promise.all([
      getReviewsByUser(reviewer, reviewState, options),
      getGitHubRateLimit()
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviewer,
        reviews: reviewsWithErrors.reviews
      },
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_reviews: reviewsWithErrors.reviews.length
      },
      filters: {
        state: reviewState,
        reviewer
      },
      statistics: {
        success_count: reviewsWithErrors.success_count,
        failure_count: reviewsWithErrors.failure_count,
        total_attempts: reviewsWithErrors.success_count + reviewsWithErrors.failure_count
      },
      failed_operations: reviewsWithErrors.failed_operations,
      rate_limit: rateLimit
    });
  } catch (error: any) {
    console.error("Error in getReviewsByReviewer:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching reviews by reviewer",
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getReviewStats(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { repo } = req.query;

    let allReviews;
    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    let allFailedOperations: any[] = [];

    const rateLimit = await getGitHubRateLimit();

    if (repo) {
      const reviewsWithErrors = await getRepoReviews(username, repo as string, 'all');
      allReviews = reviewsWithErrors.reviews;
      totalSuccessCount = reviewsWithErrors.success_count;
      totalFailureCount = reviewsWithErrors.failure_count;
      allFailedOperations = reviewsWithErrors.failed_operations;
    } else {
      const repoReviews = await getAllReviewsForUser(username, 'all');
      allReviews = repoReviews.flatMap(r => r.reviews);
      totalSuccessCount = repoReviews.reduce((sum, repo) => sum + repo.success_count, 0);
      totalFailureCount = repoReviews.reduce((sum, repo) => sum + repo.failure_count, 0);
      allFailedOperations = repoReviews.flatMap(repo => repo.failed_operations);
    }

    const response = formatReviewStatsResponse({
      username,
      repo: repo as string,
      allReviews,
      totalSuccessCount,
      totalFailureCount,
      allFailedOperations
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit
    });
  } catch (error: any) {
    console.error("Error in getReviewStats:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching review statistics",
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}