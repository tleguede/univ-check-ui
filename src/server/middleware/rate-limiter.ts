import { NextRequest, NextResponse } from "next/server";
import { LoginAttempt, RateLimiterConfig } from "@/types/rate-limiter.types";

// Map pour stocker les tentatives par IP
const loginAttempts = new Map<string, LoginAttempt>();

// Configuration du limiteur de débit
const rateLimiterConfig: RateLimiterConfig = {
  maxAttempts: 5, // Nombre maximum de tentatives
  blockDuration: 15 * 60 * 1000, // Durée de blocage en ms (15 minutes)
  windowDuration: 5 * 60 * 1000 // Fenêtre de temps pour les tentatives (5 minutes)
};

/**
 * Middleware de limitation de débit pour les tentatives de connexion
 * Bloque les IPs qui font trop de tentatives de connexion en peu de temps
 */
export function loginRateLimiter(req: NextRequest) {
  // Obtenir l'IP du client
  // Next.js ne fournit pas directement l'IP, nous devons l'extraire des headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  // Récupérer les tentatives existantes ou créer une nouvelle entrée
  let attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    attempt = {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
      blockExpires: null
    };
    loginAttempts.set(ip, attempt);
  }
  
  // Vérifier si l'IP est bloquée
  if (attempt.blocked) {
    // Vérifier si le blocage a expiré
    if (attempt.blockExpires && now > attempt.blockExpires) {
      // Réinitialiser les tentatives
      attempt.count = 0;
      attempt.firstAttempt = now;
      attempt.lastAttempt = now;
      attempt.blocked = false;
      attempt.blockExpires = null;
    } else {
      // L'IP est toujours bloquée
      return NextResponse.json(
        { error: "Trop de tentatives de connexion. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }
  }
  
  // Réinitialiser le compteur si la fenêtre de temps est dépassée
  if (now - attempt.firstAttempt > rateLimiterConfig.windowDuration) {
    attempt.count = 0;
    attempt.firstAttempt = now;
  }
  
  // Incrémenter le compteur de tentatives
  attempt.count++;
  attempt.lastAttempt = now;
  
  // Vérifier si le nombre maximum de tentatives est atteint
  if (attempt.count > rateLimiterConfig.maxAttempts) {
    attempt.blocked = true;
    attempt.blockExpires = now + rateLimiterConfig.blockDuration;
    
    return NextResponse.json(
      { error: "Trop de tentatives de connexion. Veuillez réessayer plus tard." },
      { status: 429 }
    );
  }
  
  // Mettre à jour la Map
  loginAttempts.set(ip, attempt);
  
  // Nettoyer périodiquement la Map pour éviter les fuites de mémoire
  cleanupLoginAttempts();
  
  // Continuer le traitement de la requête
  return NextResponse.next();
}

/**
 * Nettoie les anciennes entrées de la Map pour éviter les fuites de mémoire
 */
function cleanupLoginAttempts() {
  const now = Date.now();
  
  // Exécuter le nettoyage avec une probabilité de 1%
  // pour éviter de le faire à chaque requête
  if (Math.random() > 0.01) return;
  
  for (const [ip, attempt] of loginAttempts.entries()) {
    // Supprimer les entrées non bloquées qui n'ont pas été utilisées depuis longtemps
    if (!attempt.blocked && now - attempt.lastAttempt > rateLimiterConfig.windowDuration * 2) {
      loginAttempts.delete(ip);
    }
    
    // Supprimer les entrées bloquées dont le blocage a expiré depuis longtemps
    if (attempt.blocked && attempt.blockExpires && now > attempt.blockExpires + rateLimiterConfig.windowDuration) {
      loginAttempts.delete(ip);
    }
  }
}
