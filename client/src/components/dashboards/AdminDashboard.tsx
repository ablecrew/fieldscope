import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Users, BarChart2, FileText,
  Radio, Bell, User, Settings, LogOut,
  ChevronLeft, ChevronRight, ChevronDown, Plus,
  Pencil, Trash2, Eye, Save, X, Search,
  Archive, ArchiveRestore, Shield, Activity,
  AlertTriangle, CheckCircle, Clock, Leaf,
  TrendingUp, Menu, UserCheck, SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFields } from '../../hooks/useFields';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotes } from '../../hooks/useNotes';
import { useTasks } from '../../hooks/useTasks';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAgents } from '../../hooks/useAgents';
import { useActivities } from '../../hooks/useActivities';
import { useSensors } from '../../hooks/useSensors';
import type { Field, User as UserType, Sensor } from '../../utils/types';
import logo from "../../assets/FSS_I.png";

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
  { id: 'overview',  label: 'System Overview', icon: LayoutDashboard },
  { id: 'fields',    label: 'Fields',          icon: Map },
  { id: 'agents',    label: 'Agents',          icon: Users },
  { id: 'analytics', label: 'Analytics',       icon: BarChart2 },
  { id: 'reports',   label: 'Reports',         icon: FileText },
];

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const fmtDT = (d: string) =>
  new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const fmtTime = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (diff < 1) return 'Just now';
  if (diff < 24) return `${diff}h ago`;
  return `${Math.floor(diff / 24)}d ago`;
};

const FSLogo = (size = 36) => (
  <img
      src={logo}
      alt="FieldScope Logo"
      className="h-10 w-10 object-contain"
      onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23008800" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Montserrat" font-size="20" fill="%23FFFDD0" font-weight="bold"%3EFS%3C/text%3E%3C/svg%3E';
      }}
  />
);

const Spinner = () => (
  <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary-green animate-spin" /></div>
);

/* ─── component ───────────────────────────────────── */
const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* hooks */
  const { fields, loading: fLoading, createField, updateField, deleteField, archiveField, fetchFields } = useFields();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { notes, fetchNotes, addNote, updateNote, deleteNote } = useNotes();
  const { agents, loading: aLoading, createAgent, updateAgent, deleteAgent, archiveAgent } = useAgents();
  const { activities } = useActivities();
  const { tasks } = useTasks();
  const { summary, loading: sLoading } = useAnalytics();
  const { sensors, createSensor } = useSensors();

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
    location: '', size_hectares: '', assigned_agent: '',
  });

  /* agent form */
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<UserType | null>(null);
  const [agentForm, setAgentForm] = useState({ full_name: '', email: '' });

  /* notes */
  const [activeFieldNotes, setActiveFieldNotes] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  /* sensor form */
  const [sensorForm, setSensorForm] = useState({ sensor_code: '', field: '', sensor_type: 'Soil Moisture' });

  /* filters */
  const [fieldSearch, setFieldSearch] = useState('');
  const [fieldStageFilter, setFieldStageFilter] = useState('All');
  const [fieldStatusFilter, setFieldStatusFilter] = useState('All');
  const [agentSearch, setAgentSearch] = useState('');
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

  useEffect(() => { if (activeFieldNotes) fetchNotes(activeFieldNotes); }, [activeFieldNotes, fetchNotes]);

  /* computed */
  const stats = summary || {
    total_fields: 0,
    status_breakdown: { active: 0, at_risk: 0, completed: 0 },
    stage_breakdown: { Planted: 0, Growing: 0, Ready: 0, Harvested: 0 },
    insights: [],
  };

  const filteredFields = fields.filter((f) => {
    const s = fieldSearch.toLowerCase();
    return (f.name.toLowerCase().includes(s) || f.crop_type.toLowerCase().includes(s))
      && (fieldStageFilter === 'All' || f.current_stage === fieldStageFilter)
      && (fieldStatusFilter === 'All' || f.status === fieldStatusFilter);
  });

  const filteredAgents = agents.filter((a) => {
    const s = agentSearch.toLowerCase();
    return a.full_name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s);
  });

  /* ── field CRUD ── */
  const openAddField = () => {
    setEditingField(null);
    setFieldForm({ name: '', crop_type: '', planting_date: '', current_stage: 'Planted', location: '', size_hectares: '', assigned_agent: '' });
    setShowFieldForm(true);
  };

  const openEditField = (f: Field) => {
    setEditingField(f);
    setFieldForm({
      name: f.name, crop_type: f.crop_type, planting_date: f.planting_date,
      current_stage: f.current_stage, location: f.location || '',
      size_hectares: f.size_hectares?.toString() || '',
      assigned_agent: f.assigned_agent || '',
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
        assigned_agent: fieldForm.assigned_agent || null,
      };
      if (editingField) await updateField(editingField.id, payload);
      else await createField(payload);
      setShowFieldForm(false);
    } catch { /* error */ } finally { setSaving(false); }
  };

  const handleDeleteField = async (id: string) => {
    if (!window.confirm('Delete this field?')) return;
    await deleteField(id);
  };

  /* ── agent CRUD ── */
  const openAddAgent = () => { setEditingAgent(null); setAgentForm({ full_name: '', email: '' }); setShowAgentForm(true); };
  const openEditAgent = (a: UserType) => { setEditingAgent(a); setAgentForm({ full_name: a.full_name, email: a.email }); setShowAgentForm(true); };

  const handleSaveAgent = async () => {
    if (!agentForm.full_name || !agentForm.email) return;
    setSaving(true);
    try {
      if (editingAgent) await updateAgent(editingAgent.id, agentForm);
      else await createAgent({ ...agentForm, password: 'password123' });
      setShowAgentForm(false);
    } catch { /* error */ } finally { setSaving(false); }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!window.confirm('Delete this agent?')) return;
    await deleteAgent(id);
  };

  /* ── note CRUD ── */
  const handleAddNote = async (fieldId: string) => {
    if (!noteContent.trim()) return;
    await addNote(fieldId, noteContent.trim());
    setNoteContent('');
  };
  const handleSaveNoteEdit = async (noteId: string) => { await updateNote(noteId, editNoteContent); setEditingNoteId(null); };
  const handleDeleteNote = async (noteId: string) => { await deleteNote(noteId); };

  /* ── sensor ── */
  const handleDeploySensor = async () => {
    if (!sensorForm.sensor_code || !sensorForm.field) return;
    setSaving(true);
    try {
      await createSensor(sensorForm);
      setSensorForm({ sensor_code: '', field: '', sensor_type: 'Soil Moisture' });
    } catch { /* error */ } finally { setSaving(false); }
  };

  /* ════════════════ SIDEBAR ════════════════ */
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300 h-full`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">{FSLogo(36)}{(sidebarOpen || mobile) && <span className="font-bold text-lg text-primary-cream">FieldScope</span>}</div>
        {!mobile && <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">{sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}</button>}
      </div>
      {(sidebarOpen || mobile) && <div className="mx-4 mt-3 px-3 py-1.5 bg-primary-green/20 rounded-lg"><p className="text-xs text-primary-cream/80 flex items-center gap-1.5"><Shield className="w-3 h-3" />Administrator</p></div>}
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
        <button onClick={() => { setActiveTab('deploy'); if (mobile) setMobileSidebar(false); }}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'deploy' ? 'bg-primary-green text-primary-cream' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
          <Radio className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobile) && <span className="font-medium text-sm">Deploy Sensor</span>}
        </button>
      </div>
    </aside>
  );

  /* ════════════════ TOPNAV ════════════════ */
  const TopNav = () => (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileSidebar(true)} className="lg:hidden text-gray-600 hover:text-primary-green"><Menu className="w-6 h-6" /></button>
        <div className="flex items-center gap-2">{FSLogo(32)}<span className="font-bold text-primary-green hidden sm:block">FieldScope</span></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 text-gray-600 hover:text-primary-green">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between"><h3 className="font-semibold text-gray-800 text-sm">Notifications</h3><span className="text-xs text-gray-500">{unreadCount} unread</span></div>
              {notifications.length > 0 ? notifications.slice(0, 8).map((n) => (
                <button key={n.id} onClick={() => markAsRead(n.id)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-l-4 ${n.is_read ? 'border-transparent' : 'border-primary-green bg-green-50'}`}>
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtTime(n.created_at)}</p>
                </button>
              )) : <p className="text-sm text-gray-500 px-4 py-6 text-center">No notifications</p>}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
            {user?.avatar_url ? <img src={user.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-primary-green flex items-center justify-center text-primary-cream font-semibold">{user?.full_name?.charAt(0)}</div>}
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-green text-primary-cream text-xs rounded-full">Administrator</span>
              </div>
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><User className="w-4 h-4 mr-3" />Profile</button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Settings className="w-4 h-4 mr-3" />Settings</button>
                <button onClick={() => setActiveTab('overview')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Shield className="w-4 h-4 mr-3" />System</button>
              </div>
              {activities.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Recent Activities</p>
                  {activities.slice(0, 3).map((act) => (
                    <div key={act.id} className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">{act.actor?.full_name}</span> {act.description}
                      <p className="text-gray-400 text-[10px]">{fmtTime(act.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-100 pt-1">
                <button onClick={() => { logout(); navigate('/signin'); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4 mr-3" />Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  /* ════════════════ OVERVIEW TAB ════════════════ */
  const OverviewTab = () => {
    if (sLoading) return <Spinner />;
    const activeAgentCount = agents.filter((a) => !a.is_archived).length;
    return (
      <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-gray-900">System Overview</h2><p className="text-gray-500 mt-1 text-sm">Admin dashboard – monitor all fields and agents</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Fields', value: stats.total_fields, icon: <Map className="w-6 h-6" />, grad: 'from-green-500 to-green-700' },
            { label: 'Active', value: stats.status_breakdown.active, icon: <CheckCircle className="w-6 h-6" />, grad: 'from-blue-500 to-blue-700' },
            { label: 'At Risk', value: stats.status_breakdown.at_risk, icon: <AlertTriangle className="w-6 h-6" />, grad: 'from-yellow-500 to-yellow-700' },
            { label: 'Total Agents', value: activeAgentCount, icon: <Users className="w-6 h-6" />, grad: 'from-purple-500 to-purple-700' },
          ].map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.grad} text-white rounded-2xl p-5 shadow-lg`}>
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-white/80">{c.label}</p><p className="text-3xl font-bold mt-1">{c.value}</p></div>
                <div className="bg-white/20 p-2 rounded-lg">{c.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Field Status Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Active', count: stats.status_breakdown.active, color: 'bg-green-500' },
                { label: 'At Risk', count: stats.status_breakdown.at_risk, color: 'bg-yellow-500' },
                { label: 'Completed', count: stats.status_breakdown.completed, color: 'bg-gray-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{item.label}</span><span className="text-gray-500">{item.count}/{stats.total_fields}</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: stats.total_fields ? `${(item.count / stats.total_fields) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">System Insights</h3>
            <div className="space-y-3">
              {stats.insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">{ins}</p>
                </div>
              ))}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <UserCheck className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700"><span className="font-semibold">{activeAgentCount} active agent(s)</span> managing {stats.total_fields} fields.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Stage Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['Planted', 'Growing', 'Ready', 'Harvested'] as const).map((stage) => (
              <div key={stage} className={`p-4 rounded-xl text-center ${stageColors[stage]}`}>
                <p className="text-3xl font-bold">{stats.stage_breakdown[stage] || 0}</p>
                <p className="text-sm font-medium mt-1">{stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-primary-green rounded-full flex items-center justify-center text-primary-cream text-sm font-bold flex-shrink-0">{act.actor?.full_name?.charAt(0) || '?'}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{act.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtDT(act.created_at)}</p>
                </div>
                <Activity className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ════════════════ FIELDS TAB ════════════════ */
  const FieldsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-gray-900">Fields Management</h2></div>
        <button onClick={openAddField} className="flex items-center gap-2 px-4 py-2 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700"><Plus className="w-4 h-4" />Add Field</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search fields..." value={fieldSearch} onChange={(e) => setFieldSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" /></div>
        <select value={fieldStageFilter} onChange={(e) => setFieldStageFilter(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
          <option value="All">All Stages</option>{['Planted','Growing','Ready','Harvested'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fieldStatusFilter} onChange={(e) => setFieldStatusFilter(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
          <option value="All">All Status</option>{['Active','At Risk','Completed'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Field Form Modal */}
      {showFieldForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingField ? 'Edit Field' : 'Add New Field'}</h3>
              <button onClick={() => setShowFieldForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Field Name *</label><input value={fieldForm.name} onChange={(e) => setFieldForm((p) => ({...p, name: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="North Valley Field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Crop Type *</label><input value={fieldForm.crop_type} onChange={(e) => setFieldForm((p) => ({...p, crop_type: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Wheat" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Size (ha)</label><input value={fieldForm.size_hectares} onChange={(e) => setFieldForm((p) => ({...p, size_hectares: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="25.5" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Planting Date *</label><input type="date" value={fieldForm.planting_date} onChange={(e) => setFieldForm((p) => ({...p, planting_date: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input value={fieldForm.location} onChange={(e) => setFieldForm((p) => ({...p, location: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="Plot A1" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select value={fieldForm.current_stage} onChange={(e) => setFieldForm((p) => ({...p, current_stage: e.target.value as Field['current_stage']}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
                    {['Planted','Growing','Ready','Harvested'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Assign Agent</label>
                  <select value={fieldForm.assigned_agent} onChange={(e) => setFieldForm((p) => ({...p, assigned_agent: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
                    <option value="">No Agent</option>{agents.filter((a) => !a.is_archived).map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                  </select></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveField} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{editingField ? 'Update' : 'Add Field'}
              </button>
              <button onClick={() => setShowFieldForm(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary-brown text-primary-brown rounded-xl font-medium hover:bg-primary-brown hover:text-primary-cream"><X className="w-4 h-4" />Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {fLoading ? <Spinner /> : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Field', 'Crop', 'Stage', 'Status', 'Agent', 'Notes', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFields.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No fields found</td></tr> : filteredFields.map((field) => {
                  const sc = statusCfg[field.status] || statusCfg.Active;
                  const agent = agents.find((a) => a.id === field.assigned_agent);
                  return (
                    <React.Fragment key={field.id}>
                      <tr className={`hover:bg-gray-50 ${field.is_archived ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3"><div className="font-semibold text-gray-900">{field.name}</div>{field.is_archived && <span className="text-xs text-gray-400">(Archived)</span>}</td>
                        <td className="px-4 py-3 text-gray-600">{field.crop_type}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[field.current_stage]}`}>{field.current_stage}</span></td>
                        <td className="px-4 py-3"><span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.icon}{field.status}</span></td>
                        <td className="px-4 py-3">{agent ? <span className="flex items-center gap-1 text-gray-700"><UserCheck className="w-3 h-3 text-primary-green" />{agent.full_name}</span> : <span className="text-gray-400 text-xs">Unassigned</span>}</td>
                        <td className="px-4 py-3"><button onClick={() => setActiveFieldNotes(activeFieldNotes === field.id ? null : field.id)} className="text-xs text-primary-green hover:underline">{activeFieldNotes === field.id ? 'Hide' : 'Notes'}</button></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link to={`/field/${field.id}`} className="p-1.5 text-gray-400 hover:text-primary-green rounded-lg hover:bg-green-50"><Eye className="w-4 h-4" /></Link>
                            <button onClick={() => openEditField(field)} className="p-1.5 text-gray-400 hover:text-primary-green rounded-lg hover:bg-green-50"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => archiveField(field.id)} className="p-1.5 text-gray-400 hover:text-primary-brown rounded-lg hover:bg-amber-50" title={field.is_archived ? 'Unarchive' : 'Archive'}>
                              {field.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDeleteField(field.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {activeFieldNotes === field.id && (
                        <tr><td colSpan={7} className="px-6 py-4 bg-green-50 border-b border-gray-100">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Notes for {field.name}</p>
                            {notes.map((note) => (
                              <div key={note.id} className="flex items-start gap-2 p-2 bg-white rounded-lg shadow-sm">
                                {editingNoteId === note.id ? (
                                  <div className="flex-1">
                                    <textarea rows={2} value={editNoteContent} onChange={(e) => setEditNoteContent(e.target.value)} className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-primary-green resize-none" />
                                    <div className="flex gap-1 mt-1">
                                      <button onClick={() => handleSaveNoteEdit(note.id)} className="px-2 py-1 bg-primary-green text-primary-cream rounded text-xs">Save</button>
                                      <button onClick={() => setEditingNoteId(null)} className="px-2 py-1 bg-gray-200 rounded text-xs">Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="flex-1 text-xs text-gray-700">{note.content}</p>
                                    <span className="text-xs text-gray-400">{note.author?.full_name}</span>
                                    <button onClick={() => { setEditingNoteId(note.id); setEditNoteContent(note.content); }} className="text-gray-400 hover:text-primary-green"><Pencil className="w-3 h-3" /></button>
                                    <button onClick={() => handleDeleteNote(note.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                  </>
                                )}
                              </div>
                            ))}
                            <div className="flex gap-2 mt-2">
                              <input type="text" placeholder="Add a note..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-green" />
                              <button onClick={() => handleAddNote(field.id)} className="px-3 py-1.5 bg-primary-green text-primary-cream rounded-lg text-xs font-medium">Add</button>
                            </div>
                          </div>
                        </td></tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  /* ════════════════ AGENTS TAB ════════════════ */
  const AgentsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-gray-900">Agent Management</h2></div>
        <button onClick={openAddAgent} className="flex items-center gap-2 px-4 py-2 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700"><Plus className="w-4 h-4" />Add Agent</button>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search agents..." value={agentSearch} onChange={(e) => setAgentSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" /></div>

      {showAgentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-900">{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h3><button onClick={() => setShowAgentForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input value={agentForm.full_name} onChange={(e) => setAgentForm((p) => ({...p, full_name: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="John Doe" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={agentForm.email} onChange={(e) => setAgentForm((p) => ({...p, email: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" placeholder="agent@fieldscope.com" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveAgent} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-green text-primary-cream rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{editingAgent ? 'Update' : 'Add Agent'}</button>
              <button onClick={() => setShowAgentForm(false)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary-brown text-primary-brown rounded-xl font-medium hover:bg-primary-brown hover:text-primary-cream"><X className="w-4 h-4" />Cancel</button>
            </div>
          </div>
        </div>
      )}

      {aLoading ? <Spinner /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const agentFieldCount = fields.filter((f) => f.assigned_agent === agent.id && !f.is_archived).length;
            return (
              <div key={agent.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${agent.is_archived ? 'opacity-60' : ''}`}>
                <div className="gradient-green-brown p-5 text-white">
                  <div className="flex items-center gap-3">
                    {agent.avatar_url ? <img src={agent.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/30" /> : <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">{agent.full_name.charAt(0)}</div>}
                    <div>
                      <h3 className="font-bold text-lg">{agent.full_name}</h3>
                      <p className="text-sm text-gray-100">{agent.email}</p>
                      {agent.is_archived && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full mt-1 inline-block">Archived</span>}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-600">Assigned Fields</span><span className="font-bold text-primary-green">{agentFieldCount}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditAgent(agent)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-green text-primary-cream rounded-lg text-xs font-medium hover:bg-green-700"><Pencil className="w-3 h-3" />Edit</button>
                    <button onClick={() => archiveAgent(agent.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border-2 border-primary-brown text-primary-brown rounded-lg text-xs font-medium hover:bg-primary-brown hover:text-primary-cream">
                      {agent.is_archived ? <><ArchiveRestore className="w-3 h-3" />Unarchive</> : <><Archive className="w-3 h-3" />Archive</>}
                    </button>
                    <button onClick={() => handleDeleteAgent(agent.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ════════════════ ANALYTICS TAB ════════════════ */
  const AnalyticsTab = () => {
    if (sLoading) return <Spinner />;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Avg Fields / Agent', value: (agents.filter((a) => !a.is_archived).length ? (fields.filter((f) => !f.is_archived).length / agents.filter((a) => !a.is_archived).length).toFixed(1) : '0'), icon: <SlidersHorizontal className="w-5 h-5" />, color: 'text-primary-green' },
            { label: 'Total Tasks', value: tasks.length, icon: <FileText className="w-5 h-5" />, color: 'text-primary-brown' },
            { label: 'Harvest Rate', value: `${stats.total_fields ? ((stats.status_breakdown.completed / stats.total_fields) * 100).toFixed(0) : 0}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-50 ${s.color}`}>{s.icon}</div>
              <div><p className="text-2xl font-bold text-gray-900">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-6">Stage Distribution</h3>
            <div className="space-y-4">
              {(['Planted','Growing','Ready','Harvested'] as const).map((stage) => {
                const count = stats.stage_breakdown[stage] || 0;
                const pct = stats.total_fields ? (count / stats.total_fields) * 100 : 0;
                return (<div key={stage}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{stage}</span><span className="text-gray-500">{count} ({pct.toFixed(0)}%)</span></div><div className="w-full bg-gray-100 rounded-full h-3"><div className="h-3 rounded-full bg-gradient-to-r from-primary-green to-primary-brown" style={{ width: `${pct}%` }} /></div></div>);
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-6">Agent Performance</h3>
            <div className="space-y-4">
              {agents.filter((a) => !a.is_archived).map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-primary-brown rounded-full flex items-center justify-center text-primary-cream text-sm font-bold">{agent.full_name.charAt(0)}</div>
                  <div className="flex-1"><p className="text-sm font-semibold text-gray-900">{agent.full_name}</p><p className="text-xs text-gray-500">{fields.filter((f) => f.assigned_agent === agent.id && !f.is_archived).length} fields</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-primary-green">{fields.filter((f) => f.assigned_agent === agent.id && !f.is_archived).length}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ════════════════ REPORTS TAB ════════════════ */
  const ReportsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Field Status Report', desc: 'Overview of all field statuses and stages', icon: <Map className="w-6 h-6" /> },
          { title: 'Agent Activity Report', desc: 'Track agent performance and updates', icon: <Users className="w-6 h-6" /> },
          { title: 'Harvest Report', desc: 'Summary of completed harvests', icon: <CheckCircle className="w-6 h-6" /> },
          { title: 'Risk Assessment Report', desc: 'Fields flagged as at-risk', icon: <AlertTriangle className="w-6 h-6" /> },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-primary-cream mb-4">{r.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{r.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-primary-green text-primary-cream rounded-lg text-sm font-medium hover:bg-green-700">Generate</button>
              <button className="flex-1 px-4 py-2 border-2 border-primary-brown text-primary-brown rounded-lg text-sm font-medium hover:bg-primary-brown hover:text-primary-cream">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ════════════════ DEPLOY SENSOR TAB ════════════════ */
  const DeploySensorTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Deploy Sensor</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-primary-cream mb-4"><Radio className="w-6 h-6" /></div>
          <h3 className="font-bold text-gray-900 mb-4">Deploy New Sensor</h3>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Select Field</label>
              <select value={sensorForm.field} onChange={(e) => setSensorForm((p) => ({...p, field: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
                <option value="">Choose a field...</option>{fields.filter((f) => !f.is_archived).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Sensor ID</label><input value={sensorForm.sensor_code} onChange={(e) => setSensorForm((p) => ({...p, sensor_code: e.target.value}))} placeholder="SNS-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Sensor Type</label>
              <select value={sensorForm.sensor_type} onChange={(e) => setSensorForm((p) => ({...p, sensor_type: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green">
                {['Soil Moisture','Temperature','Humidity','Multi-Sensor'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select></div>
            <button onClick={handleDeploySensor} disabled={saving} className="w-full px-4 py-2.5 bg-primary-green text-primary-cream rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}Deploy Sensor
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Active Sensors</h3>
          <div className="space-y-3">
            {sensors.length === 0 ? <p className="text-sm text-gray-500 text-center py-6">No sensors deployed yet</p> : sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${sensor.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div><p className="text-sm font-semibold text-gray-900">{sensor.sensor_code}</p><p className="text-xs text-gray-500">{sensor.sensor_type}</p></div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${sensor.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{sensor.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════════ RENDER CONTENT ════════════════ */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab />;
      case 'fields':    return <FieldsTab />;
      case 'agents':    return <AgentsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'reports':   return <ReportsTab />;
      case 'deploy':    return <DeploySensorTab />;
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

export default AdminDashboard;