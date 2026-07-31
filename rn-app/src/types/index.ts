export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export interface Course {
  code: string;
  title: string;
  credits: number;
  lecturer: string;
  description?: string;
  prerequisites?: string;
  schedule?: string;
  venue?: string;
  enrolled?: number;
  capacity?: number;
}

export interface Submission {
  id: string;
  name: string;
  studentId: string;
  program: string;
  level: string;
  submittedAt: string;
  status: VerificationStatus;
  courses: number;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}
