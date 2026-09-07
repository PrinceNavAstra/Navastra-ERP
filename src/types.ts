export type ThemeMode = 'light' | 'dark';

export type DealStage = 'lead_in' | 'qualified' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface StageColorConfig {
  id: DealStage;
  label: string;
  color: string;      // Accent / card border / header color
  badgeBg: string;    // Badge background color
  badgeText: string;  // Badge text color
  barColor: string;   // Stepper / progress bar color
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ActionItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type?: 'call' | 'email' | 'meeting' | 'review' | 'proposal';
}

export interface ActivityEvent {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'stage_change';
  title: string;
  description: string;
  date: string;
  author: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  priority: Priority;
  notes: string;
  tags: string[];
  assignedTo: string;
  source?: string;
  avatarInitials?: string;
  avatarBg?: string;
  timeAgo?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  aiScore?: number;
  aiAnalysis?: string;
  actionItems?: ActionItem[];
  activities?: ActivityEvent[];
  comments?: { id: string; author: string; text: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Unqualified';
export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';
export type LeadSource = 'Website' | 'LinkedIn' | 'Referral' | 'Google Ads' | 'Trade Show' | 'Cold Outreach' | 'Partner' | 'Event';

export interface LeadStageColorConfig {
  id: LeadStatus;
  label: string;
  color: string;      // Header color & card left border
  badgeBg: string;    // Badge background color
  badgeText: string;  // Badge text color
  barColor: string;   // Accent bar color
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  status: LeadStatus;
  score: number;
  temperature: LeadTemperature;
  source: string;
  estimatedValue: number;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  assignedTo: string;
  notes: string;
  avatarInitials?: string;
  avatarBg?: string;
  timeAgo?: string;
  expectedCloseDate?: string;
  aiInsights?: string;
  actionItems?: ActionItem[];
  activities?: ActivityEvent[];
  comments?: { id: string; author: string; text: string; date: string }[];
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar?: string;
  city: string;
  country: string;
  address: string;
  lat?: number;
  lng?: number;
  lastContacted: string;
  totalDealsValue: number;
  tags: string[];
  notes: string;
  linkedIn?: string;
}

export interface Account {
  id: string;
  name: string;
  industry: 'Software & SaaS' | 'Fintech' | 'Healthcare' | 'Manufacturing' | 'E-commerce' | 'Consulting';
  tier: 'Enterprise' | 'Mid-Market' | 'Growth';
  annualRevenue: number;
  employees: number;
  website: string;
  city: string;
  country: string;
  address: string;
  lat?: number;
  lng?: number;
  healthScore: number;
  activeDealsCount: number;
  primaryContact: string;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceStageColorConfig {
  id: InvoiceStatus;
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  company: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  currency: string;
  notes: string;
  paymentMethod?: string;
  paidAt?: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  from: { name: string; email: string };
  to: { name: string; email: string };
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';
  labels: string[];
  dealId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  location?: string;
  attendees: string[];
  description: string;
  meetLink?: string;
  type: 'meeting' | 'demo' | 'call' | 'review' | 'deadline';
  dealId?: string;
}

export interface GoogleMeeting {
  id: string;
  title: string;
  hostName: string;
  hostEmail: string;
  attendees: string[];
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  meetUrl: string;
  meetingCode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  agenda?: string;
  aiTalkingPoints?: string[];
  notes?: string;
  summary?: string;
}

export type RolePersona = 'cro' | 'copywriter' | 'auditor' | 'assistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: string;
  thinkingSteps?: string[];
  rolePersona?: RolePersona;
}

export type NavastraAppId = 
  | 'apps_launcher'
  | 'crm' 
  | 'sales' 
  | 'invoicing' 
  | 'inventory' 
  | 'projects' 
  | 'hr' 
  | 'helpdesk' 
  | 'mrp' 
  | 'pos' 
  | 'ecommerce' 
  | 'google_suite' 
  | 'app_store' 
  | 'settings';

export type NavastraAppCategory = 
  | 'All' 
  | 'Sales & CRM' 
  | 'Services' 
  | 'Accounting' 
  | 'Inventory & MRP' 
  | 'Human Resources' 
  | 'Productivity & AI' 
  | 'System';

export interface NavastraApp {
  id: NavastraAppId;
  name: string;
  category: NavastraAppCategory;
  description: string;
  tagline: string;
  iconName: string;
  color: string;
  gradient: string;
  isInstalled: boolean;
  isBase: boolean;
  version: string;
  author: string;
  rating?: number;
  badge?: string;
  downloads?: string;
  metrics?: { label: string; value: string };
  defaultView?: ViewType;
}

export type ViewType = 
  | 'apps_grid'
  | 'app_store'
  | 'dashboard' 
  | 'pipeline' 
  | 'leads' 
  | 'contacts' 
  | 'accounts' 
  | 'invoices' 
  | 'sales_orders'
  | 'inventory_stock'
  | 'project_tasks'
  | 'hr_employees'
  | 'helpdesk_tickets'
  | 'gmail' 
  | 'calendar' 
  | 'meet' 
  | 'maps' 
  | 'settings'
  | 'ai_studio';
