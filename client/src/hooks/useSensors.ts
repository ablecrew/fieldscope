import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { Sensor } from '../utils/types';

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSensors = useCallback(async () => {
    try {
      const res = await api.get('/sensors/');
      setSensors(res.data);
    } catch { /* fail */ } finally {
      setLoading(false);
    }
  }, []);

  const createSensor = async (data: Partial<Sensor>) => {
    const res = await api.post('/sensors/', data);
    setSensors((prev) => [res.data, ...prev]);
    return res.data;
  };

  const deleteSensor = async (id: string) => {
    await api.delete(`/sensors/${id}/`);
    setSensors((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => { fetchSensors(); }, [fetchSensors]);

  return { sensors, loading, createSensor, deleteSensor, fetchSensors };
};