import { OrganizationService } from "@/server/services/organizations.service";
import { CreateOrganizationInput, Organization, UpdateOrganizationInput } from "@/types/organization.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const organizationsQueryKeys = {
  organizations: ["organizations"],
  organization: (id: string) => ["organization", id],
};

export function useOrganizationsQuery() {
  return useQuery<Organization[]>({
    queryKey: organizationsQueryKeys.organizations,
    queryFn: () => OrganizationService.getOrganizations(),
  });
}

export function useOrganisationQuery(id: string) {
  return useQuery<Organization>({
    queryKey: organizationsQueryKeys.organization(id),
    queryFn: () => OrganizationService.getOrganizationById(id),
    enabled: !!id,
  });
}

export function useCreateOrganisationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => OrganizationService.createOrganization(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKeys.organizations });
    },
  });
}

export function useUpdateOrganisationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) => OrganizationService.updateOrganization(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationsQueryKeys.organization(data.id) });
      queryClient.invalidateQueries({ queryKey: organizationsQueryKeys.organizations });
    },
  });
}

export function useDeleteOrganisationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrganizationService.deleteOrganization(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: organizationsQueryKeys.organization(id) });
      queryClient.invalidateQueries({ queryKey: organizationsQueryKeys.organizations });
    },
  });
}
