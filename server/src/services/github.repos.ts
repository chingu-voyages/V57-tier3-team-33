import { Octokit } from "octokit"
import { parseLinkHeader } from "../utils/pagination";
import { RepositoryDTO } from "../dtos/RepositoryDTO";
import { PullRequestDTO } from "../dtos/PullRequestDTO";
import { FormattedRepo } from "../types/formatted.types";

// Get repositories where the user is the owner/contributor/organization member and has push permission
// Get all repos of user
// Filter only those that have push permission
// Set a 50 page limit becaue of GitHub API rate limit
export async function fetchRepositoriesOfUser(octokit: Octokit, page = 1, perPage = 30) {
    try {
        const response = await octokit.request('GET /user/repos', {
            // Pagination
            page: page,
            per_page: perPage,

            // Sort
            sort: "updated",
            dir: "desc"
        });

        return {
            data: response.data
                .filter((repo: any) => repo?.permissions.push)
                .map((repo: any) => RepositoryDTO.fromGitHubAPIToModel(repo)),
            pagination: await buildPagination(
                octokit,
                response.headers.link,
                page,
                perPage,
                response.data.length,
                '/user/repos',
                {}
            )
        };
    } catch (error: any) {
        if (error.status === 404) throw new Error("User not found");

        throw new Error(error.message);
    }
}

// Get PRs of a public repo

export async function fetchPullRequestsOfRepo(
    octokit: Octokit,
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
            direction: 'desc'
        });

        const prs = []
        for (const pr of response.data) {
            const lastReview = await fetchLastReviewOfPullRequest(octokit, owner, repo, pr.number);
            pr.last_review = lastReview;
            prs.push(PullRequestDTO.fromGitHubAPIToModel(pr));
        }

        return {
            data: prs,
            pagination: await buildPagination(
                octokit,
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

export async function fetchLastReviewOfPullRequest(octokit: Octokit, owner: string, repo: string, pullNumber: number) {
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
    octokit: Octokit,
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