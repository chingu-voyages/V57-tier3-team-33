import prsRoute from "./Prs.route";
import reviewsRoute from "./reviews.route";
import { Router } from "express";

const router = Router();

router.use("/api", prsRoute);
router.use("/api", reviewsRoute);
export default router;