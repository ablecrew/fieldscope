// ============================================================
// src/utils/mockData.ts
// All interfaces and mock data for FieldScope
// ============================================================

// ─────────────────── INTERFACES ───────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  avatar?: string;
  isArchived?: boolean;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: 'Planted' | 'Growing' | 'Ready' | 'Harvested';
  status: 'Active' | 'At Risk' | 'Completed';
  assignedTo?: string;
  location?: string;
  size?: number;
  notes?: Note[];
  isArchived?: boolean;
  lastUpdated?: string;
}

export interface Note {
  id: string;
  fieldId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface FieldStats {
  total: number;
  active: number;
  atRisk: number;
  completed: number;
}

// ─────────────────── MOCK USERS ───────────────────

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fieldscope.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=008800&color=FFFDD0',
    isArchived: false,
  },
  {
    id: '2',
    name: 'John Agent',
    email: 'john@fieldscope.com',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=John+Agent&background=9A7B4F&color=FFFDD0',
    isArchived: false,
  },
  {
    id: '3',
    name: 'Sarah Field',
    email: 'sarah@fieldscope.com',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Field&background=9A7B4F&color=FFFDD0',
    isArchived: false,
  },
  {
    id: '4',
    name: 'Mike Monitor',
    email: 'mike@fieldscope.com',
    role: 'agent',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Monitor&background=9A7B4F&color=FFFDD0',
    isArchived: false,
  },
];

// ─────────────────── MOCK FIELDS ───────────────────

export const mockFields: Field[] = [
  {
    id: 'f1',
    name: 'North Valley Field',
    cropType: 'Wheat',
    plantingDate: '2024-03-15',
    currentStage: 'Growing',
    status: 'Active',
    assignedTo: '2',
    location: 'North Valley, Plot A1',
    size: 25.5,
    lastUpdated: '2024-04-10',
    isArchived: false,
    notes: [],
  },
  {
    id: 'f2',
    name: 'East Ridge Farm',
    cropType: 'Corn',
    plantingDate: '2024-03-20',
    currentStage: 'Planted',
    status: 'Active',
    assignedTo: '2',
    location: 'East Ridge, Section B',
    size: 30.2,
    lastUpdated: '2024-04-08',
    isArchived: false,
    notes: [],
  },
  {
    id: 'f3',
    name: 'South Meadow',
    cropType: 'Soybeans',
    plantingDate: '2024-02-28',
    currentStage: 'Ready',
    status: 'Active',
    assignedTo: '3',
    location: 'South Meadow, Plot C3',
    size: 18.7,
    lastUpdated: '2024-04-12',
    isArchived: false,
    notes: [],
  },
  {
    id: 'f4',
    name: 'West Plain',
    cropType: 'Rice',
    plantingDate: '2024-02-15',
    currentStage: 'Growing',
    status: 'At Risk',
    assignedTo: '3',
    location: 'West Plain, Field D2',
    size: 40.0,
    lastUpdated: '2024-04-11',
    isArchived: false,
    notes: [],
  },
  {
    id: 'f5',
    name: 'Central Acres',
    cropType: 'Barley',
    plantingDate: '2024-01-20',
    currentStage: 'Harvested',
    status: 'Completed',
    assignedTo: '4',
    location: 'Central Acres, E1',
    size: 22.3,
    lastUpdated: '2024-04-05',
    isArchived: false,
    notes: [],
  },
  {
    id: 'f6',
    name: 'Highland Field',
    cropType: 'Oats',
    plantingDate: '2024-03-10',
    currentStage: 'Growing',
    status: 'Active',
    assignedTo: '4',
    location: 'Highland, Plot F4',
    size: 15.8,
    lastUpdated: '2024-04-09',
    isArchived: false,
    notes: [],
  },
];

// ─────────────────── MOCK NOTES ───────────────────

export const mockNotes: Note[] = [
  {
    id: 'n1',
    fieldId: 'f1',
    userId: '2',
    userName: 'John Agent',
    content: 'Crop showing healthy growth. Irrigation system working well.',
    createdAt: '2024-04-10T10:30:00Z',
  },
  {
    id: 'n2',
    fieldId: 'f3',
    userId: '3',
    userName: 'Sarah Field',
    content: 'Field ready for harvest. Weather conditions favorable.',
    createdAt: '2024-04-12T14:20:00Z',
  },
  {
    id: 'n3',
    fieldId: 'f4',
    userId: '3',
    userName: 'Sarah Field',
    content: 'Noticed some pest activity. Monitoring closely.',
    createdAt: '2024-04-11T09:15:00Z',
  },
  {
    id: 'n4',
    fieldId: 'f2',
    userId: '2',
    userName: 'John Agent',
    content: 'Seeds germinating well. No issues observed.',
    createdAt: '2024-04-09T11:00:00Z',
  },
  {
    id: 'n5',
    fieldId: 'f6',
    userId: '4',
    userName: 'Mike Monitor',
    content: 'Steady growth progress. Soil moisture levels optimal.',
    createdAt: '2024-04-09T08:45:00Z',
  },
];

// ─────────────────── MOCK NOTIFICATIONS ───────────────────

export const mockNotifications: Notification[] = [
  {
    id: 'not1',
    title: 'Field Update Required',
    message: 'West Plain field needs a status update urgently.',
    type: 'warning',
    read: false,
    createdAt: '2024-04-12T08:00:00Z',
    userId: '2',
  },
  {
    id: 'not2',
    title: 'Harvest Complete',
    message: 'Central Acres harvest completed successfully.',
    type: 'success',
    read: false,
    createdAt: '2024-04-11T16:30:00Z',
    userId: '1',
  },
  {
    id: 'not3',
    title: 'New Field Assigned',
    message: 'You have been assigned to Highland Field.',
    type: 'info',
    read: true,
    createdAt: '2024-04-10T09:00:00Z',
    userId: '4',
  },
  {
    id: 'not4',
    title: 'Risk Alert',
    message: 'West Plain field has been marked as At Risk.',
    type: 'error',
    read: false,
    createdAt: '2024-04-11T12:00:00Z',
    userId: '1',
  },
  {
    id: 'not5',
    title: 'Note Added',
    message: 'Sarah Field added a note to South Meadow.',
    type: 'info',
    read: true,
    createdAt: '2024-04-12T14:20:00Z',
    userId: '1',
  },
  {
    id: 'not6',
    title: 'Stage Updated',
    message: 'North Valley Field has moved to Growing stage.',
    type: 'success',
    read: false,
    createdAt: '2024-04-10T10:30:00Z',
    userId: '2',
  },
];

// ─────────────────── MOCK ACTIVITIES ───────────────────

export const mockActivities: Activity[] = [
  {
    id: 'act1',
    userId: '2',
    userName: 'John Agent',
    action: 'updated stage for',
    target: 'North Valley Field',
    timestamp: '2024-04-10T10:30:00Z',
  },
  {
    id: 'act2',
    userId: '3',
    userName: 'Sarah Field',
    action: 'added a note to',
    target: 'South Meadow',
    timestamp: '2024-04-12T14:20:00Z',
  },
  {
    id: 'act3',
    userId: '1',
    userName: 'Admin User',
    action: 'assigned field to',
    target: 'Mike Monitor – Highland Field',
    timestamp: '2024-04-10T09:00:00Z',
  },
  {
    id: 'act4',
    userId: '4',
    userName: 'Mike Monitor',
    action: 'marked harvest complete for',
    target: 'Central Acres',
    timestamp: '2024-04-05T15:45:00Z',
  },
  {
    id: 'act5',
    userId: '3',
    userName: 'Sarah Field',
    action: 'flagged at-risk status on',
    target: 'West Plain',
    timestamp: '2024-04-11T09:15:00Z',
  },
  {
    id: 'act6',
    userId: '1',
    userName: 'Admin User',
    action: 'added new field',
    target: 'East Ridge Farm',
    timestamp: '2024-04-08T07:30:00Z',
  },
];

// ─────────────────── HELPER FUNCTIONS ───────────────────

export const getFieldsByAgent = (agentId: string): Field[] => {
  return mockFields.filter(
    (field) => field.assignedTo === agentId && !field.isArchived
  );
};

export const getUnreadNotificationCount = (userId: string): number => {
  return mockNotifications.filter(
    (n) => n.userId === userId && !n.read
  ).length;
};

export const getFieldStats = (fields: Field[]): FieldStats => {
  const activeFields = fields.filter((f) => !f.isArchived);
  return {
    total: activeFields.length,
    active: activeFields.filter((f) => f.status === 'Active').length,
    atRisk: activeFields.filter((f) => f.status === 'At Risk').length,
    completed: activeFields.filter((f) => f.status === 'Completed').length,
  };
};

export const getAgentById = (id: string): User | undefined => {
  return mockUsers.find((u) => u.id === id);
};

export const getFieldById = (id: string): Field | undefined => {
  return mockFields.find((f) => f.id === id);
};

export const getNotesByField = (fieldId: string): Note[] => {
  return mockNotes.filter((n) => n.fieldId === fieldId);
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter((n) => n.userId === userId);
};