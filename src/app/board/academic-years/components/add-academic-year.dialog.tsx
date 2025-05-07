"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useCreateAcademicYearMutation } from "@/hooks/queries/use-academic-year.query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const academicYearSchema = z
  .object({
    periode: z.string().min(2, "La période doit contenir au moins 2 caractères"),
    startDate: z.date({
      required_error: "La date de début est requise",
    }),
    endDate: z.date({
      required_error: "La date de fin est requise",
    }),
    isActive: z.boolean().default(false),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof academicYearSchema>;

interface AddAcademicYearDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddAcademicYearDialog({ isOpen, onOpenChange, onSuccess }: AddAcademicYearDialogProps) {
  const { mutate: createAcademicYear, isPending } = useCreateAcademicYearMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      periode: "",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      isActive: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    createAcademicYear(values, {
      onSuccess: () => {
        toast.success("Année académique créée avec succès");
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la création de l'année académique");
      },
    });
  };

  const isDateDisabled = (date: Date, field: "startDate" | "endDate") => {
    if (field === "startDate") return false;
    const startDate = form.getValues("startDate");
    return startDate ? date < startDate : false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une année académique</DialogTitle>
          <DialogDescription>Créez une nouvelle année académique pour votre institution.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="periode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période académique</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2025-2026" {...field} />
                  </FormControl>
                  <FormDescription>Saisissez la période académique.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de début</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? format(field.value, "P", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => isDateDisabled(date, "startDate")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDateDisabled(field.value, "endDate")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Année active</FormLabel>
                    <FormDescription>Définir cette année académique comme l&apos;année en cours</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Création en cours..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
