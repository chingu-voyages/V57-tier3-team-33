import { Router } from "express";

import { getAllRepositoriesOfOwner, getPullRequestsOfRepository } from "../controllers/RepositoryController";

const router = Router();

router.get('/repos/:username', getAllRepositoriesOfOwner);
router.get('/repos/:owner/:repo/pulls', getPullRequestsOfRepository);

export default router;