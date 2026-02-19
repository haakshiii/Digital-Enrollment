
export interface StudentProfile {
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  department: string;
  studentCode: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'OD';
  subject: string;
  subjectCode: string;
  timestamp?: string;
}

export interface ODPass {
  id: string;
  title: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  documents: string[]; // Base64 strings or URLs
  mentorName?: string;
  approvalDate?: string;
}

export type ViewType = 'dashboard' | 'attendance' | 'od-pass' | 'profile';
