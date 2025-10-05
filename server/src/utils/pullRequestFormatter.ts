import { FormattedPullRequest, FormattedRepo, RepoWithPRs } from "../types/formatted.types";
import {
  PullRequestResponseFormat,
  PRState,
  RepoPRResponseFormat,
  UserRepositoriesResponseFormat,
  GitHubRepo,
  Pagination,
  Filters
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
    },
    sort: {
      sort_by: 'updated',
      dir: 'desc'
    }
  };
}

/**
 * Formats the response for repository pull requests
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatRepoPRResponse(params: {
  pullRequests: FormattedPullRequest[];
  pagination: Pagination,
  state: PRState,
  username: string,
  repo: string
}): RepoPRResponseFormat {
  const {  pullRequests, pagination, state, username, repo } = params;

  return {
    success: true,
    data: pullRequests,
    pagination: pagination,
    filters: {
      state: state,
      username: username,
      repo: repo
    },
    sort: {
      sort_by: 'updated',
      dir: 'desc'
    }
  };
}

/**
 * Formats the response for user repositories
 * @param params - The parameters for formatting the response
 * @returns Formatted response object
 */
export function formatUserRepositoriesResponse(params: {
  repos: FormattedRepo[];
  pagination: Pagination;
  username: string;
}): UserRepositoriesResponseFormat {
  const { repos, pagination, username } = params;

  return {
    success: true,
    data: repos,
    pagination: pagination,
    filters: {
      username
    },
    sort: {
      sort_by: 'updated',
      dir: 'desc'
    }
  };
}