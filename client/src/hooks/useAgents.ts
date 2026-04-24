import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { User } from '../utils/types';

export const useAgents = () => {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await api.get('/auth/agents/');
      setAgents(res.data);
    } catch { /* fail */ } finally {
      setLoading(false);
    }
  }, []);

  const createAgent = async (data: { email: string; full_name: string; password?: string }) => {
    const res = await api.post('/auth/agents/', { ...data, role: 'agent' });
    setAgents((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateAgent = async (id: string, data: Partial<User>) => {
    const res = await api.put(`/auth/agents/${id}/`, data);
    setAgents((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    return res.data;
  };

  const deleteAgent = async (id: string) => {
    await api.delete(`/auth/agents/${id}/`);
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const archiveAgent = async (id: string) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    const res = await api.put(`/auth/agents/${id}/`, { is_archived: !agent.is_archived });
    setAgents((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  };

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  return { agents, loading, fetchAgents, createAgent, updateAgent, deleteAgent, archiveAgent };
};