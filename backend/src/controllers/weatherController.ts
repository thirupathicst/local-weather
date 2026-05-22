import { Request, Response, NextFunction } from 'express';
import { fetchWeather } from '../services/weatherService.js';

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                message: 'Latitude and longitude required'
            });
        }

        const weatherData = await fetchWeather(Number(lat), Number(lon));
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
};
