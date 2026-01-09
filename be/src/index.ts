import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/index.js";
import { swaggerSpec } from "./config/swagger.js";
import { API_BASE, ROUTES, MESSAGES } from "./constants/index.js";
import {
  httpLogger,
  errorHandler,
  captureResponseBody,
} from "./middleware/index.js";
import { apiRouter } from "./routes/index.js";
import { sendSuccess } from "./utils/index.js";

const app: Express = express();

// Trust proxy for secure cookies behind reverse proxy
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Capture response body for error logging
app.use(captureResponseBody);

// HTTP logging
app.use(httpLogger);

// Health check
app.get(ROUTES.HEALTH, (_req, res) => {
  sendSuccess(res, MESSAGES.SERVER_HEALTH_OK);
});

// Swagger documentation
app.use(ROUTES.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use(API_BASE, apiRouter);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`${MESSAGES.SERVER_RUNNING} ${PORT}`);
  console.log(
    `Swagger docs available at http://localhost:${PORT}${ROUTES.SWAGGER}`
  );
});

export { app };
