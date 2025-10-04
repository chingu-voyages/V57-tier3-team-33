import { NextFunction, Request, Response } from "express";
import { fetchPullRequestsOfRepo, fetchRepositoriesOfUser } from "../services/GitHubService"
import { PRState } from "../types/github.types.js";

// List public repositories of a user

export async function getAllRepositoriesOfOwner(req: Request, res: Response, next: NextFunction) {
    console.log("HERE")
    const { username } = req.params;
    const {
        page = '1',
        per_page = '30'
    } = req.query;

    try {
        const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
        const pageNum = Math.max(parseInt(page as string) || 1, 1);

        const repos = await fetchRepositoriesOfUser(username, pageNum, perPage);
        res.status(200).json(repos);
    } catch (error) {
        next(error);
    }
}

// List Pull Requests of a public repository

export async function getPullRequestsOfRepository(req: Request, res: Response, next: NextFunction) {
    const { repo, owner } = req.params;
    const { state = 'open', page = '1', per_page = '30' } = req.query;

    try {
        const validStates: PRState[] = ['open', 'closed', 'all'];
        const prState = validStates.includes(state as PRState) ? state as PRState : 'open';

        const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
        const pageNum = Math.max(parseInt(page as string) || 1, 1);

        const prs = await fetchPullRequestsOfRepo(owner, repo, prState, pageNum, perPage);
        res.status(200).json(prs);
    } catch (error) {
        next(error);
    }
}