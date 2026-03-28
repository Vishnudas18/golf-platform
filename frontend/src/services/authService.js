import api from './api';

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post('/auth/refresh-token');
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await api.patch('/auth/profile', userData);
  return data;
};
