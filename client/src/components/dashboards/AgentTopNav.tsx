import React, { useRef, useState, useEffect } from 'react';
import { Bell, Settings, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clearStoredUser, getStoredUser } from '../../utils/auth';
import { getUnreadNotificationCount, mockNotifications } from '../../utils/mockData';

const AgentTopNav: React.FC = () => {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = mockNotifications.filter((n) => n.userId === user?.id);
  const unreadCount = user ? getUnreadNotificationCount(user.id) : 0;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const logout = () => {
    clearStoredUser();
    navigate('/signin');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img src="/FS.png" alt="FieldScope" className="h-10 w-10 object-contain" />
        <span className="text-2xl font-bold text-[#008800] hidden sm:block">FieldScope</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="text-[#9A7B4F]" size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-100 ${!n.read ? 'bg-green-50' : ''}`}>
                      <p className="font-semibold text-sm text-gray-900">{n.title}</p>
                      <p className="text-sm text-gray-600">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-sm text-gray-500">No notifications found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-[#9A7B4F] text-[#FFFDD0] text-xs font-semibold">
                  Agent
                </span>
              </div>

              <div className="py-2">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700">
                  <User size={18} /> Profile
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700">
                  <Settings size={18} /> Settings
                </Link>
                <Link to="/agent/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </div>

              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentTopNav;