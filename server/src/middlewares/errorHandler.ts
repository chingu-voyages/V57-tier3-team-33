import { NextFunction, Request, Response } from "express";
import { GitHubError } from "../types/github.types";

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error)
    if (error.status === 404 || error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
    };

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
};