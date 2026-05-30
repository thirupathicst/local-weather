export interface RawWeatherPayloadDTO {
  apcp: (number | string)[];         // Precipitation / Rainfall
  temp: (number | string)[];         // Temperature
  rh: (number | string)[];           // Relative Humidity
  tcdc: (number | string)[];         // Total Cloud Cover
  //wspd100m: (number | string)[];     // Wind Speed at 100m
  wspd: (number | string)[];          // Wind Speed at 10m
}

export interface WeatherIntervalReading {
  timestamp: Date;
  timeString: string;
  dayNumber: number;
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