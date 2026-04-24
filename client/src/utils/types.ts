export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent';
  avatar_url?: string;
  is_archived?: boolean;
  created_at?: string;
}

export interface Field {
  id: string;
  name: string;
  crop_type: string;
  planting_date: string;
  current_stage: 'Planted' | 'Growing' | 'Ready' | 'Harvested';
  status: 'Active' | 'At Risk' | 'Completed';
  assigned_agent?: string;
  assigned_agent_details?: User;
  location?: string;
  size_hectares?: number;
  last_updated_at: string;
  is_archived: boolean;
  created_at?: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  field: string;
  author: User;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  related_field?: string;
}

export interface Activity {
  id: string;
  actor: User;
  action: string;
  target_type: string;
  target_id?: string;
  description: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  field?: string;
  assigned_agent?: string;
  assigned_agent_details?: User;
  priority: 'Low' | 'Medium' | 'High';
  due_date?: string;
  is_completed: boolean;
  created_at: string;
}

export interface Sensor {
  id: string;
  sensor_code: string;
  field?: string;
  sensor_type: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  deployed_at: string;
}

export interface DashboardSummary {
  total_fields: number;
  status_breakdown: { active: number; at_risk: number; completed: number };
  stage_breakdown: Record<string, number>;
  insights: string[];
}