import axios from 'axios';

const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  );

  return response.data;
};

const fetchTodayWeather = async (lat: number, lon: number, date: string, hour: string = "1hr_0p125") => {
  const response = await axios.get(
    `https://mausamgram.imd.gov.in/test4_mme.php?lat_gfs=${lat}&lon_gfs=${lon}&date=${date}_${hour}`
  );

  return response.data;
};

export default {
  fetchWeather,
  fetchTodayWeather
};