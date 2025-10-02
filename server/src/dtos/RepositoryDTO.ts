import { FormattedRepo } from "../types/formatted.types";
import { GitHubRepo } from "../types/github.types";
import { UserDTO } from "./UserDTO";

export class RepositoryDTO {

    static fromGitHubAPIToModel(repo: GitHubRepo): FormattedRepo | null {
        if (!repo) return null;

        return {
            id: repo.id,
            name: repo.name,
            owner: UserDTO.fromGitHubAPIToModel(repo.owner),
            html_url: repo.html_url
        }
    }
}