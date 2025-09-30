import { Request, Response } from "express";
import { 
  getAllPRsForUser, 
  getRepoPRs, 
  getUserRepos,
} from "../services/github.open.prs";
import { PRState, GitHubError } from "../types/github.types";


export async function getUserPRs(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { 
      state = 'open', 
      per_page = '10', 
      page = '1' 
    } = req.query;

    // Validate state parameter
    const validStates: PRState[] = ['open', 'closed', 'all'];
    const prState = validStates.includes(state as PRState) ? state as PRState : 'open';
    
    
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const prs = await getAllPRsForUser(username, prState, options);
    
    res.status(200).json({
      success: true,
      data: prs,
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_repos: prs.length,
        total_prs: prs.reduce((sum, repo) => sum + repo.pullRequests.length, 0)
      },
      filters: {
        state: prState,
        username
      }
    });
  } catch (error: any) {
    console.error("Error in getUserPRs:", error);
    
    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;
    
    res.status(statusCode).json({ 
      success: false,
      message: "Error fetching pull requests", 
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getUserRepoPRs(req: Request, res: Response) {
  try {
    const { username, repo } = req.params;
    const { 
      state = 'open', 
      per_page = '30', 
      page = '1' 
    } = req.query;

    
    const validStates: PRState[] = ['open', 'closed', 'all'];
    const prState = validStates.includes(state as PRState) ? state as PRState : 'open';
    
    
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const prs = await getRepoPRs(username, repo, prState, options);
    
    res.status(200).json({
      success: true,
      data: {
        repo,
        pullRequests: prs
      },
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_prs: prs.length
      },
      filters: {
        state: prState,
        username,
        repo
      }
    });
  } catch (error: any) {
    console.error("Error in getUserRepoPRs:", error);
    
    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;
    
    res.status(statusCode).json({ 
      success: false,
      message: "Error fetching repository pull requests", 
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}


export async function getUserRepositories(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { 
      per_page = '30', 
      page = '1' 
    } = req.query;

    
    const perPage = Math.min(Math.max(parseInt(per_page as string) || 30, 1), 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    const options = { perPage, page: pageNum };
    const repos = await getUserRepos(username, options);
    
    res.status(200).json({
      success: true,
      data: repos,
      pagination: {
        page: pageNum,
        per_page: perPage,
        total_repos: repos.length
      },
      filters: {
        username
      }
    });
  } catch (error: any) {
    console.error("Error in getUserRepositories:", error);
    
    const githubError = error as GitHubError;
    const statusCode = githubError.status || 500;
    
    res.status(statusCode).json({ 
      success: false,
      message: "Error fetching user repositories", 
      error: githubError.message,
      ...(githubError.documentation_url && { documentation_url: githubError.documentation_url })
    });
  }
}
