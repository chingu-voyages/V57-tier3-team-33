import React from "react";
import { GitPR } from "./icons";
import { formatDistanceToNow } from "date-fns";

export interface PRAuthor {
  id?: number;
  username?: string;
  avatarUrl?: string;
}

export interface PullRequestItem {
  id: number;
  repo: string;
  number: number;
  title: string;
  author?: PRAuthor | null;
  url: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  merged_at?: string | null;
}

interface PRListItemProps {
  pr: PullRequestItem;
}

const PRListItem: React.FC<PRListItemProps> = ({ pr }) => {
  let timeText = "";
  try {
    if (pr?.created_at) {
      const d = new Date(pr.created_at);
      if (!isNaN(d.getTime())) {
        timeText = formatDistanceToNow(d, { addSuffix: true });
      } else {
        // parsing failed but we have a string; show it raw
        timeText = pr.created_at;
      }
    } else {
      // no timestamp provided at all
      timeText = "Created date not provided";
    }
  } catch {
    // formatting threw; show raw value if present
    timeText = pr?.created_at || "Created date not provided";
  }

  const authorName = pr.author?.username || "unknown";

  return (
    <div className="p-4 border-[0.5px] border-gray-300 hover:bg-gray-100">
      <a href={pr.url} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-col gap-2 cursor-pointer">
          <div className="flex gap-2 font-semibold">
            <GitPR className="w-5 h-5" fill="#28a745" />
            <div className="text-gray-600">{pr.repo}</div>
            <div>{pr.title}</div>
          </div>
          <div className="text-gray-600 text-sm">
            #{pr.number} Opened in {pr.repo} {timeText ? `(${timeText})` : ""} by {authorName}
          </div>
        </div>
      </a>
    </div>
  );
};

export default PRListItem;