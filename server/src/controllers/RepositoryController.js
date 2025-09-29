import { fetchPullRequestsOfRepo, fetchRepositoriesOfUser } from "../services/GitHubService.js"

// List public repositories of a user

export const getAllRepositoriesOfOwner = async (request, response, next) => {
    const username = request.params.username;
    const page = request.query.page || 1;
    const perPage = Math.min(parseInt(request.query.perPage, 10) || 30, 100);

    try {
        const repos = await fetchRepositoriesOfUser(username, page, perPage);
        response.status(200).json(repos);
    } catch (error) {
        next(error);
    }
}

// List Pull Requests of a public repository

export const getPullRequestsOfRepository = async (request, response, next) => {
    const repo = request.params.repo;
    const owner = request.params.owner;
    const state = request.query.state || 'open';
    const page = parseInt(request.query.page) || 1;
    const perPage = Math.min(parseInt(request.query.perPage, 10) || 30, 100);

    try {
        const prs = await fetchPullRequestsOfRepo(owner, repo, state, page, perPage);
        response.status(200).json(prs);
    } catch (error) {
        next(error);
    }
}