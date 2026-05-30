import { RawWeatherPayloadDTO, WeatherIntervalReading, DailyWeatherSchedule } from '../DTO/weatherModel.js';

export class WeatherTransformerService {
    private readonly INTERVAL_MINUTES = 60; // 1 hour
    private readonly READINGS_PER_DAY = 24;  // 24 hours / 1 hour

    public transformPayload(dto: RawWeatherPayloadDTO, currentTimestamp: Date): WeatherIntervalReading[] {
        const readings: WeatherIntervalReading[] = [];
        //const currentTimestamp = new Date(date);
        currentTimestamp.setHours(5, 30, 0, 0);
        const totalDataPoints = dto.temp.length;

        for (let i = 0; i < totalDataPoints; i++) { 
            const parseItem = (value: number | string): number => { 
                if (typeof value === 'string') { 
                    const parsed = parseFloat(value);
                    return isNaN(parsed) ? NaN : parsed;
                }
                return value??0;
            }

            const index = i - 1;
            let dayNumber = Math.floor(index / this.READINGS_PER_DAY) + 1;
            let hours = currentTimestamp.getHours().toString().padStart(2, '0');
            let minutes = currentTimestamp.getMinutes().toString().padStart(2, '0');
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
}