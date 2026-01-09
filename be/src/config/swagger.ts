import swaggerJsdoc from "swagger-jsdoc";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SWAGGER_INFO = {
  TITLE: "Content Calendar API",
  VERSION: "1.0.0",
  DESCRIPTION: "Backend API for Content Calendar application",
  CONTACT_NAME: "API Support",
  LICENSE_NAME: "ISC",
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: SWAGGER_INFO.TITLE,
      version: SWAGGER_INFO.VERSION,
      description: SWAGGER_INFO.DESCRIPTION,
      contact: {
        name: SWAGGER_INFO.CONTACT_NAME,
      },
      license: {
        name: SWAGGER_INFO.LICENSE_NAME,
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: "HTTP-only cookie containing the access token",
        },
      },
    },
  },
  apis: [
    resolve(__dirname, "../routes/*.ts"),
    resolve(__dirname, "../routes/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

// Generate swagger.json when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outputPath = resolve(__dirname, "../../swagger.json");
  writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
  console.log(`Swagger spec written to ${outputPath}`);
}
