import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, CheckSquare, BarChart2,
  HelpCircle, Bell, User, Settings, LogOut,
  ChevronLeft, ChevronRight, ChevronDown, Plus,
  Pencil, Trash2, Eye, Save, X, Search,
  AlertTriangle, CheckCircle, Clock, Leaf,
  TrendingUp, Activity, Menu, MapPin, Calendar,
  SlidersHorizontal, Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFields } from '../../hooks/useFields';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotes } from '../../hooks/useNotes';
import { useTasks } from '../../hooks/useTasks';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { Field } from '../../utils/types';

/* ─── helpers ──────────────────────────────────────── */
const stageColors: Record<string, string> = {
  Planted: 'bg-yellow-100 text-yellow-800',
  Growing: 'bg-blue-100 text-blue-800',
  Ready: 'bg-green-100 text-green-800',
  Harvested: 'bg-gray-100 text-gray-800',
};

const statusCfg: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Active:    { color: 'text-green-700',  bg: 'bg-green-100',  icon: <CheckCircle  className="w-3 h-3" /> },
  'At Risk': { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <AlertTriangle className="w-3 h-3" /> },
  Completed: { color: 'text-gray-700',   bg: 'bg-gray-100',   icon: <Clock         className="w-3 h-3" /> },
};

const sidebarNav = [
  { id: 'overview',  label: 'Overview',         icon: LayoutDashboard },
  { id: 'fields',    label: 'Field Management', icon: Map },
  { id: 'tasks',     label: 'Tasks',            icon: CheckSquare },
  { id: 'analytics', label: 'Analytics',        icon: BarChart2 },
];

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtTime = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (diff < 1) return 'Just now';
  if (diff < 24) return `${diff}h ago`;
  return `${Math.floor(diff / 24)}d ago`;
};

const FSLogo = (size = 36) => (
  <img
    src="/FS.png"
    alt="FS"
    className={`h-[${size}px] w-[${size}px] object-contain`}
    style={{ height: size, width: size }}
    onError={(e) => {
      (e.target as HTMLImageElement).src =
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Crect fill='%23008800' width='${size}' height='${size}' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat' font-size='${Math.round(size * 0.44)}' fill='%23FFFDD0' font-weight='bold'%3EFS%3C/text%3E%3C/svg%3E`;
    }}
  />
);

/* ─── component ───────────────────────────────────── */
const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* hooks */
  const { fields, loading: fieldsLoading, createField, updateField, deleteField } = useFields();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { notes, fetchNotes, addNote, updateNote, deleteNote } = useNotes();
  const { tasks, createTask, updateTask: patchTask } = useTasks();
  const { summary, loading: summaryLoading } = useAnalytics();

  /* layout */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  /* dropdowns */
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* field form */
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fieldForm, setFieldForm] = useState({
    name: '', crop_type: '', planting_date: '',
    current_stage: 'Planted' as Field['current_stage'],
    location: '', size_hectares: '',
  });

  /* notes */
  const [activeFieldNotes, setActiveFieldNotes] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  /* filters */
  const [searchQ, setSearchQ] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  /* close dropdowns */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* load notes when field expanded */
  useEffect(() => {
    if (activeFieldNotes) fetchNotes(activeFieldNotes);
  }, [activeFieldNotes, fetchNotes]);

  /* computed */
  const stats = summary || {
    total_fields: 0,
    status_breakdown: { active: 0, at_risk: 0, completed: 0 },
    stage_breakdown: { Planted: 0, Growing: 0, Ready: 0, Harvested: 0 },
    insights: [],
  };

  const filteredFields = fields.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      f.crop_type.toLowerCase().includes(searchQ.toLowerCase());
    const matchStage = stageFilter === 'All' || f.current_stage === stageFilter;
    return matchSearch && matchStage;
  });

  /* ── field CRUD ── */
  const openAdd = () => {
    setEditingField(null);
    setFieldForm({ name: '', crop_type: '', planting_date: '', current_stage: 'Planted', location: '', size_hectares: '' });
    setShowFieldForm(true);
  };

  const openEdit = (f: Field) => {
    setEditingField(f);
    setFieldForm({
      name: f.name, crop_type: f.crop_type, planting_date: f.planting_date,
      current_stage: f.current_stage, location: f.location || '',
      size_hectares: f.size_hectares?.toString() || '',
    });
    setShowFieldForm(true);
  };

  const handleSaveField = async () => {
    if (!fieldForm.name || !fieldForm.crop_type || !fieldForm.planting_date) return;
    setSaving(true);
    try {
      const payload = {
        ...fieldForm,
        size_hectares: fieldForm.size_hectares ? parseFloat(fieldForm.size_hectares) : null,
      };
      if (editingField) {
        await updateField(editingField.id, payload);
      } else {
        await createField(payload);
      }
      setShowFieldForm(false);
    } catch { /* toast error */ } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!window.confirm('Delete this field?')) return;
    await deleteField(id);
  };

  /* ── note CRUD ── */
  const handleAddNote = async (fieldId: string) => {
    if (!noteContent.trim()) return;
    await addNote(fieldId, noteContent.trim());
    setNoteContent('');
  };

  const handleSaveNoteEdit = async (noteId: string) => {
    await updateNote(noteId, editNoteContent);
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  /* ════════════════ SIDEBAR ════════════════ */
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300 h-full`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {FSLogo(36)}
          {(sidebarOpen || mobile) && <span className="font-bold text-lg text-primary-cream">FieldScope</span>}
        </div>
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); if (mobile) setMobileSidebar(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-primary-green text-primary-cream' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(sidebarOpen || mobile) && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-2 border-t border-gray-700">
        <button onClick={() => { setActiveTab('support'); if (mobile) setMobileSidebar(false); }}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'support' ? 'bg-primary-green text-primary-cream' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobile) && <span className="font-medium text-sm">Support</span>}
        </button>
      </div>
    </aside>
  );

  /* ════════════════ TOPNAV ════════════════ */
  const TopNav = () => (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileSidebar(true)} className="lg:hidden text-gray-600 hover:text-primary-green">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">{FSLogo(32)}<span className="font-bold text-primary-green hidden sm:block">FieldScope</span></div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 text-gray-600 hover:text-primary-green">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                <span className="text-xs text-gray-500">{unreadCount} unread</span>
              </div>
              {notifications.length > 0 ? notifications.slice(0, 8).map((n) => (
                <button key={n.id} onClick={() => markAsRead(n.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-l-4 ${n.is_read ? 'border-transparent' : 'border-primary-green bg-green-50'}`}>
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtTime(n.created_at)}</p>
                </button>
              )) : <p className="text-sm text-gray-500 px-4 py-6 text-center">No notifications</p>}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              : <div className="h-9 w-9 rounded-full bg-primary-green flex items-center justify-center text-primary-cream font-semibold">{user?.full_name?.charAt(0)}</div>}
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-green text-primary-cream text-xs rounded-full">Field Agent</span>
              </div>
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><User className="w-4 h-4 mr-3" />Profile</button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Settings className="w-4 h-4 mr-3" />Settings</button>
                <button onClick={() => setActiveTab('overview')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><LayoutDashboard className="w-4 h-4 mr-3" />Dashboard</button>
              </div>
              <div className="border-t border-gray-100 pt-1">
                <button onClick={() => { logout(); navigate('/signin'); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4 mr-3" />Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  /* ════════════════ LOADING SPINNER ════════════════ */
  const Spinner = () => (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
    </div>
  );

  /* ════════════════ OVERVIEW TAB ════════════════ */
  const OverviewTab = () => {
    if (summaryLoading) return <Spinner />;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}</h2>
          <p className="text-gray-500 mt-1">Here's an overview of your assigned fields</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Fields', value: stats.total_fields, icon: <Map className="w-6 h-6" />, grad: 'from-green-500 to-green-700' },
            { label: 'Active', value: stats.status_breakdown.active, icon: <CheckCircle className="w-6 h-6" />, grad: 'from-blue-500 to-blue-700' },
            { label: 'At Risk', value: stats.status_breakdown.at_risk, icon: <AlertTriangle className="w-6 h-6" />, grad: 'from-yellow-500 to-yellow-700' },
            { label: 'Completed', value: stats.status_breakdown.completed, icon: <Activity className="w-6 h-6" />, grad: 'from-gray-500 to-gray-700' },
          ].map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.grad} text-white rounded-2xl p-5 shadow-lg`}>
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-white/80">{c.label}</p><p className="text-3xl font-bold mt-1">{c.value}</p></div>
                <div className="bg-white/20 p-2 rounded-lg">{c.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Status Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Active', count: stats.status_breakdown.active, color: 'bg-green-500' },
                { label: 'At Risk', count: stats.status_breakdown.at_risk, color: 'bg-yellow-500' },
                { label: 'Completed', count: stats.status_breakdown.completed, color: 'bg-gray-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-500">{item.count}/{stats.total_fields}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: stats.total_fields ? `${(item.count / stats.total_fields) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Useful Insights</h3>
            <div className="space-y-3">
              {stats.insights.length > 0 ? stats.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              )) : (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Leaf className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">Growing season is active. Keep monitoring field conditions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Stage Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['Planted', 'Growing', 'Ready', 'Harvested'] as const).map((stage) => (
              <div key={stage} className={`p-4 rounded-xl text-center ${stageColors[stage]}`}>
                <p className="text-2xl font-bold">{stats.stage_breakdown[stage] || 0}</p>
                <p className="text-xs font-medium mt-1">{stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fields */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">My Recent Fields</h3>
            <button onClick={() => setActiveTab('fields')} className="text-sm text-primary-green hover:underline font-medium">View All</button>
          </div>
          {fieldsLoading ? <Spinner /> : (
            <div className="space-y-3">
              {fields.slice(0, 4).map((field) => {
                const sc = statusCfg[field.status] || statusCfg.Active;
                return (
                  <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-primary-cream"><Leaf className="w-5 h-5" /></div>
                      <div><p className="font-semibold text-gray-900 text-sm">{field.name}</p><p className="text-xs text-gray-500">{field.crop_type}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[field.current_stage]}`}>{field.current_stage}</span>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.icon}{field.status}</span>
                      <Link to={`/field/${field.id}`} className="p-1.5 text-gray-400 hover:text-primary-green"><Eye className="w-4 h-4" /></Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ════════════════ FIELDS TAB ════════════════ */
  const FieldsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-gray-900">Field Management</h2><p className="text-gray-500 text-sm mt-1">Manage your assigned fields</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />Add Field
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search fields..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
            <option value="All">All Stages</option>
            {['Planted', 'Growing', 'Ready', 'Harvested'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Field Form Modal */}
      {showFieldForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingField ? 'Edit Field' : 'Add New Field'}</h3>
              <button onClick={() => setShowFieldForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Name *</label>
                  <input value={fieldForm.name} onChange={(e) => setFieldForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="North Valley Field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type *</label>
                  <input value={fieldForm.crop_type} onChange={(e) => setFieldForm((p) => ({ ...p, crop_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Wheat" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size (ha)</label>
                  <input value={fieldForm.size_hectares} onChange={(e) => setFieldForm((p) => ({ ...p, size_hectares: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="25.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date *</label>
                  <input type="date" value={fieldForm.planting_date} onChange={(e) => setFieldForm((p) => ({ ...p, planting_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={fieldForm.location} onChange={(e) => setFieldForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Plot A1" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stage</label>
                  <select value={fieldForm.current_stage} onChange={(e) => setFieldForm((p) => ({ ...p, current_stage: e.target.value as Field['current_stage'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
                    {['Planted', 'Growing', 'Ready', 'Harvested'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveField} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingField ? 'Update Field' : 'Add Field'}
              </button>
              <button onClick={() => setShowFieldForm(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary-brown text-primary-brown rounded-xl font-medium hover:bg-primary-brown hover:text-primary-cream transition-colors">
                <X className="w-4 h-4" />Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Cards */}
      {fieldsLoading ? <Spinner /> : filteredFields.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <Map className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">No fields found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFields.map((field) => {
            const sc = statusCfg[field.status] || statusCfg.Active;
            const fieldNotes = activeFieldNotes === field.id ? notes : [];
            return (
              <div key={field.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="gradient-green-brown p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{field.name}</h3>
                      <p className="text-sm text-gray-100 flex items-center gap-1 mt-1"><Leaf className="w-3 h-3" />{field.crop_type}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.icon}{field.status}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[field.current_stage]}`}>{field.current_stage}</span>
                    {field.location && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{field.location}</span>}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3 h-3" />Planted: {fmt(field.planting_date)}</p>
                  {field.size_hectares && <p className="text-xs text-gray-500">Size: {field.size_hectares} ha</p>}

                  {/* Notes */}
                  <div className="pt-3 border-t border-gray-100">
                    <button onClick={() => setActiveFieldNotes(activeFieldNotes === field.id ? null : field.id)}
                      className="text-xs font-medium text-primary-green hover:underline">
                      {activeFieldNotes === field.id ? 'Hide notes' : 'Show notes'}
                    </button>

                    {activeFieldNotes === field.id && (
                      <div className="mt-3 space-y-2">
                        {fieldNotes.map((note) => (
                          <div key={note.id} className="p-2 bg-gray-50 rounded-lg text-xs">
                            {editingNoteId === note.id ? (
                              <>
                                <textarea rows={2} className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-primary-green resize-none"
                                  value={editNoteContent} onChange={(e) => setEditNoteContent(e.target.value)} />
                                <div className="flex gap-1 mt-1">
                                  <button onClick={() => handleSaveNoteEdit(note.id)} className="px-2 py-1 bg-primary-green text-primary-cream rounded text-xs">Save</button>
                                  <button onClick={() => setEditingNoteId(null)} className="px-2 py-1 bg-gray-200 rounded text-xs">Cancel</button>
                                </div>
                              </>
                            ) : (
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <p className="text-gray-700">{note.content}</p>
                                  <p className="text-gray-400 mt-1">{note.author.full_name} · {fmtTime(note.created_at)}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <button onClick={() => { setEditingNoteId(note.id); setEditNoteContent(note.content); }}
                                    className="text-gray-400 hover:text-primary-green"><Pencil className="w-3 h-3" /></button>
                                  <button onClick={() => handleDeleteNote(note.id)}
                                    className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-1 mt-2">
                          <input type="text" placeholder="Add a note..." value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-green" />
                          <button onClick={() => handleAddNote(field.id)}
                            className="px-2 py-1.5 bg-primary-green text-primary-cream rounded-lg text-xs"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Link to={`/field/${field.id}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border-2 border-primary-brown text-primary-brown rounded-lg hover:bg-primary-brown hover:text-primary-cream transition-colors">
                      <Eye className="w-3 h-3" />View
                    </Link>
                    <button onClick={() => openEdit(field)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-primary-green text-primary-cream rounded-lg hover:bg-green-700 transition-colors">
                      <Pencil className="w-3 h-3" />Edit
                    </button>
                    <button onClick={() => handleDeleteField(field.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ════════════════ TASKS TAB ════════════════ */
  const TasksTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tasks yet</p>
          ) : tasks.map((task) => (
            <div key={task.id} className={`flex items-start gap-4 p-4 rounded-xl border ${task.is_completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200'}`}>
              <input type="checkbox" checked={task.is_completed}
                onChange={async () => { await patchTask(task.id, { is_completed: !task.is_completed }); }}
                className="mt-1 h-4 w-4 text-primary-green rounded focus:ring-primary-green" />
              <div className="flex-1">
                <p className={`font-medium text-sm ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{task.due_date ? `Due: ${fmt(task.due_date)}` : 'No due date'}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ════════════════ ANALYTICS TAB ════════════════ */
  const AnalyticsTab = () => {
    if (summaryLoading) return <Spinner />;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Avg Field Size', value: fields.length ? `${(fields.reduce((a, f) => a + (f.size_hectares || 0), 0) / fields.length).toFixed(1)} ha` : '0 ha', icon: <Map className="w-5 h-5" />, color: 'text-primary-green' },
            { label: 'Total Notes', value: fields.reduce((a, f) => a + (f.notes?.length || 0), 0), icon: <Activity className="w-5 h-5" />, color: 'text-primary-brown' },
            { label: 'Fields Ready', value: fields.filter((f) => f.current_stage === 'Ready').length, icon: <CheckCircle className="w-5 h-5" />, color: 'text-blue-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-50 ${s.color}`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-gray-900">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-6">Stage Distribution</h3>
          <div className="space-y-4">
            {(['Planted', 'Growing', 'Ready', 'Harvested'] as const).map((stage) => {
              const count = stats.stage_breakdown[stage] || 0;
              const pct = stats.total_fields ? (count / stats.total_fields) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{stage}</span>
                    <span className="text-gray-500">{count} fields ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-primary-green to-primary-brown transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* ════════════════ SUPPORT TAB ════════════════ */
  const SupportTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Support</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Documentation', desc: 'Browse our comprehensive guides.', icon: <TrendingUp className="w-6 h-6" />, action: 'View Docs' },
          { title: 'Contact Support', desc: 'Reach out for assistance.', icon: <HelpCircle className="w-6 h-6" />, action: 'Get Help' },
          { title: 'Report an Issue', desc: 'Found a bug? Let us know.', icon: <AlertTriangle className="w-6 h-6" />, action: 'Report' },
          { title: 'FAQs', desc: 'Common questions answered.', icon: <CheckCircle className="w-6 h-6" />, action: 'View FAQs' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-primary-cream mb-4">{item.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
            <button className="px-4 py-2 bg-primary-green text-primary-cream rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">{item.action}</button>
          </div>
        ))}
      </div>
    </div>
  );

  /* ════════════════ RENDER CONTENT ════════════════ */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab />;
      case 'fields':    return <FieldsTab />;
      case 'tasks':     return <TasksTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'support':   return <SupportTab />;
      default:          return <OverviewTab />;
    }
  };

  /* ════════════════ MAIN ════════════════ */
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-montserrat">
      <div className="hidden lg:flex flex-col flex-shrink-0"><Sidebar /></div>
      {mobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-50"><Sidebar mobile /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AgentDashboard;