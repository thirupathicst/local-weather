import axios from 'axios';
import { ForecastType } from '../DTO/weatherModel.js';

const externalService = async (lat: number, lon: number, date: string, forecastType: ForecastType='1hr_0p125') => {
  const _url = `https://mausamgram.imd.gov.in/test4_mme.php?lat_gfs=${lat}&lon_gfs=${lon}&date=${date}00_${forecastType}`;
  const response = await axios.get(_url);
  return response.data;
};
export default {
  externalService
};