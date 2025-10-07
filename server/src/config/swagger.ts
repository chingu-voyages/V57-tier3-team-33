import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'V57 Tier3 Team 33 API',
      version: '1.0.0',
      description: 'API documentation for PRs, Reviews, and Repositories',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Local server' },
    ],
  },
  apis: [
    './src/routes/**/*.ts',
    './src/controllers/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);