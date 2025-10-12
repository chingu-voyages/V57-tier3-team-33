export interface Author {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface PullRequest {
  id: number;
  repo: string;
  number: number;
  title: string;
  author: Author;
  url: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  requested_reviewers: unknown[];
  last_review: unknown | null;
}

export interface RepoGroup {
  repo: string;
  pullRequests: PullRequest[];
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface FiltersMeta {
  state: "open" | "closed";
  username: string;
}

export interface SortMeta {
  sort_by: "updated" | "created" | "comments";
  dir: "asc" | "desc";
}

export interface RateLimitMeta {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resetDate: string;
}

export interface PRResponseEnvelope {
  success: boolean;
  data: RepoGroup[];
  pagination: PaginationMeta;
  filters: FiltersMeta;
  sort: SortMeta;
  rate_limit: RateLimitMeta;
}