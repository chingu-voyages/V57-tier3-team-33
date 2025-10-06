import { Router } from "express";
import { getPullRequestsOfRepository, getUserPRs } from "../controllers/pullRequests";

const router = Router();

router.get("/prs/:username", getUserPRs);

router.get("/prs/:username/:repo", getPullRequestsOfRepository);

export default router;
