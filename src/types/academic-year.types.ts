export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearResponse {
  academicYears: AcademicYear[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAcademicYearInput {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateAcademicYearInput {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}