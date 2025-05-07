import { NextRequest, NextResponse } from "next/server";
import { routes } from "./config/routes";
import { loginRateLimiter } from "./server/middleware/rate-limiter";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Redirection de la racine vers la page de connexion
  if (path === "/") {
    return NextResponse.redirect(new URL(`/${routes.auth.signIn}`, request.url));
  }
  
  // Appliquer le limiteur de débit aux routes d'authentification
  if (path.includes("/api/v1/auth/signin") || path.includes("/auth/sign-in")) {
    return loginRateLimiter(request);
  }

  // Protéger les routes du tableau
  if (path.startsWith("/board")) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL(`/${routes.auth.signIn}`, request.url));
    }
  }
  
  // Continuer le traitement pour les autres routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/v1/auth/signin", "/auth/sign-in", "/board/:path*"],
};
