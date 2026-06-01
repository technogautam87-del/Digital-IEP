export type DomainType = string;

export interface StudentProfile {
  studentId: string; // unique search roll number
  schoolName: string;
  studentName: string;
  className: string;
  disabilityType: string;
  disabilityCertificate: boolean;
  generalTeacher: string;
  specialTeacher: string;
  dateOfBirth: string; // added for automatic age calculation
  block?: string;      // added for visualization dashboard
  district?: string;   // added for visualization dashboard
  learningOutcomeCycle?: string; // added for mandatory initial cycle target selector: weekly, monthly, 6monthly
}

export interface BehaviorItem {
  id: string;
  text: string;
  checked: boolean;
  isNoneOfTheAbove?: boolean; // dynamic field for "none of the above" behavior selection
}

export type Checklists = Record<DomainType, BehaviorItem[]>;
export type EducatorNotes = Record<DomainType, string>;

export interface UserRole {
  id: string;
  name: string;
  accessLevel: "Full Access" | "IEP Edit Access" | "View Only";
  assignedUsersCount: number;
}

export interface DomainArchitectureItem {
  id: string;
  title: string;
  description: string;
  subdomains: string[];
}

export interface Preferences {
  defaultReportFormat: string;
  customFooterText: string;
  showAiSidebar: boolean;
  showExperimental: boolean;
}

export interface SystemAnalytics {
  totalStudents: number;
  iepsCompleted: number;
  activeTeachers: number;
  pendingReviews: number;
  domainProgress: Record<DomainType, number>;
  disabilityDistribution: { name: string; percentage: number; color: string }[];
}

export interface StudentRecord {
  id: string; // matches studentId
  profile: StudentProfile;
  checklists: Checklists;
  notes: EducatorNotes;
  draftObjective: string;
  updatedAt: string;
}
