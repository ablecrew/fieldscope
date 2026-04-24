import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { Activity } from '../utils/types';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get('/activities/');
      setActivities(res.data);
    } catch { /* fail */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  return { activities, loading, fetchActivities };
};