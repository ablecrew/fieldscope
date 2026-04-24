import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, User, Leaf,
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  Plus, Pencil, Trash2, Save, X,
} from 'lucide-react';

// ── Separate type imports from value imports ──
import type { Note } from '../utils/mockData';
import {
  mockFields,
  mockNotes,
  mockUsers,
} from '../utils/mockData';

import { useAuth } from '../context/AuthContext';

const stageColors: Record<string, string> = {
  Planted: 'bg-yellow-100 text-yellow-800',
  Growing: 'bg-blue-100 text-blue-800',
  Ready: 'bg-green-100 text-green-800',
  Harvested: 'bg-gray-100 text-gray-800',
};

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; bg: string }
> = {
  Active: {
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  'At Risk': {
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  Completed: {
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    icon: <Clock className="w-4 h-4" />,
  },
};

const FieldView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const field = mockFields.find(f => f.id === id);
  const assignedAgent = mockUsers.find(u => u.id === field?.assignedTo);

  const [notes, setNotes] = useState<Note[]>(
    mockNotes.filter(n => n.fieldId === id)
  );
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  if (!field) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Field Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The field you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary-green text-primary-cream rounded-lg font-medium hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[field.status];

  const handleAddNote = () => {
    if (!noteContent.trim() || !user) return;
    const newNote: Note = {
      id: `n${Date.now()}`,
      fieldId: field.id,
      userId: user.id,
      userName: user.name,
      content: noteContent.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteContent('');
    setShowNoteForm(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (noteId: string) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === noteId
          ? { ...n, content: editContent, updatedAt: new Date().toISOString() }
          : n
      )
    );
    setEditingNoteId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const stageProgress: Record<string, number> = {
    Planted: 25,
    Growing: 50,
    Ready: 75,
    Harvested: 100,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Field Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="gradient-green-brown p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {field.location || 'No location set'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf className="w-4 h-4" />
                    {field.cropType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Planted: {formatDate(field.plantingDate)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${stageColors[field.currentStage]}`}
                >
                  {field.currentStage}
                </span>
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}
                >
                  {status.icon}
                  {field.status}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Growth Progress
              </span>
              <span className="text-sm font-bold text-primary-green">
                {stageProgress[field.currentStage]}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-primary-green to-primary-brown transition-all duration-500"
                style={{ width: `${stageProgress[field.currentStage]}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Planted</span>
              <span>Growing</span>
              <span>Ready</span>
              <span>Harvested</span>
            </div>
          </div>

          {/* Field Details Grid */}
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Crop Type
              </p>
              <p className="font-semibold text-gray-900">{field.cropType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Size
              </p>
              <p className="font-semibold text-gray-900">
                {field.size ? `${field.size} ha` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Current Stage
              </p>
              <p className="font-semibold text-gray-900">
                {field.currentStage}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Last Updated
              </p>
              <p className="font-semibold text-gray-900">
                {field.lastUpdated
                  ? formatDate(field.lastUpdated)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Notes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Notes & Observations
                </h2>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-green text-primary-cream rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>

              {/* Add Note Form */}
              {showNoteForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green resize-none text-sm"
                    rows={4}
                    placeholder="Write your observation or note here..."
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddNote}
                      className="flex items-center gap-1 px-4 py-2 bg-primary-green text-primary-cream rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Note
                    </button>
                    <button
                      onClick={() => {
                        setShowNoteForm(false);
                        setNoteContent('');
                      }}
                      className="flex items-center gap-1 px-4 py-2 border-2 border-primary-brown text-primary-brown bg-transparent rounded-lg text-sm font-medium hover:bg-primary-brown hover:text-primary-cream transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Notes List */}
              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No notes yet</p>
                  <p className="text-sm">
                    Add the first observation for this field
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map(note => (
                    <div
                      key={note.id}
                      className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                    >
                      {editingNoteId === note.id ? (
                        <>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green resize-none text-sm mb-3"
                            rows={3}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(note.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-primary-green text-primary-cream rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 text-sm mb-3">
                            {note.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary-green flex items-center justify-center text-primary-cream text-xs font-bold">
                                {note.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900">
                                  {note.userName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatDateTime(note.createdAt)}
                                  {note.updatedAt && ' (edited)'}
                                </p>
                              </div>
                            </div>
                            {(user?.id === note.userId ||
                              user?.role === 'admin') && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditNote(note)}
                                  className="p-1.5 text-gray-400 hover:text-primary-green rounded-lg hover:bg-green-50 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Assigned Agent */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Assigned Agent</h3>
              {assignedAgent ? (
                <div className="flex items-center gap-3">
                  <img
                    src={assignedAgent.avatar}
                    alt={assignedAgent.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%239A7B4F' width='48' height='48' rx='24'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat' font-size='20' fill='%23FFFDD0' font-weight='bold'%3E${assignedAgent.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {assignedAgent.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignedAgent.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-brown text-primary-cream text-xs rounded-full">
                      Field Agent
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500">
                  <User className="w-10 h-10 text-gray-300" />
                  <p className="text-sm">No agent assigned</p>
                </div>
              )}
            </div>

            {/* Field Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Field Timeline</h3>
              <div className="space-y-4">
                {['Planted', 'Growing', 'Ready', 'Harvested'].map(
                  (stage, index) => {
                    const stageOrder = [
                      'Planted',
                      'Growing',
                      'Ready',
                      'Harvested',
                    ];
                    const currentIndex = stageOrder.indexOf(
                      field.currentStage
                    );
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={stage} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-primary-green text-primary-cream'
                              : isCompleted
                              ? 'bg-gray-400 text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isCurrent
                                ? 'text-primary-green'
                                : isCompleted
                                ? 'text-gray-500'
                                : 'text-gray-400'
                            }`}
                          >
                            {stage}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-gray-400">
                              Current Stage
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Notes
                  </span>
                  <span className="font-bold text-gray-900">
                    {notes.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Field Size</span>
                  <span className="font-bold text-gray-900">
                    {field.size ? `${field.size} ha` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}
                  >
                    {field.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldView;