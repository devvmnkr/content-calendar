import { Router, IRouter } from "express";
import { ROUTES } from "../constants/index.js";
import { authRoutes } from "./auth.routes.js";
import { postRoutes } from "./post.routes.js";

const router: IRouter = Router();

// Auth routes
router.use(ROUTES.AUTH.BASE, authRoutes);

// Posts routes
router.use(ROUTES.POSTS.BASE, postRoutes);

export const apiRouter: IRouter = router;
