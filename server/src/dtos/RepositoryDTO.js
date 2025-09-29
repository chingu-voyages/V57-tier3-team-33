import { Repository } from "../models/Repository.js";
import { UserDTO } from "./UserDTO.js";

export class RepositoryDTO {

    static fromGitHubAPIToModel(repo) {
        if (!repo) return null;

        return new Repository(
            repo.id,
            repo.name,
            UserDTO.fromGitHubAPIToModel(repo.owner),
            repo.html_url
        )
    }
}