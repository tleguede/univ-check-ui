import { AcademicYearService } from "@/server/services/academic-year.service";
import { AcademicYear, CreateAcademicYearInput, UpdateAcademicYearInput } from "@/types/academic-year.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const academicYearQueryKeys = {
  academicYears: ["academic-years"],
  academicYear: (id: string) => ["academic-year", id],
};

export function useAcademicYearsQuery() {
  return useQuery<AcademicYear[]>({
    queryKey: academicYearQueryKeys.academicYears,
    queryFn: () => AcademicYearService.getAcademicYears(),
  });
}

export function useAcademicYearQuery(id: string) {
  return useQuery<AcademicYear>({
    queryKey: academicYearQueryKeys.academicYear(id),
    queryFn: () => AcademicYearService.getAcademicYearById(id),
    enabled: !!id,
  });
}

export function useCreateAcademicYearMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAcademicYearInput) => AcademicYearService.createAcademicYear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearQueryKeys.academicYears });
    },
  });
}

export function useUpdateAcademicYearMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAcademicYearInput) => AcademicYearService.updateAcademicYear(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: academicYearQueryKeys.academicYear(data.id) });
      queryClient.invalidateQueries({ queryKey: academicYearQueryKeys.academicYears });
    },
  });
}

export function useDeleteAcademicYearMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AcademicYearService.deleteAcademicYear(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: academicYearQueryKeys.academicYear(id) });
      queryClient.invalidateQueries({ queryKey: academicYearQueryKeys.academicYears });
    },
  });
}
