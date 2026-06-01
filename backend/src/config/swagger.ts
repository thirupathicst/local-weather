import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Express } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app: Express) => {
  let swaggerDocument;

  if (process.env.NODE_ENV === 'production') {
    // In production, serve from the pre-generated static swagger.json
    const swaggerFilePath = path.join(__dirname, '../swagger.json');
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));
  } else {
    // In development/debug mode, dynamically generate swagger spec
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
      apis: [
        path.join(__dirname, '../routes/*.ts'),
        path.join(__dirname, '../app.ts')
      ]
    };
    swaggerDocument = swaggerJsdoc(options);
  }

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, process.env.NODE_ENV === 'production' ? {
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.1/swagger-ui-standalone-preset.min.js',
      ],
    } : {})
  );

  // Also expose the raw swagger.json file
  app.get('/api-docs/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};