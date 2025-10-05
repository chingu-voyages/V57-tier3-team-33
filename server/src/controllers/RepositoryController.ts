import { NextFunction, Request, Response } from "express";
import { fetchRepositoriesOfUser } from "../services/github.repos"
import { getGitHubRateLimit } from "../services/github.open.prs";
import { formatUserRepositoriesResponse } from "../utils/pullRequestFormatter";

// List public repositories of a user
export async function getAllRepositoriesOfUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;
    const {
        page = '1',
        per_page = '30'
    } = req.query;

    try {
        const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
        const pageNum = Math.max(parseInt(page as string) || 1, 1);

        const [repos, rateLimit] = await Promise.all([
            fetchRepositoriesOfUser(username, pageNum, perPage),
            getGitHubRateLimit()
        ]);

        const response = formatUserRepositoriesResponse({
            repos: repos.data,
            pagination: repos.pagination,
            username: username
        });

        res.status(200).json({
            ...response,
            rate_limit: rateLimit
        });
    } catch (error) {
        next(error);
    }
}