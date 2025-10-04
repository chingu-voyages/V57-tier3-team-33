import { FailedOperation, FormattedPullRequest, FormattedReview, RepoWithPRs, RepoWithReviewsAndErrors } from "./formatted.types";

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    owner: GitHubUser;
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

export interface GitHubUser {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    user_view_type: string,
    site_admin: boolean
}

export interface GitHubPullRequest {
    id: number;
    number: number;
    state: 'open' | 'closed';
    title: string;
    body: string | null;
    user: GitHubUser | null;
    html_url: string;
    requested_reviewers: GitHubUser[] | [];
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    head: {
        repo: GitHubRepo,
        ref: string;
        sha: string;
    };
    base: {
        ref: string;
        sha: string;
    };
    last_review: GitHubReview | null;
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
    user: GitHubUser | null;
    body: string | null;
    state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING' | 'DISMISSED';
    html_url: string;
    pull_request_url: string;
    submitted_at: string | null;
    commit_id: string;
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


export interface ReviewStatistics {
    success_count: number;
    failure_count: number;
    total_attempts: number;
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