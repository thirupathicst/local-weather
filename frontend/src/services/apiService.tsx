import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const getCurrent = async (lat: number, lon: number) => {
  const _url = `${apiUrl}weather?lat=${lat}&lon=${lon}`;
  const response = await axios.get(_url);
  return response.data;
};

const getSummary = async (lat: number, lon: number) => {
  const _url = `${apiUrl}weather/summary?lat=${lat}&lon=${lon}`;
  const response = await axios.get(_url);
  return response.data;
};

const getHourly = async (lat: number, lon: number) => {
  const _url = `${apiUrl}weather/today?lat=${lat}&lon=${lon}&date=22-06-2026`;
  const response = await axios.get(_url);
  return response.data;
}

export default {
    getCurrent, getSummary, getHourly
}

