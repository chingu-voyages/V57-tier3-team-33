import { Review } from "../models/Review.js";

export class ReviewDTO {
    static fromGitHubAPIToModel(review) {
        if (!review) return null;
        
        return new Review(
            review.id,
            review.state,
            review.user.login,
            review.submitted_at,
            review.body
        );
    }
}