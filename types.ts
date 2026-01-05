
export enum JobStatus {
  OPEN = 'Current Opening',
  CLOSED = 'Closed'
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  PROCESSING = 'Processing',
  ACTION_REQUIRED = 'Action Required',
  INTERVIEW = 'Interview',
  SELECTED = 'Selected',
  PENDING_ARRIVAL = 'Pending Arrival',
  ARRIVED = 'Arrived',
  REJECTED = 'Rejected',
  BLACKLISTED = 'Blacklisted'
}

export type ProgressRequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface DocumentFeedback {
  docId: string;
  message: string;
  timestamp: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryRange: string;
  experience: string;
  industry: string;
  postedDate: string;
  status: JobStatus;
  description: string;
  requirements: string[];
  isReopened?: boolean;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  candidateName: string;
  contactNumber: string;
  email: string;
  linkedInProfile?: string;
  status: ApplicationStatus;
  appliedDate: string;
  source: 'Direct' | 'Agency' | 'Referral'; 
  agencyName?: string;
  hasResume: boolean;
  hasCerts: boolean;
  hasPassport: boolean;
  hasPCC: boolean;
  hasGoodStanding: boolean;
  statusAccessGranted: boolean; 
  statusRequestStatus?: ProgressRequestStatus;
  adminFeedback?: string;
  blockedReason?: string;
  documentFeedbacks?: DocumentFeedback[]; // Per-document corrections
}

export interface User {
  name: string;
  email: string;
  role: 'candidate' | 'employer';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
