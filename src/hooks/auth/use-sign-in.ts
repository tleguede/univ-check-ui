import { useMutation } from "@tanstack/react-query";
import { type SignInInput } from "@/schema/sign-in.schema";
import { AUTH_CONSTANTS } from "@/config/constants";

// Simuler une API d'authentification
async function signInApi(credentials: SignInInput): Promise<{ user: { email: string; role: string } }> {
  // Simuler un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { ADMIN, PROFESSOR } = AUTH_CONSTANTS.DEMO_CREDENTIALS;

  if (credentials.email === ADMIN.email && credentials.password === ADMIN.password) {
    return { user: { email: ADMIN.email, role: "admin" } };
  } else if (credentials.email === PROFESSOR.email && credentials.password === PROFESSOR.password) {
    return { user: { email: PROFESSOR.email, role: "professor" } };
  } else {
    throw new Error("Identifiants incorrects");
  }
}

type UseSignInOptions = {
  onSuccess?: (data: { user: { email: string; role: string } }) => void;
  onError?: (error: Error) => void;
};

export function useSignIn(options?: UseSignInOptions) {
  return useMutation({
    mutationFn: signInApi,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
