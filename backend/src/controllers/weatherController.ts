import { Request, Response, NextFunction } from 'express';
import weatherService from '../services/weatherService.js';

const getWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                message: 'Latitude and longitude required'
            });
        }

        const weatherData = await weatherService.fetchWeather(Number(lat), Number(lon));
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
};

const getTodayWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lat, lon, date } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                message: 'Latitude and longitude required'
            });
        }
        const targetDate = typeof date === 'string' ? new Date(date) : new Date();
        const weatherDate = getYesterdayYYYYMMDD(targetDate);
        const weatherData = await weatherService.fetchTodayWeather(Number(Number(lat).toFixed(3)), Number(Number(lon).toFixed(3)), weatherDate);
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
};

function getYesterdayYYYYMMDD(date: Date): string {
    const d = new Date(date); 
    //d.setDate(d.getDate() - 1);

    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export default {
    getWeather,
    getTodayWeather
};