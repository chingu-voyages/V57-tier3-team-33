import { Router } from "express";
import { getPullRequestsOfRepository, getUserPRs } from "../controllers/pullRequests";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PRs
 *   description: Endpoints for pull requests
 */

/**
 * @swagger
 * /api/prs/{username}:
 *   get:
 *     summary: Get pull requests grouped by repository for a user
 *     tags: [PRs]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [open, closed, all]
 *           default: open
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
 *         description: List of PRs grouped by repository with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PullRequestResponse'
 */
router.get("/prs/:username", getUserPRs);

/**
 * @swagger
 * /api/prs/{username}/{repo}:
 *   get:
 *     summary: Get pull requests of a repository
 *     tags: [PRs]
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
 *           enum: [open, closed, all]
 *           default: open
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
 *         description: List of PRs for the repository with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RepoPRResponse'
 */
router.get("/prs/:username/:repo", getPullRequestsOfRepository);

export default router;
