import { FormattedPullRequest } from "../types/formatted.types";
import { GitHubPullRequest, GitHubUser } from "../types/github.types";
import { ReviewDTO } from "./ReviewDTO";
import { UserDTO } from "./UserDTO";

export class PullRequestDTO {
    static fromGitHubAPIToModel(pr: GitHubPullRequest): FormattedPullRequest | null {
        if (!pr) return null;

        return {
            id: pr.id,
            repo: pr.head.repo.name,
            number: pr.number,
            title: pr.title,
            author: UserDTO.fromGitHubAPIToModel(pr.user),
            url: pr.html_url,
            state: pr.state,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            closed_at: pr.closed_at || null,
            merged_at: pr.merged_at,
            requested_reviewers:
                (pr.requested_reviewers || [])
                    .map((reviewer: GitHubUser) => UserDTO.fromGitHubAPIToModel(reviewer)),
            last_review: ReviewDTO.fromGitHubAPIToModel(pr.last_review)
        }
    }
}