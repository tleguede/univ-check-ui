export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// export interface AcademicYearResponse {
//   academicYears: AcademicYear[];
//   total: number;
//   page: number;
//   limit: number;
// }

export interface CreateOrganizationInput {
  name: string;
}

export interface UpdateOrganizationInput {
  id: string;
  name?: string;
}
