import { SignInInput } from "@/schema/sign-in.schema";
import { AuthService } from "@/server/services/auth.service";
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
        // Stocker le token
        localStorage.setItem("auth-token", data.token);
        
        // Mettre à jour le cache avec les données initiales
        queryClient.setQueryData(authQueryKeys.user, data.user);
        
        // Attendre un court instant pour s'assurer que le token est bien stocké
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Récupérer les données complètes de l'utilisateur
        const userData = await AuthService.getCurrentUser(data.token);
        if (userData) {
          // Mettre à jour le cache avec les données complètes
          queryClient.setQueryData(authQueryKeys.user, userData);
          // Forcer l'invalidation du cache pour s'assurer que les composants se mettent à jour
          await queryClient.invalidateQueries({ 
            queryKey: authQueryKeys.user,
            refetchType: 'active'
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
        // En cas d'erreur, nettoyer le token
        localStorage.removeItem("auth-token");
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
      localStorage.removeItem("auth-token");

      queryClient.setQueryData(authQueryKeys.user, null);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
    },
  });
}

export function useCurrentUser() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour mettre à jour le token
    const updateToken = () => {
      const storedToken = localStorage.getItem("auth-token");
      setToken(storedToken);
    };

    // Mettre à jour le token initial
    updateToken();

    // Écouter les changements dans le localStorage
    window.addEventListener("storage", updateToken);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
      if (!token) return null;
      try {
        const user = await AuthService.getCurrentUser(token);
        if (!user) {
          // Si l'utilisateur n'est pas trouvé, supprimer le token
          localStorage.removeItem("auth-token");
          setToken(null);
        }
        return user;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        // En cas d'erreur, supprimer le token
        localStorage.removeItem("auth-token");
        setToken(null);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    // Ajouter des options pour s'assurer que les données sont toujours à jour
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
