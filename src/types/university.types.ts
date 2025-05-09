export interface University {
  id: string;
  name: string;
  description?: string;
  address?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUniversityInput {
  name: string;
  description?: string;
  address?: string;
  website?: string;
}

export interface UpdateUniversityInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  website?: string;
}
