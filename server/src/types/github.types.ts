export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  state: 'open' | 'closed';
  title: string;
  body: string | null;
  user: {
    login: string;
    id: number;
  } | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
}

export interface FormattedPullRequest {
  repo: string;
  number: number;
  title: string;
  user: string | undefined;
  url: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  merged_at?: string | null;
}

export interface RepoWithPRs {
  repo: string;
  pullRequests: FormattedPullRequest[];
}

export type PRState = 'open' | 'closed' | 'all';

export interface GitHubServiceOptions {
  perPage?: number;
  page?: number;
}

export interface GitHubError {
  message: string;
  status?: number;
  documentation_url?: string;
}

export interface GitHubReview {
  id: number;
  user: {
    login: string;
    id: number;
  } | null;
  body: string | null;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING' | 'DISMISSED';
  html_url: string;
  pull_request_url: string;
  submitted_at: string | null;
  commit_id: string;
}

export interface FormattedReview {
  id: number;
  reviewer: string | undefined;
  body: string | null;
  state: ReviewState;
  url: string;
  pull_request_number: number;
  repo: string;
  submitted_at: string | null;
  commit_id: string;
}

export interface RepoWithReviews {
  repo: string;
  reviews: FormattedReview[];
}

export type ReviewState = 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING' | 'DISMISSED' | 'all';

export interface FailedOperation {
  type: 'pull_request' | 'repository' | 'user';
  identifier: string; 
  reason: string;
  error_code?: number;
  details?: string;
}

export interface ReviewsWithErrors {
  reviews: FormattedReview[];
  failed_operations: FailedOperation[];
  success_count: number;
  failure_count: number;
}

export interface RepoWithReviewsAndErrors {
  repo: string;
  reviews: FormattedReview[];
  failed_operations: FailedOperation[];
  success_count: number;
  failure_count: number;
}

// Response formatting interfaces
export interface Pagination {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface Filters {
  state: string;
  username: string;
}

export interface PullRequestResponseFormat {
  success: boolean;
  data: RepoWithPRs[];
  pagination: Pagination;
  filters: Filters;
}

// Review response formatting interfaces
export interface ReviewPagination {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface ReviewFilters {
  state: string;
  username: string;
  repo?: string;
  pull_request_number?: number;
}

export interface ReviewStatistics {
  success_count: number;
  failure_count: number;
  total_attempts: number;
}

export interface PRReviewResponseFormat {
  success: boolean;
  data: {
    repo: string;
    pull_request_number: number;
    reviews: FormattedReview[];
  };
  pagination: ReviewPagination;
  filters: ReviewFilters;
}

export interface RepoReviewResponseFormat {
  success: boolean;
  data: {
    repo: string;
    reviews: FormattedReview[];
  };
  pagination: ReviewPagination;
  filters: ReviewFilters;
  statistics: ReviewStatistics;
  failed_operations: FailedOperation[];
}

export interface UserReviewResponseFormat {
  success: boolean;
  data: RepoWithReviewsAndErrors[];
  pagination: ReviewPagination;
  filters: ReviewFilters;
  statistics: ReviewStatistics;
  failed_operations: FailedOperation[];
}

export interface ReviewStatsResponseFormat {
  success: boolean;
  data: {
    username: string;
    repo?: string;
    statistics: {
      total_reviews: number;
      approved: number;
      changes_requested: number;
      commented: number;
      pending: number;
      dismissed: number;
    };
    operation_stats: ReviewStatistics;
    failed_operations: FailedOperation[];
  };
}

// Repository PR Response Format
export interface RepoPRResponseFormat {
  success: boolean;
  data: {
    repo: string;
    pullRequests: FormattedPullRequest[];
  };
  pagination: Pagination;
  filters: {
    state: PRState;
    username: string;
    repo: string;
  };
}

// User Repositories Response Format
export interface UserRepositoriesResponseFormat {
  success: boolean;
  data: GitHubRepo[];
  pagination: Pagination;
  filters: {
    username: string;
  };
}