export type ReviewState = 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING' | 'DISMISSED' | 'all';

export interface FormattedRepo {
    id: number,
    name: string,
    owner: FormattedUser | null,
    html_url: string
}

export interface FormattedUser {
    id: number,
    username: string,
    avatarUrl: string
}

export interface FormattedPullRequest {
    id: number,
    repo: string;
    number: number;
    title: string;
    author: FormattedUser | null;
    url: string;
    state: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
    merged_at?: string | null;
    requested_reviewers: (FormattedUser | null)[] | [],
    last_review: FormattedReview | null,
}

export interface FormattedReview {
    id: number;
    reviewer: FormattedUser | null;
    body: string | null;
    state: ReviewState;
    url: string;
    pull_request_number: number;
    submitted_at: string | null;
    commit_id: string;
}

export interface RepoWithReviews {
    repo: string;
    reviews: FormattedReview[];
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

export interface RepoWithPRs {
    repo: string;
    pullRequests: FormattedPullRequest[];
}

export interface FailedOperation {
    type: 'pull_request' | 'repository' | 'user';
    identifier: string;
    reason: string;
    error_code?: number;
    details?: string;
}