import { Router } from "express";
import { 
  getPRReviews,
  getUserRepoReviews, 
  getUserReviews,
  getReviewsByReviewer,
  getReviewStats
} from "../controllers/reviews";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints for pull request reviews
 */

/**
 * @swagger
 * /api/reviews/{username}:
 *   get:
 *     summary: Get aggregated reviews across user repositories
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [APPROVED, CHANGES_REQUESTED, COMMENTED, PENDING, DISMISSED, all]
 *           default: all
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Aggregated reviews with pagination and stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserReviewResponse'
 */
router.get("/reviews/:username", getUserReviews);


/**
 * @swagger
 * /api/reviews/{username}/{repo}:
 *   get:
 *     summary: Get reviews for a specific repository
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [APPROVED, CHANGES_REQUESTED, COMMENTED, PENDING, DISMISSED, all]
 *           default: all
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Reviews for the repository with pagination and stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RepoReviewResponse'
 */
router.get("/reviews/:username/:repo", getUserRepoReviews);


/**
 * @swagger
 * /api/reviews/{username}/{repo}/{pullNumber}:
 *   get:
 *     summary: Get reviews for a pull request
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pullNumber
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Reviews for the pull request with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PRReviewResponse'
 */
router.get("/reviews/:username/:repo/:pullNumber", getPRReviews);


/**
 * @swagger
 * /api/reviewer/{reviewer}:
 *   get:
 *     summary: Get reviews authored by a specific reviewer
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewer
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [APPROVED, CHANGES_REQUESTED, COMMENTED, PENDING, DISMISSED, all]
 *           default: all
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Reviews by reviewer with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewerReviewsResponse'
 */
router.get("/reviewer/:reviewer", getReviewsByReviewer);


/**
 * @swagger
 * /api/stats/{username}:
 *   get:
 *     summary: Get review statistics for a user, optionally by repo
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: repo
 *         schema:
 *           type: string
 *         description: Optional repository to filter stats
 *     responses:
 *       200:
 *         description: Review statistics with success/failure counts and totals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewStatsResponse'
 */
router.get("/stats/:username", getReviewStats);

export default router;