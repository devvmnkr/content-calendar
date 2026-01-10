import { Router, IRouter } from "express";
import { ROUTES } from "../constants/index.js";
import {
  createPostHandler,
  getPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
} from "../controllers/index.js";
import { authenticate, validateRequest } from "../middleware/index.js";
import { uploadSingle } from "../middleware/upload.js";
import {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
  postIdParamSchema,
} from "../models/post.model.js";

const router: IRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *           nullable: true
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [twitter, facebook, instagram, youtube, linkedin, tiktok, pinterest]
 *         scheduled_time:
 *           type: string
 *           format: date-time
 *         file_url:
 *           type: string
 *           nullable: true
 *         file_name:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [draft, scheduled, published, failed]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - channels
 *         - scheduled_time
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: "New Product Launch"
 *         content:
 *           type: string
 *           example: "Exciting news! Our new product is launching today."
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [twitter, facebook, instagram, youtube, linkedin, tiktok, pinterest]
 *           minItems: 1
 *           example: ["twitter", "facebook"]
 *         scheduled_time:
 *           type: string
 *           format: date-time
 *           example: "2026-01-15T10:00:00Z"
 *         status:
 *           type: string
 *           enum: [draft, scheduled, published, failed]
 *           default: draft
 *         file:
 *           type: string
 *           format: binary
 *           description: Optional file attachment (image, PDF, Excel, Word)
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         content:
 *           type: string
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [twitter, facebook, instagram, youtube, linkedin, tiktok, pinterest]
 *           minItems: 1
 *         scheduled_time:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [draft, scheduled, published, failed]
 *         file:
 *           type: string
 *           format: binary
 *           description: Optional file attachment (replaces existing)
 */

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with optional file attachment. Supports multiple channels.
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         post:
 *                           $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authenticate,
  uploadSingle,
  validateRequest(createPostSchema),
  createPostHandler
);

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve all posts for the authenticated user with optional filters.
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [twitter, facebook, instagram, youtube, linkedin, tiktok, pinterest]
 *         description: Filter by channel
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter posts scheduled on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter posts scheduled on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         posts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Post'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  authenticate,
  validateRequest(getPostsQuerySchema, "query"),
  getPostsHandler
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its ID.
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         post:
 *                           $ref: '#/components/schemas/Post'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  ROUTES.POSTS.BY_ID,
  authenticate,
  validateRequest(postIdParamSchema, "params"),
  getPostByIdHandler
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update an existing post. All fields are optional.
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         post:
 *                           $ref: '#/components/schemas/Post'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  ROUTES.POSTS.BY_ID,
  authenticate,
  uploadSingle,
  validateRequest(postIdParamSchema, "params"),
  validateRequest(updatePostSchema),
  updatePostHandler
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Soft delete a post by its ID.
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  ROUTES.POSTS.BY_ID,
  authenticate,
  validateRequest(postIdParamSchema, "params"),
  deletePostHandler
);

export const postRoutes: IRouter = router;
