import prsRoute from "./Prs.route";
import reviewsRoute from "./reviews.route";
import repoRoutes from "./TestRouter";
import { Router } from "express";

const router = Router();

router.use("/api", prsRoute);
router.use("/api", reviewsRoute);
router.use("/api", repoRoutes);

export default router;