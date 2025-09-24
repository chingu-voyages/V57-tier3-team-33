import { fetchRepositoriesOfOwner } from "../services/GitHubService.js"

// List public repositories of a user

export const getAllRepositoriesOfOwner = async (request, response) => {
    const username = request.params.username;
    const page = request.query.page || 1;
    const perPage = request.query.perPage || 30;

    try {
        const repos = await fetchRepositoriesOfOwner(username, page, perPage);
        response.status(200).json(repos.map((repo) => repo.name));
    } catch (error) {
        if (error.message === "User not found") {
            response.status(404).json({ message: `GitHub user ${username} not found` });
        }
        response.status(500).json({ message: error.message });
    }
}