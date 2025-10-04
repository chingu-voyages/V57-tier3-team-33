import { Router } from "express";
import { 
  getPRReviews,
  getUserRepoReviews, 
  getUserReviews,
  getReviewsByReviewer,
  getReviewStats
} from "../controllers/reviews";

const router = Router();

router.get("/reviews/:username", getUserReviews);


router.get("/reviews/:username/:repo", getUserRepoReviews);


router.get("/reviews/:username/:repo/:pullNumber", getPRReviews);


router.get("/reviewer/:reviewer", getReviewsByReviewer);


router.get("/stats/:username", getReviewStats);

export default router;