import express from 'express';
import { getWeather } from '../controllers/weatherController.js';

const router = express.Router();

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get weather details
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Weather data
 */
router.get('/', getWeather);
    
export default router;