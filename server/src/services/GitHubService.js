import { Octokit } from "octokit"
import { parseLinkHeader } from "../utils/pagination.js";
import { request } from "express";

const octokit = new Octokit();

// Get public repositories of a user
export const fetchRepositoriesOfUser = async (username, page, perPage) => {
    try {
        const response = await octokit.request('GET /users/{username}/repos', {
            username: username,
            page: page,
            per_page: perPage,
            type: 'all',
        });

        return {
            data: response.data.map((repo) => ({ name: repo.name, owner: repo.owner.login })),
            pagination: parseLinkHeader(response.headers.link)
        };

    } catch (error) {
        if (error.status === 404) throw new Error("User not found");

        throw new Error("Failed to fetch repositories from GitHub API");
    }
}

// Get PRs of a public repo

export const fetchPullRequestsOfRepo = async (owner, repo, state, page, perPage) => {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: owner,
            repo: repo,
            state: state,
            page: page,
            per_page: perPage
        });
        return {
            data: response.data,
            pagination: parseLinkHeader(response.headers.link)
        };

    } catch (error) {
        if (error.status === 404) throw new Error("User or repository not found");

        throw new Error("Failed to fetch pull requests from GitHub API");
    }
}