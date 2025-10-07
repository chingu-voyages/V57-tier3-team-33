import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from "./env";
import { swaggerComponents } from './swagger.components'; 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'V57 Tier3 Team 33 API',
      version: '1.0.0',
      description: 'API documentation for PRs, Reviews, and Repositories',
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Local server' },
    ],
    // Shared component schemas (responses-only)
    components: {
      schemas: swaggerComponents.schemas,
    }
  },
  apis: [
    './src/routes/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);