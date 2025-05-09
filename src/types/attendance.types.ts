export interface Attendance {
  id: string;
  professorId: string;
  courseId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceResponse {
  attendances: Attendance[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAttendanceInput {
  courseId: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  comments?: string;
}

export interface UpdateAttendanceInput {
  id: string;
  status?: "PRESENT" | "ABSENT" | "LATE";
  comments?: string;
}

export interface Course {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  hasAttendance: boolean;
}
