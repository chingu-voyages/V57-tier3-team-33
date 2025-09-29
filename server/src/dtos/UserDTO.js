import { User } from "../models/User.js";

export class UserDTO {
    static fromGitHubAPIToModel(user) {
        if (!user) return null;

        return new User(
            user.id,
            user.login,
            user.avatar_url
        );
    };
}