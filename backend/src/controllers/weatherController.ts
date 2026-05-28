import { Request, Response, NextFunction } from 'express';
import weatherService from '../services/weatherService.js';
import { WeatherTransformerService } from '../services/weather-transformer.service.js';
import { RawWeatherPayloadDTO } from '../DTO/weather.model.js';

export class WeatherController {
    constructor() { }

    public async getWeather(req: Request, res: Response, next: NextFunction) {
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
    }

    public async getWeatherByDay(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lon, date } = req.query;
            if (!lat || !lon) {
                return res.status(400).json({
                    message: 'Latitude and longitude required'
                });
            }
            let targetDate = typeof date === 'string' ? new Date(date) : new Date();
            const weatherDate = this.getYesterdayYYYYMMDD(targetDate);
            let location = this.geoLocation(Number(lat), Number(lon));
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, weatherDate, 'G');
            res.status(200).json(weatherData);
        } catch (error) {
            next(error);
        }
    }

    public async getTodayWeather(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lon, date } = req.query;
            if (!lat || !lon) {
                return res.status(400).json({
                    message: 'Latitude and longitude required'
                });
            }
            let targetDate = typeof date === 'string' ? new Date(date) : new Date();
            const weatherDate = this.getYesterdayYYYYMMDD(targetDate);
            let location = this.geoLocation(Number(lat), Number(lon));
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, weatherDate, 'N');
            res.status(200).json(weatherData);
        } catch (error) {
            next(error);
        }
    }

    private async getWeatherRaw(latValue: number, longValue: number, weatherDate: string, type: 'G' | 'N'): Promise<any> {
        let result = await weatherService.fetchTodayWeather(latValue, longValue, weatherDate);
        const service = new WeatherTransformerService();
        result = service.transformPayload(result as RawWeatherPayloadDTO, '2026-05-28');
        if (type === 'G') {
            result = service.groupByDay(result);
        }
        return result;
    }

    private geoLocation(lat: number, lon: number): { lat: number, lon: number } {
        const fixeVal = 0.125;
        const latValue = Number((Math.floor(lat / fixeVal) * fixeVal).toFixed(3));
        const longValue = Number((Math.floor(lon / fixeVal) * fixeVal).toFixed(3));
        return { lat: latValue, lon: longValue };
    }

    private getYesterdayYYYYMMDD(date: Date): string {
        const d = new Date(date);
        //d.setDate(d.getDate() - 1);   
        return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    }
}