import { Request, Response } from "express";
import { 
  getPullRequestReviews,
  getRepoReviews, 
  getAllReviewsForUser,
  getReviewsByUser
} from "../services/github.reviews";
import { ReviewState, GitHubError } from "../types/github.types";


export async function getPRReviews(req: Request, res: Response) {
  try {
    const { username, repo, pullNumber } = req.params;
    const { 
      state = 'all', 
      per_page = '30', 
      page = '1' 
    } = req.query;

    // Validate state parameter
    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';
    
    // Validate pagination parameters
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
    let reviews = await getPullRequestReviews(username, repo, pullNum, options);
    
    // Filter by state if not 'all'
    if (reviewState !== 'all') {
      reviews = reviews.filter(review => review.state === reviewState);
    }
    
    res.status(200).json({
      success: true,
      data: {
        repo,
        pull_request_number: pullNum,
        reviews
      },
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_reviews: reviews.length
      },
      filters: {
        state: reviewState,
        username,
        repo,
        pull_request_number: pullNum
      }
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

    // Validate state parameter
    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';
    
    // Validate pagination parameters
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const reviewsWithErrors = await getRepoReviews(username, repo, reviewState, options);
    
    res.status(200).json({
      success: true,
      data: {
        repo,
        reviews: reviewsWithErrors.reviews
      },
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_reviews: reviewsWithErrors.reviews.length
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

    // Validate state parameter
    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';
    
    // Validate pagination parameters
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 10, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const reposWithReviewsAndErrors = await getAllReviewsForUser(username, reviewState, options);
    
    // Calculate totals across all repositories
    const totalReviews = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.reviews.length, 0);
    const totalSuccessCount = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.success_count, 0);
    const totalFailureCount = reposWithReviewsAndErrors.reduce((sum, repo) => sum + repo.failure_count, 0);
    const allFailedOperations = reposWithReviewsAndErrors.flatMap(repo => repo.failed_operations);
    
    res.status(200).json({
      success: true,
      data: reposWithReviewsAndErrors,
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_repos: reposWithReviewsAndErrors.length,
        total_reviews: totalReviews
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

    // Validate state parameter
    const validStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'PENDING', 'DISMISSED', 'all'];
    const reviewState = validStates.includes(state as ReviewState) ? state as ReviewState : 'all';
    
    // Validate pagination parameters
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const reviewsWithErrors = await getReviewsByUser(reviewer, reviewState, options);
    
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
      failed_operations: reviewsWithErrors.failed_operations
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
    
    if (repo) {
      // Get reviews for specific repository
      const reviewsWithErrors = await getRepoReviews(username, repo as string, 'all');
      allReviews = reviewsWithErrors.reviews;
      totalSuccessCount = reviewsWithErrors.success_count;
      totalFailureCount = reviewsWithErrors.failure_count;
      allFailedOperations = reviewsWithErrors.failed_operations;
    } else {
      // Get reviews across all user repositories
      const repoReviews = await getAllReviewsForUser(username, 'all');
      allReviews = repoReviews.flatMap(r => r.reviews);
      totalSuccessCount = repoReviews.reduce((sum, repo) => sum + repo.success_count, 0);
      totalFailureCount = repoReviews.reduce((sum, repo) => sum + repo.failure_count, 0);
      allFailedOperations = repoReviews.flatMap(repo => repo.failed_operations);
    }

    // Calculate statistics
    const stats = {
      total_reviews: allReviews.length,
      approved: allReviews.filter(r => r.state === 'APPROVED').length,
      changes_requested: allReviews.filter(r => r.state === 'CHANGES_REQUESTED').length,
      commented: allReviews.filter(r => r.state === 'COMMENTED').length,
      pending: allReviews.filter(r => r.state === 'PENDING').length,
      dismissed: allReviews.filter(r => r.state === 'DISMISSED').length
    };

    res.status(200).json({
      success: true,
      data: {
        username,
        ...(repo && { repo }),
        statistics: stats,
        operation_stats: {
          success_count: totalSuccessCount,
          failure_count: totalFailureCount,
          total_attempts: totalSuccessCount + totalFailureCount
        },
        failed_operations: allFailedOperations
      }
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