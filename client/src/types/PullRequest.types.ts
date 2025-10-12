export interface PullRequest {
    id: number,
    repo: string;
    number: number;
    title: string;
    author: User | null;
    url: string;
    state: 'open' | 'closed' | 'all';
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
    merged_at?: string | null;
}

export interface User {
    username: string,
    avatarUlr: string
}