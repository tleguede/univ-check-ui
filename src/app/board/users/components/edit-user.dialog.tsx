"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUserMutation } from "@/hooks/queries/use-user.query";
import { UserData } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  role: z.string().min(1, "Rôle requis"),
});
type UserFormInput = z.infer<typeof userSchema>;

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const form = useForm<UserFormInput>({
    resolver: zodResolver(userSchema),
    defaultValues: user || { id: "", name: "", email: "", phone: "", role: "USER" },
  });
  const { mutate: updateUser, isPending } = useUpdateUserMutation();

  useEffect(() => {
    if (user) form.reset(user);
  }, [user, form]);

  function onSubmit(values: UserFormInput) {
    updateUser(values, {
      onSuccess: () => {
        toast.success("Utilisateur mis à jour avec succès");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
        console.error("Mise à jour d'utilisateur échouée:", error);
      },
    });
  }

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Enseignant</option>
            <option value="SUPERVISOR">Surveillant</option>
            <option value="DELEGATE">Délégué</option>
          </select>
          <div className="flex gap-2 justify-end">
            <Button type="submit">Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
