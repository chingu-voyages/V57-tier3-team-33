import { NextFunction, Request, Response } from "express";
import {
  getAllPRsForUser,
  getRepoPRs,
  getOwnerRepos,
  getUserRepoCount,
  getGitHubRateLimit,
  getTotalPRCountViaSearch,
} from "../services/github.open.prs";
import { PRState, GitHubError } from "../types/github.types";
import {
  formatPullRequestResponse,
  formatRepoPRResponse,
  formatUserRepositoriesResponse,
} from "../utils/pullRequestFormatter";
import { fetchPullRequestsOfRepo } from "../services/GitHubService";

// All PRs of a User
export async function getUserPRs(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const { state = "open", per_page = "10", page = "1" } = req.query;

    const validStates: PRState[] = ["open", "closed", "all"];
    const prState = validStates.includes(state as PRState)
      ? (state as PRState)
      : "open";

    const perPage = Math.min(
      Math.max(parseInt(per_page as string) || 10, 1),
      100
    );
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [reposWithPRs, totalPRsAllRepos, rateLimit] =
      await Promise.all([
        getAllPRsForUser(username, prState, options),
        getTotalPRCountViaSearch(username, prState),
        getGitHubRateLimit(),
      ]);

    const response = formatPullRequestResponse({
      prs: reposWithPRs,
      pageNum,
      perPage,
      prState,
      username,
      totalPRsOverride: Math.min(totalPRsAllRepos, 1000),
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit,
    });
  } catch (error: any) {
    next(error);
  }
}

// All PRs of a Repos
export async function getPullRequestsOfRepository(req: Request, res: Response, next: NextFunction) {
  const { repo, username } = req.params;
  const { state = 'open', page = '1', per_page = '30' } = req.query;

  try {
    const validStates: PRState[] = ['open', 'closed', 'all'];
    const prState = validStates.includes(state as PRState) ? state as PRState : 'open';

    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const [prs, rateLimit] = await Promise.all([
      fetchPullRequestsOfRepo(username, repo, prState, pageNum, perPage),
      getGitHubRateLimit()
    ]);
    res.status(200).json({
      ...prs,
      rate_limit: rateLimit
    });
  } catch (error) {
    next(error);
  }
}