import { Router } from "express";

import { testDatabase } from "../controllers/TestController.js";
import { getAllRepositoriesOfOwner } from "../controllers/RepositoryController.js";

const router = Router();

router.get('/test', testDatabase);
router.get('/:username/repos', getAllRepositoriesOfOwner);

export default router;