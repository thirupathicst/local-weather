import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Express } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  ? [
      path.join(__dirname, '../../dist/routes/*.js'),
      path.join(__dirname, '../../dist/app.js')
    ]
  : [
      path.join(__dirname, '../routes/*.ts'),
      path.join(__dirname, '../app.ts')
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, process.env.NODE_ENV === 'production' ? {
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-standalone-preset.min.js',
      ],
    } : {})
  );
};