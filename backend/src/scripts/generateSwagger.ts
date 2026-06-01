import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../app.ts')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const outputPath = path.join(__dirname, '../../dist/swagger.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log(`Swagger JSON generated at: ${outputPath}`);
