import { SignInInput } from "@/schema/sign-in.schema";
import { AuthService } from "@/server/services/auth.service";
import { AuthResponse } from "@/types/auth.types";
import { setCookie } from "@/utils/cookies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const authQueryKeys = {
  user: ["currentUser"],
  session: ["session"],
};

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInInput) => AuthService.signIn(credentials),
    onSuccess: async (data) => {
      try {
        // Stocker toutes les infos utilisateur + token dans localStorage
        localStorage.setItem("auth-user", JSON.stringify(data));

        // Également définir un cookie pour le token (pour le middleware)
        if (data.token) {
          setCookie("auth-token", data.token, 7); // Cookie valide pour 7 jours
        }

        // Mettre à jour le cache React Query
        queryClient.setQueryData(authQueryKeys.user, data);
      } catch (error) {
        localStorage.removeItem("auth-user");
        throw error;
      }
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      localStorage.removeItem("auth-user");
      // Supprimer le cookie d'authentification
      setCookie("auth-token", "", -1);
      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
    },
  });
}

export function useCurrentUser() {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("auth-user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => user,
    enabled: true,
    staleTime: 1000 * 60 * 60,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
