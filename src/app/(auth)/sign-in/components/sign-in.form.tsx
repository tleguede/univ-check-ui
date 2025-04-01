"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { signInSchema, type SignInInput } from "@/schema/sign-in.schema";
import { messages } from "@/config/messages";
import { AUTH_CONSTANTS } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useSignIn } from "@/hooks/auth/use-sign-in";

export function SignInForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      toast.success(messages.auth.signin.success);
      // Ici, vous pourriez rediriger l'utilisateur ou mettre à jour l'état global
    },
    onError: (error) => {
      setFormError(messages.auth.signin.failed);
      toast.error(messages.auth.signin.failed);
    },
  });

  function onSubmit(data: SignInInput) {
    setFormError(null);

    // Toast de chargement
    const loadingToast = toast.loading("Connexion en cours...");

    // Utiliser le hook de mutation pour gérer la connexion
    signIn(data, {
      onSettled: () => {
        // Fermer le toast de chargement quand terminé (succès ou erreur)
        toast.dismiss(loadingToast);
      },
    });
  }

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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Connexion en cours..." : "Se connecter"}
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
