import api from './api';

export const getAllDraws = async () => {
  const { data } = await api.get('/draws');
  return data;
};

export const getLatestDraw = async () => {
  const { data } = await api.get('/draws/latest');
  return data;
};

export const getDrawById = async (id) => {
  const { data } = await api.get(`/draws/${id}`);
  return data;
};
