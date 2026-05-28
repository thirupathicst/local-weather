import express from 'express';
import { WeatherController } from '../controllers/weatherController.js';

const weatherControllerInstance = new WeatherController();

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
router.get('/', weatherControllerInstance.getWeather.bind(weatherControllerInstance));

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
router.get('/today', weatherControllerInstance.getTodayWeather.bind(weatherControllerInstance));


/** * @swagger
 * /api/weather/byDay:
 *   get:
 *     summary: Get weather details by day
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
 *         description: Weather data by day
 */
router.get('/byDay', weatherControllerInstance.getWeatherByDay.bind(weatherControllerInstance));
    
export default router;