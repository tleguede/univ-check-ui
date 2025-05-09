import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UniversityService } from "@/server/services/university.service";
import { CreateUniversityInput, UpdateUniversityInput } from "@/types/university.types";
import { toast } from "sonner";

export const useUniversitiesQuery = () => {
  return useQuery({
    queryKey: ["universities"],
    queryFn: () => UniversityService.getUniversities(),
  });
};

export const useUniversityQuery = (id: string) => {
  return useQuery({
    queryKey: ["universities", id],
    queryFn: () => UniversityService.getUniversityById(id),
  });
};

export const useCreateUniversityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUniversityInput) => UniversityService.createUniversity(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      toast.success("Université créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'université");
    },
  });
};

export const useUpdateUniversityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUniversityInput) => UniversityService.updateUniversity(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      toast.success("Université mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'université");
    },
  });
};

export const useDeleteUniversityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UniversityService.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      toast.success("Université supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'université");
    },
  });
};
