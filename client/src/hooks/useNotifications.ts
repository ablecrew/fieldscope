import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { Notification } from '../utils/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const [nRes, cRes] = await Promise.all([
        api.get('/notifications/'),
        api.get('/notifications/unread-count/'),
      ]);
      setNotifications(nRes.data);
      setUnreadCount(cRes.data.unread_count);
    } catch { /* fail silently */ }
  }, []);

  const markAsRead = async (id: string) => {
    await api.post(`/notifications/${id}/read/`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, unreadCount, fetchNotifications, markAsRead };
};