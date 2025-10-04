import { Router } from "express";

import { getAllRepositoriesOfUser } from "../controllers/RepositoryController";

const router = Router();

router.get('/repos/:username', getAllRepositoriesOfUser);

export default router;