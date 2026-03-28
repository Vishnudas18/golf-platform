import api from './api';

export const getAllUsers = async (params) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/admin/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const simulateDraw = async (drawType) => {
  const { data } = await api.post('/admin/draws/simulate', { drawType });
  return data;
};

export const publishDraw = async (id) => {
  const { data } = await api.post(`/admin/draws/${id}/publish`);
  return data;
};

export const addCharity = async (formData) => {
  const { data } = await api.post('/admin/charities', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateCharity = async (id, formData) => {
  const { data } = await api.put(`/admin/charities/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const editUserScore = async (userId, scores) => {
  const { data } = await api.put(`/admin/users/${userId}/scores`, { scores });
  return data;
};

export const deleteCharity = async (id) => {
  const { data } = await api.delete(`/admin/charities/${id}`);
  return data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/admin/analytics');
  return data;
};

export const getAllWinners = async (params) => {
  const { data } = await api.get('/admin/winners', { params });
  return data;
};

export const verifyWinner = async (id, verificationData) => {
  const { data } = await api.patch(`/admin/winners/${id}/verify`, verificationData);
  return data;
};

export const markPayout = async (id) => {
  const { data } = await api.patch(`/admin/winners/${id}/payout`);
  return data;
};

export const getSettings = async () => {
  const { data } = await api.get('/admin/settings');
  return data;
};

export const updateSettings = async (settingsData) => {
  const { data } = await api.put('/admin/settings', settingsData);
  return data;
};
