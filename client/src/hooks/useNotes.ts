import { useState, useCallback } from 'react';
import api from '../lib/axios';
import type { Note } from '../utils/types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async (fieldId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/fields/${fieldId}/notes/`);
      setNotes(res.data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (fieldId: string, content: string) => {
    const res = await api.post(`/fields/${fieldId}/notes/`, { content });
    setNotes((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateNote = async (noteId: string, content: string) => {
    const res = await api.put(`/fields/notes/${noteId}/`, { content });
    setNotes((prev) => prev.map((n) => (n.id === noteId ? res.data : n)));
    return res.data;
  };

  const deleteNote = async (noteId: string) => {
    await api.delete(`/fields/notes/${noteId}/`);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  return { notes, loading, fetchNotes, addNote, updateNote, deleteNote, setNotes };
};