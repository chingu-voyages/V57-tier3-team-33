import { PullRequest } from "../models/PullRequest.js";
import { RepositoryDTO } from "./RepositoryDTO.js";
import { ReviewDTO } from "./ReviewDTO.js";
import { UserDTO } from "./UserDTO.js";

export class PullRequestDTO {
    static fromGitHubAPIToModel(pr) {
        if (!pr) return null;

        return new PullRequest(
            pr.id,
            RepositoryDTO.fromGitHubAPIToModel(pr.head.repo),
            pr.state,
            pr.title,
            pr.number,
            UserDTO.fromGitHubAPIToModel(pr.user),
            pr.created_at,
            pr.closed_at || null,
            (pr.requested_reviewers || []).map((reviewer) => UserDTO.fromGitHubAPIToModel(reviewer)),
            ReviewDTO.fromGitHubAPIToModel(pr.lastReview)
        )
    }
}