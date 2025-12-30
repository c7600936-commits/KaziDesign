
export enum Stakeholder {
  CLIENT = 'Client',
  CONTRACTOR = 'Contractor',
  DESIGNER = 'Designer',
  SUPPLIER = 'Supplier',
  ARCHITECT = 'Architect',
  ENGINEER = 'Engineer',
  STATUTORY = 'County/NCA'
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export enum UserRole {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  STUDIO = 'STUDIO'
}

export interface CompanySubscription {
  tier: SubscriptionTier;
  expiresAt: string;
  isAutoRenew: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface ProjectDetails {
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
  tag: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  products: string[];
  rating: number;
  location: string;
}

export interface Deliverable {
  title: string;
  description: string;
}

export interface KenyanInsight {
  title: string;
  tip: string;
}

export interface WorkflowStage {
  id: string;
  title: string;
  icon: string;
  description: string;
  stakeholders: Stakeholder[];
  deliverables: Deliverable[];
  insights: KenyanInsight[];
  tasks: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProjectArchive {
  id: string;
  details: ProjectDetails;
  completedStages: string[];
  photos: ProjectPhoto[];
  suppliers: Supplier[];
  archivedDate: string;
}
