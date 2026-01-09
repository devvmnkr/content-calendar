import { Router, IRouter } from "express";
import { ROUTES } from "../constants/index.js";
import { authRoutes } from "./auth.routes.js";

const router: IRouter = Router();

// Auth routes
router.use(ROUTES.AUTH.BASE, authRoutes);

export const apiRouter: IRouter = router;
