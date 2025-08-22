export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  location_details?: string;
  created_at: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  volunteer_profile?: VolunteerProfile;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  urgency_score: number | null;
  primary_subject: Person;
  assigned_volunteer: User | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface VolunteerProfile {
  user: User;
  phone_number?: string;
  skills?: string;
  availability?: string;
  is_onboarded: boolean;
}

export type CaseStatus = 'NEW' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'PENDING' | 'RESOLVED' | 'CLOSED';

export interface CaseTableProps {
  cases: Case[];
  selectedCases: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectCase: (caseId: string, checked: boolean) => void;
  loading: boolean;
  onViewCase: (caseId: string) => void;
}

export interface CaseFilters {
  status: string;
  urgency: string;
  search: string;
  assignee: string;
}

export interface BulkActionsProps {
  selectedCount: number;
  onBulkAssign: () => void;
  onBulkStatusChange: () => void;
  loading: boolean;
}

export interface OverviewCardsProps {
  cases: Case[];
  loading: boolean;
}
