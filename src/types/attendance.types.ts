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

// Nouveaux types pour les sessions de cours et émargement selon l'API Swagger

export interface ClassSession {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  course: Course;
  professor: any; // Peut être remplacé par un type plus précis comme User
  classRepresentative: any; // Peut être remplacé par un type plus précis comme User
  academicYear: any; // Peut être remplacé par un type AcademicYear
  createdAt: string;
  updatedAt: string;
}

export interface ClassSessionResponse {
  classSessions: ClassSession[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateClassSessionInput {
  date: string;
  heureDebut: string;
  heureFin: string;
  academicYearId: string;
  courseId: string;
  professorId: string;
  classRepresentativeId: string;
}

export interface UpdateClassSessionInput {
  id: string;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  academicYearId?: string;
  courseId?: string;
  professorId?: string;
  classRepresentativeId?: string;
}

export interface Emargement {
  id: string;
  status: "PENDING" | "PRESENT" | "ABSENT" | "SUPERVISOR_CONFIRMED" | "CLASS_HEADER_CONFIRMED";
  classSession: ClassSession;
  professor: any; // Peut être remplacé par un type User
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmargementInput {
  status: "PENDING" | "PRESENT" | "ABSENT" | "SUPERVISOR_CONFIRMED" | "CLASS_HEADER_CONFIRMED";
  classSessionId: string;
  professorId: string;
}

export interface UpdateEmargementInput {
  id: string;
  status?: "PENDING" | "PRESENT" | "ABSENT" | "SUPERVISOR_CONFIRMED" | "CLASS_HEADER_CONFIRMED";
}
