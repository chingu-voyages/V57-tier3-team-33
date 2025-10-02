import { FormattedUser } from "../types/formatted.types.js";
import { GitHubUser } from "../types/github.types.js";

export class UserDTO {
    static fromGitHubAPIToModel(user: GitHubUser | null): FormattedUser | null {
        if (!user) return null;

        return {
            id: user.id,
            username: user.login,
            avatarUrl: user.avatar_url
        };
    };
}