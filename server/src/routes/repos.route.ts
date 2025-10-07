import { Router } from "express";

import { getAllRepositoriesOfUser } from "../controllers/RepositoryController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Repos
 *   description: Endpoints for repositories
 */

/**
 * @swagger
 * /api/repos/{username}:
 *   get:
 *     summary: List public repositories of a user
 *     tags: [Repos]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
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
 *         description: List of repositories with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRepositoriesResponse'
 */
router.get('/repos/:username', getAllRepositoriesOfUser);

export default router;