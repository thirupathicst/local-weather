import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { setupSwagger } from './config/swagger.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Status endpoint
 *     description: Checks if the Weather API backend is running.
 *     responses:
 *       200:
 *         description: Success message
 */
app.get('/status', (req, res) => {
  res.json({
    message: 'Weather API Backend Running'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the uptime and operational status of the service.
 *     responses:
 *       200:
 *         description: Service is healthy
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime()
  });
});

logger.info('Weather API Backend initialized successfully');
app.use('/api/weather', weatherRoutes);
setupSwagger(app);
app.use(errorHandler);

export default app;