import { Octokit } from "octokit"
import { parseLinkHeader } from "../utils/pagination";
import { RepositoryDTO } from "../dtos/RepositoryDTO";
import { PullRequestDTO } from "../dtos/PullRequestDTO";

const octokit = new Octokit();

// Get public repositories of a user
export async function fetchRepositoriesOfUser(username: string, page = 1, perPage = 30) {
    try {
        const response = await octokit.request('GET /users/{username}/repos', {
            username: username,

            // Filters
            type: 'all',

            // Pagination
            page: page,
            per_page: perPage,
        });

        return {
            data: response.data.map((repo: any) => RepositoryDTO.fromGitHubAPIToModel(repo)),
            pagination: await buildPagination(
                response.headers.link,
                page,
                perPage,
                response.data.length,
                '/users/{username}/repos',
                { username: username, type: 'all' }
            )
        };
    } catch (error: any) {
        if (error.status === 404) throw new Error("User not found");

        throw new Error(error.message);
    }
}

// Get PRs of a public repo

export async function fetchPullRequestsOfRepo(
    owner: string,
    repo: string,
    state: string,
    page = 1,
    perPage = 30) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: owner,
            repo: repo,

            // Filters
            state: state,

            // Pagination
            page: page,
            per_page: perPage,

            // Sort
            sort: 'updated',
            direction: 'asc'
        });

        const prs = []
        for (const pr of response.data) {
            const lastReview = await fetchLastReviewOfPullRequest(owner, repo, pr.number);
            pr.last_review = lastReview;
            prs.push(PullRequestDTO.fromGitHubAPIToModel(pr));
        }

        return {
            data: prs,
            pagination: await buildPagination(
                response.headers.link,
                page,
                perPage,
                response.data.length,
                '/repos/{owner}/{repo}/pulls',
                { owner: owner, repo: repo, state: state, }
            )
        };

    } catch (error: any) {
        if (error.status === 404) throw new Error("User or repository not found");

        throw new Error(error.message);
    }
}

async function fetchLastReviewOfPullRequest(owner: string, repo: string, pullNumber: number) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: owner,
            repo: repo,
            pull_number: pullNumber,
            page: 1,
            per_page: 1
        });

        if (response.data.length === 0) return null;

        const lastPage = parseLinkHeader(response.headers.link).last || 1;
        if (lastPage == 1) return response.data[0];

        const lastReview = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: owner,
            repo: repo,
            pull_number: pullNumber,
            page: lastPage,
            per_page: 1
        });

        return lastReview.data.length > 0 ? lastReview.data[0] : null;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

async function buildPagination(
    link: string,
    page: number,
    perPage: number,
    totalRecordsOnCurrentPage: number,
    endpoint: string,
    params: object
) {
    const links = parseLinkHeader(link);
    const totalPages = links.last || page;
    let totalRecordsOnLastPage = null;

    if (totalPages === page) {
        totalRecordsOnLastPage = totalRecordsOnCurrentPage;
    } else {
        try {
            const lastPage = await octokit.request(`GET ${endpoint}`, {
                ...params,
                page: totalPages,
                per_page: perPage
            });
            totalRecordsOnLastPage = lastPage.data.length;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    return {
        page: page,
        per_page: perPage,
        total_pages: totalPages,
        total_records: (totalPages - 1) * perPage + totalRecordsOnLastPage
    }
}