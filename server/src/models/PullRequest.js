export class PullRequest {
    constructor(
        id,
        repo,
        state,
        title,
        number,
        author,
        createdAt,
        closedAt,
        requestedReviewers,
        lastReview
    ) {
        this.id = id;
        this.repo = repo;
        this.state = state;
        this.title = title;
        this.number = number;
        this.author = author;
        this.createdAt = createdAt;
        this.closedAt = closedAt;
        this.requestedReviewers = requestedReviewers;
        this.lastReview = lastReview;
    }
}