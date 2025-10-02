import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error)
    if (error.status === 404 || error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
    };

    return res.status(500).json({ message: error.message || "Internal server error" });
};