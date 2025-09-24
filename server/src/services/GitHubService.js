import { Octokit } from "octokit"

const octokit = new Octokit();

// Get repositories of a user
export const fetchRepositoriesOfOwner = async (username, page, perPage) => {
    try {
        const response = await octokit.request(`GET /users/${username}/repos?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        if (error.status === 404) throw new Error("User not found");

        throw new Error("Failed to fetch repositories from GitHub API");
    }
}