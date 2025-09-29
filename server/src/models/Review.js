export class Review {
    constructor(
        id,
        state,
        user,
        createdAt,
        body
    ) {
        this.id = id;
        this.state = state;
        this.user = user;
        this.createdAt = createdAt;
        this.body = body;
    }
}