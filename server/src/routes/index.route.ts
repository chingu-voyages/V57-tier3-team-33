import prsRoute from "./prs.route"
import reviewsRoute from "./reviews.route";
import repoRoutes from "./repos.route";
import { Router } from "express";

const router = Router();

router.use("/api", prsRoute);
router.use("/api", reviewsRoute);
router.use("/api", repoRoutes);

export default router;