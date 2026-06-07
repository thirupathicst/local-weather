import { RawWeatherPayloadDTO, WeatherIntervalReading, DailyWeatherSchedule, DailyWeatherSummary, ForecastType } from '../DTO/weatherModel.js';

export class WeatherTransformerService {
    private readonly INTERVAL_MINUTES: number;
    private readonly READINGS_PER_DAY: number = 24 * 60 * 60 * 1000;
    
    constructor(forecastType: ForecastType = '1hr_0p125') {
        switch (forecastType) {
            case '3hr_0p125':
                this.INTERVAL_MINUTES = 180;
                break;
            case '6hr_0p125':
                this.INTERVAL_MINUTES = 360;
                break;
            default:
                this.INTERVAL_MINUTES = 60;
        }
    }

    private getDayNumber(date: Date, startOfForecast: Date): number {
        const startUTC = Date.UTC(startOfForecast.getFullYear(), startOfForecast.getMonth(), startOfForecast.getDate());
        const current = new Date(date);
        const currentUTC = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());

        const dayNumber = Math.floor((currentUTC - startUTC) / this.READINGS_PER_DAY) + 1;
        return dayNumber;
    }

    public transformPayload(dto: RawWeatherPayloadDTO, currentTimestamp: Date): WeatherIntervalReading[] {
        const readings: WeatherIntervalReading[] = [];
        currentTimestamp.setHours(5, 30, 0, 0);
        const startOfForecast = new Date(currentTimestamp);
        const totalDataPoints = dto.temp.length;

        for (let i = 0; i < totalDataPoints; i++) {
            const parseItem = (value: number | string): number => {
                if (typeof value === 'string') {
                    const parsed = parseFloat(value);
                    return isNaN(parsed) ? NaN : parsed;
                }
                return value ?? 0;
            }

            const dayNumber = this.getDayNumber(currentTimestamp, startOfForecast);
            const hours = currentTimestamp.getHours().toString().padStart(2, '0');
            const minutes = currentTimestamp.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            readings.push({
                timestamp: new Date(currentTimestamp),
                timeString,
                dayNumber,
                rainfallMm: parseItem(dto.apcp[i]),
                temperatureC: parseItem(dto.temp[i]),
                relativeHumidityPercent: parseItem(dto.rh[i]),
                cloudCoverPercent: parseItem(dto.tcdc[i]),
                windSpeedMs: parseItem(dto.wspd[i])
            });
            currentTimestamp.setMinutes(currentTimestamp.getMinutes() + this.INTERVAL_MINUTES);
        }
        return readings;
    }

    public groupByDay(readings: WeatherIntervalReading[]): DailyWeatherSchedule[] {
        const dailyMap: Map<number, WeatherIntervalReading[]> = new Map();

        readings.forEach(reading => {
            if (!dailyMap.has(reading.dayNumber)) {
                dailyMap.set(reading.dayNumber, []);
            }
            dailyMap.get(reading.dayNumber)?.push(reading);
        });

        return Array.from(dailyMap.entries()).map(([day, readings]) => ({ day, readings }));
    }


    public dailySummary(dailySchedules: DailyWeatherSchedule[]): DailyWeatherSummary[] {
        return dailySchedules.map(schedule => {
            const readings = schedule.readings;
            const tempMinC = Math.min(...readings.map(r => r.temperatureC));
            const tempMaxC = Math.max(...readings.map(r => r.temperatureC));
            const rainfallPercent = readings.reduce((sum, r) => sum + r.rainfallMm, 0) / readings.length;
            const relativeHumidityPercent = readings.reduce((sum, r) => sum + r.relativeHumidityPercent, 0) / readings.length;
            const cloudCoverPercent = readings.reduce((sum, r) => sum + r.cloudCoverPercent, 0) / readings.length;

            return {
                timestamp: readings[0].timestamp,
                tempMinC: parseFloat(tempMinC.toFixed(2)),
                tempMaxC: parseFloat(tempMaxC.toFixed(2)),
                rainfallPercent: parseFloat(rainfallPercent.toFixed(2)),
                relativeHumidityPercent: parseFloat(relativeHumidityPercent.toFixed(2)),
                cloudCoverPercent: parseFloat(cloudCoverPercent.toFixed(2))
            };
        });
    }
}