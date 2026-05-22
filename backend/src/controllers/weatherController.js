import { fetchWeather } from '../services/weatherService.js';

export const getWeather = async (req, res, next) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                message: 'Latitude and longitude required'
            });
        }

        const weatherData = await fetchWeather(lat, lon);
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
};
