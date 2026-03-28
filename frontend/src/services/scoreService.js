import api from './api';

export const getScores = async () => {
  const { data } = await api.get('/scores');
  return data;
};

export const addScore = async (scoreData) => {
  const { data } = await api.post('/scores', scoreData);
  return data;
};

export const editScore = async (id, scoreData) => {
  const { data } = await api.put(`/scores/${id}`, scoreData);
  return data;
};

export const deleteScore = async (id) => {
  const { data } = await api.delete(`/scores/${id}`);
  return data;
};
