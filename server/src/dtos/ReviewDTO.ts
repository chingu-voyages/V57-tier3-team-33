import { FormattedReview } from "../types/formatted.types";
import { GitHubReview } from "../types/github.types";
import { UserDTO } from "./UserDTO";

export class ReviewDTO {
    static fromGitHubAPIToModel(review: GitHubReview | null): FormattedReview | null {
        if (!review) return null;

        return {
            id: review.id,
            reviewer: UserDTO.fromGitHubAPIToModel(review.user),
            body: review.body,
            state: review.state,
            url: review.html_url,
            pull_request_number: parseInt(review.pull_request_url.split("pulls/")[1]),
            commit_id: review.commit_id,
            submitted_at: review.submitted_at,
        };
    }
}