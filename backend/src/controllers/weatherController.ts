import { Request, Response, NextFunction } from 'express';
import weatherService from '../services/weatherService.js';
import { WeatherTransformerService } from '../services/weatherTransformerService.js';
import { RawWeatherPayloadDTO } from '../DTO/weatherModel.js';

const weatherTransformerService = new WeatherTransformerService();
 
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
            let validDate = this.isValidDate(date as string);
            if (!validDate.result) {
                return res.status(400).json({
                    message: 'Invalid date format (DD-MM-YYYY expected)'
                });
            }
            let location = this.geoLocation(Number(lat), Number(lon));
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, validDate.dateObj!, 'G');
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
            let validDate = this.isValidDate(date as string);
            if (!validDate.result) {
                return res.status(400).json({
                    message: 'Invalid date format (DD-MM-YYYY expected)'
                });
            }
            let location = this.geoLocation(Number(lat), Number(lon));
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, validDate.dateObj!, 'N');
            res.status(200).json(weatherData);
        } catch (error) {
            next(error);
        }
    }

    private async getWeatherRaw(latValue: number, longValue: number, date: Date, type: 'G' | 'N'): Promise<any> {
        let result = await weatherService.fetchTodayWeather(latValue, longValue, this.getYesterdayYYYYMMDD(date));
        result = weatherTransformerService.transformPayload.bind(weatherTransformerService)(result as RawWeatherPayloadDTO, date);
        if (type === 'G') {
            result = weatherTransformerService.groupByDay.bind(weatherTransformerService)(result);
        }
        return result;
    }

    private geoLocation(lat: number, lon: number): { lat: number, lon: number } {
        const fixeVal = 0.125;
        const latValue = Number((Math.floor(lat / fixeVal) * fixeVal).toFixed(3));
        const longValue = Number((Math.floor(lon / fixeVal) * fixeVal).toFixed(3));
        return { lat: latValue, lon: longValue };
    }

    private isValidDate(date: string): { result: boolean, dateObj?: Date } {
        const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
        const match = date.match(regex);
        if (!match) return { result: false };
        const [, day, month, year] = match;
        const newDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        return {
            result: (
                newDate.getFullYear() === Number(year) &&
                newDate.getMonth() === Number(month) - 1 &&
                newDate.getDate() === Number(day)
            ),
            dateObj: newDate
        };
    }

    private getYesterdayYYYYMMDD(date: Date): string {
        let targetDate = new Date(date);
        //targetDate.setDate(targetDate.getDate() - 1);   
        return `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, "0")}${String(targetDate.getDate()).padStart(2, "0")}`;
    }
}