import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Weather API, which provides weather information based on city names.'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },

  apis: process.env.NODE_ENV === 'production'
  ? ['./dist/routes/*.js']
  : ['./src/routes/*.ts','./src/app.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};