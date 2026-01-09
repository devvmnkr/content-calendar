import { Router, IRouter } from "express";
import { ROUTES } from "../constants/index.js";
import {
  loginHandler,
  refreshHandler,
  logoutHandler,
  getMeHandler,
} from "../controllers/index.js";
import { authenticate, validateRequest } from "../middleware/index.js";
import { loginSchema } from "../models/user.model.js";

const router: IRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: Password123!
 *         name:
 *           type: string
 *           description: Optional. Used for auto-registration if user does not exist.
 *           example: John Doe
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         code:
 *           type: string
 *         errors:
 *           type: object
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login or Register user
 *     description: Authenticate user with email and password. If user does not exist, automatically registers them. Sets HTTP-only cookies for access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login or registration successful
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookies containing access_token and refresh_token
 *             schema:
 *               type: string
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         isNewUser:
 *                           type: boolean
 *                           description: True if this was a new registration
 *       401:
 *         description: Invalid credentials (for existing users with wrong password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(ROUTES.AUTH.LOGIN, validateRequest(loginSchema), loginHandler);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Use refresh token from cookie to get new access and refresh tokens.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookies containing new access_token and refresh_token
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(ROUTES.AUTH.REFRESH, refreshHandler);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clear authentication cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post(ROUTES.AUTH.LOGOUT, logoutHandler);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get the currently authenticated user's details.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
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
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(ROUTES.AUTH.ME, authenticate, getMeHandler);

export const authRoutes: IRouter = router;
