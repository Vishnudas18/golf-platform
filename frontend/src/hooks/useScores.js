import { useState, useEffect, useCallback } from 'react';
import * as scoreService from '../services/scoreService';
import toast from 'react-hot-toast';

export const useScores = () => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await scoreService.getScores();
      setScores(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scores');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addScore = async (scoreData) => {
    try {
      const { data } = await scoreService.addScore(scoreData);
      setScores(data);
      toast.success('Score added successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add score';
      toast.error(msg);
      throw err;
    }
  };

  const editScore = async (id, scoreData) => {
    try {
      const { data } = await scoreService.editScore(id, scoreData);
      setScores(data);
      toast.success('Score updated successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update score';
      toast.error(msg);
      throw err;
    }
  };

  const deleteScore = async (id) => {
    try {
      const { data } = await scoreService.deleteScore(id);
      setScores(data);
      toast.success('Score deleted');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete score';
      toast.error(msg);
      throw err;
    }
  };

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return {
    scores,
    isLoading,
    error,
    fetchScores,
    addScore,
    editScore,
    deleteScore,
  };
};
