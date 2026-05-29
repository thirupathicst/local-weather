export interface RawWeatherPayloadDTO {
  apcp: (number | string)[];         // Precipitation / Rainfall array (contains "NaN")
  temp: (number | string)[];         // Temperature array
  rh: (number | string)[];           // Relative Humidity array
  tcdc: (number | string)[];         // Total Cloud Cover array
  wspd100m: (number | string)[];     // Wind Speed at 100m array
}

export interface WeatherIntervalReading {
  timestamp: Date;
  timeString: string;                // e.g., "06:30", "08:00"
  dayNumber: number;                 // e.g., 1, 2, 3...
  rainfallMm: number;
  temperatureC: number;
  relativeHumidityPercent: number;
  cloudCoverPercent: number;
  windSpeedMs: number;
}

export interface DailyWeatherSchedule {
  day: number;
  readings: WeatherIntervalReading[];
}