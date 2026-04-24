import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { Task } from '../utils/types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch { /* fail */ } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (data: Partial<Task>) => {
    const res = await api.post('/tasks/', data);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const res = await api.put(`/tasks/${id}/`, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}/`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return { tasks, loading, createTask, updateTask, deleteTask, fetchTasks };
};