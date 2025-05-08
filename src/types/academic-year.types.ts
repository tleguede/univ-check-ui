export interface AcademicYear {
  id: string;
  periode: string;
  createdAt: string;
  updatedAt: string;
}

// export interface AcademicYearResponse {
//   academicYears: AcademicYear[];
//   total: number;
//   page: number;
//   limit: number;
// }

export interface CreateAcademicYearInput {
  periode: string;
}

export interface UpdateAcademicYearInput {
  id: string;
  periode?: string;
}
