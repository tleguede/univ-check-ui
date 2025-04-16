import { AcademicYearService } from "@/server/services/academic-year.service";
import { CreateAcademicYearInput, UpdateAcademicYearInput } from "@/types/academic-year.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const academicYearQueryKeys = {
  academicYears: ["academic-years"],
  academicYear: (id: string) => ["academic-year", id],
};

export function useAcademicYearsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...academicYearQueryKeys.academicYears, page, limit],
    queryFn: () => AcademicYearService.getAcademicYears(page, limit),
  });
}

export function useAcademicYearQuery(id: string) {
  return useQuery({
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
