import { useState, useEffect, useCallback } from 'react';
import * as drawService from '../services/drawService';

export const useDraw = () => {
  const [draws, setDraws] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDraws = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await drawService.getAllDraws();
      setDraws(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch draws');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLatest = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await drawService.getLatestDraw();
      setLatestDraw(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch latest draw');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
    fetchDraws();
  }, [fetchLatest, fetchDraws]);

  return {
    draws,
    latestDraw,
    isLoading,
    error,
    fetchDraws,
    fetchLatest,
  };
};
