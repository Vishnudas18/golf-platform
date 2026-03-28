import api from './api';

export const getAllCharities = async (params) => {
  const { data } = await api.get('/charities', { params });
  return data;
};

export const getCharityBySlug = async (slug) => {
  const { data } = await api.get(`/charities/${slug}`);
  return data;
};

export const makeDonation = async (id, amount) => {
  const { data } = await api.post(`/charities/${id}/donate`, { amount });
  return data;
};
