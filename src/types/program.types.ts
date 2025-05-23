export interface Program {
    id: string;
    name: string;
    departement: {
      id: string;
      name: string;
      university: {
        id: string;
        name: string;
        organisation: {
          id: string;
          name: string;
          createdAt: string;
          updatedAt: string;
        };
        responsable: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: string;
          createdAt: string;
          updatedAt: string;
        };
        departements: string[];
        createdAt: string;
        updatedAt: string;
      };
      programs: string[];
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateProgramInput {
    name: string;
    departementId: string;
  }
  
  export interface UpdateProgramInput {
    id: string;
    name?: string;
    departementId?: string;
  }