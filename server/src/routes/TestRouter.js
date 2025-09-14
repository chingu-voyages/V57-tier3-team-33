import { Router } from "express";

import { testDatabase } from "../controllers/TestController.js";

const router = Router();

router.get('/test', testDatabase);

export default router;