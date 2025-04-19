import { authClient } from "@/lib/client";
import { SignInInput } from "@/schema/sign-in.schema";
import { AuthService } from "@/server/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const authQueryKeys = {
  user: ["currentUser"],
  session: ["session"],
};
const SESSION_EXPIRY = 60 * 60 * 24 * 7;

// Fonction utilitaire pour récupérer le token depuis les cookies
function getTokenFromCookies(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return value;
    }
  }
  return null;
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInInput) => AuthService.signIn(credentials),
    onSuccess: async (data) => {
      try {
        // Stocker le token uniquement dans les cookies
        document.cookie = `auth-token=${data.token}; path=/; max-age=${SESSION_EXPIRY}; SameSite=Lax`;
        
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
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
      // Supprimer le token des cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

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
      const storedToken = getTokenFromCookies();
      setToken(storedToken);
    };

    // Mettre à jour le token initial
    updateToken();

    // Écouter les changements dans les cookies
    const checkCookies = () => {
      updateToken();
    };

    // Vérifier les cookies toutes les secondes
    const interval = setInterval(checkCookies, 1000);

    // Nettoyer l'intervalle
    return () => {
      clearInterval(interval);
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
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setToken(null);
        }
        return user;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        // En cas d'erreur, supprimer le token
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setToken(null);
        return null;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
