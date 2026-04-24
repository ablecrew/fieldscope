import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { DashboardSummary } from '../utils/types';

export const useAnalytics = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get('/fields/summary/');
      setSummary(res.data);
    } catch { /* fail */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  return { summary, loading, refetch: fetchSummary };
};