/**
 * Utility functions for authentication
 */

/**
 * Récupère le token d'authentification stocké localement
 * @returns {string|null} Le token d'authentification ou null si non disponible
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null; // Vérification côté serveur

  try {
    const authData = localStorage.getItem("auth-user");
    if (!authData) return null;

    const parsedData = JSON.parse(authData);
    return parsedData?.token || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
}
