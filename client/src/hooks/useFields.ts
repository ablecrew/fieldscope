import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { Field } from '../utils/types';

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/fields/');
      setFields(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load fields');
    } finally {
      setLoading(false);
    }
  }, []);

  const createField = async (data: Partial<Field>) => {
    const res = await api.post('/fields/', data);
    setFields((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateField = async (id: string, data: Partial<Field>) => {
    const res = await api.put(`/fields/${id}/`, data);
    setFields((prev) => prev.map((f) => (f.id === id ? res.data : f)));
    return res.data;
  };

  const deleteField = async (id: string) => {
    await api.delete(`/fields/${id}/`);
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const archiveField = async (id: string) => {
    await api.post(`/fields/${id}/archive/`);
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_archived: !f.is_archived } : f))
    );
  };

  useEffect(() => { fetchFields(); }, [fetchFields]);

  return { fields, loading, error, fetchFields, createField, updateField, deleteField, archiveField };
};