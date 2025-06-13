"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messages } from "@/config/messages";
import { routes } from "@/config/routes";
import { useSignInMutation } from "@/hooks/queries/use-auth.query";
import { signInSchema, type SignInInput } from "@/schema/sign-in.schema";
import { AuthenticationError } from "@/server/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSignInMutation();

  // Effet pour gérer la redirection de manière fiable
  useEffect(() => {
    // Cette logique ne s'exécute que lorsque isRedirecting est true
    if (isRedirecting) {
      const redirectTimer = setTimeout(() => {
        router.replace(routes.board.home);
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isRedirecting, router]);

  function onSubmit(data: SignInInput) {
    setFormError(null);
    // Toast de chargement
    const loadingToast = toast.loading("Connexion en cours...");

    signIn(data, {
      onSuccess: (data) => {
        try {
          toast.success(`Bienvenue, ${data.user.name}`);
          console.log("Authentication successful, preparing to redirect to:", routes.board.home);

          // Déclencher la redirection via l'effet
          setIsRedirecting(true);
        } catch (error) {
          console.error("Erreur lors de la redirection:", error);
          toast.error("Une erreur est survenue lors de la connexion.");
        }
      },
      onError: (error) => {
        if (error instanceof AuthenticationError) {
          setFormError(messages.auth.signin.failed);
        } else {
          setFormError("Une erreur est survenue lors de la connexion.");
        }
        toast.error(
          error instanceof AuthenticationError ? messages.auth.signin.failed : "Une erreur est survenue lors de la connexion."
        );
      },
      onSettled: () => {
        toast.dismiss(loadingToast);
      },
    });
  }

  // Le reste du code reste inchangé
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Connexion</CardTitle>
        <CardDescription>Connectez-vous pour accéder au système de gestion des présences</CardDescription>
      </CardHeader>

      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nom@université.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending || isRedirecting}>
              {isPending ? "Connexion en cours..." : isRedirecting ? "Redirection..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center w-full">
          <Link href={routes.auth.forgotPassword} className="text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
