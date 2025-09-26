import { Router } from "express";

import { testDatabase } from "../controllers/TestController.js";
import { getAllRepositoriesOfOwner, getPullRequestsOfRepository } from "../controllers/RepositoryController.js";

const router = Router();

router.get('/test', testDatabase);
router.get('/repos/:username', getAllRepositoriesOfOwner);
router.get('/repos/:owner/:repo/pulls', getPullRequestsOfRepository);

export default router;