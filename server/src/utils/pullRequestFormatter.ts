import { FormattedPullRequest, RepoWithPRs } from "../types/formatted.types";
import {
  PullRequestResponseFormat,
  PRState,
  RepoPRResponseFormat,
  UserRepositoriesResponseFormat,
  GitHubRepo

} from "../types/github.types";

/**
 * Parameters for formatting pull request response
 */
export interface FormatPullRequestResponseParams {
  prs: RepoWithPRs[];
  pageNum: number;
  perPage: number;
  prState: PRState;
  username: string;
  totalPublicRepos?: number;
  totalPRsOverride?: number;
}

/**
 * Formats the response for pull requests
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatPullRequestResponse(params: FormatPullRequestResponseParams): PullRequestResponseFormat {
  const { prs, pageNum, perPage, prState, username, totalPRsOverride } = params;

  // Calculate total PRs across all repositories
  const totalPRs = typeof totalPRsOverride === 'number'
    ? totalPRsOverride
    : prs.reduce((sum, repo) => sum + repo.pullRequests.length, 0);

  // Calculate total pages based on total PRs and per_page
  const totalPages = Math.ceil(totalPRs / perPage);

  return {
    success: true,
    data: prs,
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: totalPRs
    },
    filters: {
      state: prState,
      username
    }
  };
}

/**
 * Formats the response for repository pull requests
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatRepoPRResponse(params: {
  repo: string;
  pullRequests: FormattedPullRequest[];
  pageNum: number;
  perPage: number;
  prState: PRState;
  username: string;
}): RepoPRResponseFormat {
  const { repo, pullRequests, pageNum, perPage, prState, username } = params;

  // Calculate total pages based on pull requests count
  const totalPages = Math.ceil(pullRequests.length / perPage);

  return {
    success: true,
    data: {
      repo,
      pullRequests
    },
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: pullRequests.length
    },
    filters: {
      state: prState,
      username,
      repo
    }
  };
}

/**
 * Formats the response for user repositories
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatUserRepositoriesResponse(params: {
  repos: GitHubRepo[];
  pageNum: number;
  perPage: number;
  username: string;
  totalPublicRepos: number;
}): UserRepositoriesResponseFormat {
  const { repos, pageNum, perPage, username, totalPublicRepos } = params;

  // Calculate total pages based on total public repositories
  const totalPages = Math.ceil(totalPublicRepos / perPage);

  return {
    success: true,
    data: repos,
    pagination: {
      page: pageNum,
      per_page: perPage,
      total_pages: totalPages,
      total_records: totalPublicRepos
    },
    filters: {
      username
    }
  };
}