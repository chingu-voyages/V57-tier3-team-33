import { Request, Response } from "express";
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

export async function getUserPRs(req: Request, res: Response) {
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

    const [reposWithPRs, totalPublicRepos, totalPRsAllRepos, rateLimit] =
      await Promise.all([
        getAllPRsForUser(username, prState, options),
        getUserRepoCount(username),
        getTotalPRCountViaSearch(username, prState),
        getGitHubRateLimit(),
      ]);

    const response = formatPullRequestResponse({
      prs: reposWithPRs,
      pageNum,
      perPage,
      prState,
      username,
      totalPublicRepos,
      totalPRsOverride: Math.min(totalPRsAllRepos, 1000),
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit,
    });
  } catch (error: any) {
    console.error("Error in getUserPRs:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching user pull requests",
      error: githubError.message,
      ...(githubError.documentation_url && {
        documentation_url: githubError.documentation_url,
      }),
    });
  }
}

export async function getUserRepoPRs(req: Request, res: Response) {
  try {
    const { username, repo } = req.params;
    const { state = "open", per_page = "30", page = "1" } = req.query;

    const validStates: PRState[] = ["open", "closed", "all"];
    const prState = validStates.includes(state as PRState)
      ? (state as PRState)
      : "open";

    const perPage = Math.min(
      Math.max(parseInt(per_page as string) || 30, 1),
      100
    );
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [pullRequests, rateLimit] = await Promise.all([
      getRepoPRs(username, repo, prState, options),
      getGitHubRateLimit(),
    ]);

    const response = formatRepoPRResponse({
      repo,
      pullRequests,
      pageNum,
      perPage,
      prState,
      username,
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit,
    });
  } catch (error: any) {
    console.error("Error in getUserRepoPRs:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching repository pull requests",
      error: githubError.message,
      ...(githubError.documentation_url && {
        documentation_url: githubError.documentation_url,
      }),
    });
  }
}

export async function getUserRepositories(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { per_page = "30", page = "1" } = req.query;

    const perPage = Math.min(
      Math.max(parseInt(per_page as string) || 30, 1),
      100
    );
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };

    const [repos, totalPublicRepos, rateLimit] = await Promise.all([
      getOwnerRepos(username, options),
      getUserRepoCount(username),
      getGitHubRateLimit(),
    ]);

    const effectiveTotal = Math.min(totalPublicRepos, 200);

    const response = formatUserRepositoriesResponse({
      repos,
      pageNum,
      perPage,
      username,
      totalPublicRepos: effectiveTotal,
    });

    res.status(200).json({
      ...response,
      rate_limit: rateLimit,
    });
  } catch (error: any) {
    console.error("Error in getUserRepositories:", error);

    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;

    res.status(statusCode).json({
      success: false,
      message: "Error fetching user repositories",
      error: githubError.message,
      ...(githubError.documentation_url && {
        documentation_url: githubError.documentation_url,
      }),
    });
  }
}
