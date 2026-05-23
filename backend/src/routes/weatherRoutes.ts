import express from 'express';
import weatherController from '../controllers/weatherController.js';

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
router.get('/', weatherController.getWeather);

/**
 * @swagger
 * /api/weather/today:
 *   get:
 *     summary: Get today's weather details
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
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data by hourly
 */
router.get('/today', weatherController.getTodayWeather);
    
export default router;