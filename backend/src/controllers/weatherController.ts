import { Request, Response, NextFunction } from 'express';
import weatherService from '../services/externalService.js';
import { WeatherTransformerService } from '../services/weatherTransformerService.js';
import { ForecastType, RawWeatherPayloadDTO } from '../DTO/weatherModel.js';
import { retryAsync } from '../utils/retry.js';

const weatherTransformerService = new WeatherTransformerService();
 
export class WeatherController {
    constructor() { }

    private getTransformerService(forecastType: ForecastType): WeatherTransformerService {
        return new WeatherTransformerService(forecastType ?? '1hr_0p125');
    }

    public async getWeather(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lon, days } = req.query;
        
            if (!lat || !lon) {
                return res.status(400).json({
                    message: 'Latitude and longitude required'
                });
            }
            let location = this.geoLocation(Number(lat), Number(lon));
            
            const forecastType: ForecastType = days === '3' ? '3hr_0p125' : days === '6' ? '6hr_0p125' : '1hr_0p125';
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, new Date(), 'N', forecastType);
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

    public async getWeatherSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lon, date } = req.query;
            if (!lat || !lon) {
                return res.status(400).json({
                    message: 'Latitude and longitude required'
                });
            }
            let location = this.geoLocation(Number(lat), Number(lon));
            let weatherData = await this.getWeatherRaw(location.lat, location.lon, new Date(), 'G', '3hr_0p125');
            weatherData = weatherTransformerService.dailySummary.bind(weatherTransformerService)(weatherData);
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
            weatherData = weatherData.filter((reading: any) => reading.timestamp.toLocaleDateString() === new Date().toLocaleDateString());
            res.status(200).json(weatherData);
        } catch (error) {
            next(error);
        }
    }

    private async getWeatherRaw(latValue: number, longValue: number, date: Date, type: 'G' | 'N', forecastType?: ForecastType): Promise<any> {
        let result: any;
        if (forecastType) {
            result = await this.reTryWithPreviousDay(latValue, longValue, date, forecastType!);
            const transformerService = this.getTransformerService(forecastType);
            result = transformerService.transformPayload.bind(transformerService)(result as RawWeatherPayloadDTO, date);
            if (type === 'G') {
              return transformerService.groupByDay.bind(transformerService)(result);
            }
        } else {
            result = await this.reTryWithPreviousDay(latValue, longValue, date, forecastType!);
            result = weatherTransformerService.transformPayload.bind(weatherTransformerService)(result as RawWeatherPayloadDTO, date);
        }
        
        if (type === 'G') {
            result = weatherTransformerService.groupByDay.bind(weatherTransformerService)(result);
        }
        return result;
    }

    private async reTryWithPreviousDay(latValue: number, longValue: number, date: Date, forecastType: ForecastType): Promise<any> {
        let attemptIndex = 0;
        return await retryAsync(
            async () => {
                const queryDate = attemptIndex === 0
                    ? this.getFormattedYYYYMMDDDate(date)
                    : this.getFormattedYYYYMMDDDate(new Date(date.setDate(date.getDate() - 1)));
                attemptIndex += 1;

                const response = await weatherService.externalService(latValue, longValue, queryDate, forecastType);
                if ('error' in response) {
                    throw new Error(response.error);
                }
                return response;
            },
            { maxRetries: 3, initialDelayMs: 1000 }
        );
    }

    private geoLocation(lat: number, lon: number): { lat: number, lon: number } {
        const fixeVal = 0.125;
        const latValue = Number((Math.floor(lat / fixeVal) * fixeVal).toFixed(3));
        const longValue = Number((Math.floor(lon / fixeVal) * fixeVal).toFixed(3));
        return { lat: latValue, lon: longValue };
    }

    private isValidDate(date: string): { result: boolean, dateObj?: Date } {
        try {
            const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
            if(!date) {
                return { result: false };
            }
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
        } catch (error) {
            return { result: false };
        }
    }

    private getFormattedYYYYMMDDDate(date: Date): string {
        let targetDate = new Date(date);
        targetDate.setDate(targetDate.getDate() - 1);
        return `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, "0")}${String(targetDate.getDate()).padStart(2, "0")}`;
    }
}