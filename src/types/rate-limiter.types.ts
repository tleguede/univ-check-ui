/**
 * Interface pour stocker les tentatives de connexion
 */
export interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockExpires: number | null;
}

/**
 * Configuration du limiteur de débit
 */
export interface RateLimiterConfig {
  maxAttempts: number;
  blockDuration: number;
  windowDuration: number;
}
