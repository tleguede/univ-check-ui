import { UserService } from "@/server/services/user.service";
import { User } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const userQueryKeys = {
  users: ["users"],
  user: (id: string) => ["user", id],
};

export function useUsersQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...userQueryKeys.users, page, limit],
    queryFn: async () => {
      const allUsers = await UserService.getUsers();
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        users: allUsers.slice(start, end),
        total: allUsers.length,
        page,
        limit,
      };
    },
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: userQueryKeys.user(id),
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<User, "id" | "createdAt" | "updatedAt">) => UserService.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => UserService.updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.users });
    },
  });
}
