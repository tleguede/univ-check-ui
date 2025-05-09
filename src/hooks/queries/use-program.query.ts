import { ProgramService } from "@/server/services/program.service";
import { CreateProgramInput, Program, UpdateProgramInput } from "@/types/program.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const programsQueryKeys = {
  programs: ["programs"],
  program: (id: string) => ["program", id],
};

export function useProgramsQuery() {
  return useQuery<Program[]>({
    queryKey: programsQueryKeys.programs,
    queryFn: () => ProgramService.getPrograms(),
  });
}

export function useProgramQuery(id: string) {
  return useQuery<Program>({
    queryKey: programsQueryKeys.program(id),
    queryFn: () => ProgramService.getProgramById(id),
    enabled: !!id,
  });
}

export function useCreateProgramMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProgramInput) => ProgramService.createProgram(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programsQueryKeys.programs });
    },
  });
}

export function useUpdateProgramMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProgramInput) => ProgramService.updateProgram(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: programsQueryKeys.program(data.id) });
      queryClient.invalidateQueries({ queryKey: programsQueryKeys.programs });
    },
  });
}

export function useDeleteProgramMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProgramService.deleteProgram(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: programsQueryKeys.program(id) });
      queryClient.invalidateQueries({ queryKey: programsQueryKeys.programs });
    },
  });
}