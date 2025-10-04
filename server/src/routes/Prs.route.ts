import { Router } from "express";
import { getUserPRs, getUserRepoPRs, getUserRepositories } from "../controllers/pullRequests";

const router = Router();


router.get("/repos/:username", getUserRepositories);

router.get("/prs/:username", getUserPRs);

router.get("/prs/:username/:repo", getUserRepoPRs);

export default router;
