"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useUpdateAcademicYearMutation } from "@/hooks/queries/use-academic-year.query";
import { AcademicYear } from "@/types/academic-year.types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const academicYearSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date({
    required_error: "La date de fin est requise",
  }),
  isActive: z.boolean().default(false),
}).refine(data => data.endDate > data.startDate, {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});

type FormValues = z.infer<typeof academicYearSchema>;

interface EditAcademicYearDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear: AcademicYear | null;
}

export function EditAcademicYearDialog({ 
  isOpen, 
  onOpenChange,
  academicYear,
}: EditAcademicYearDialogProps) {
  const { mutate: updateAcademicYear, isSuccess, isPending } = useUpdateAcademicYearMutation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
    },
  });
  
  // Reset form with academic year data when dialog opens or academic year changes
  useEffect(() => {
    if (academicYear && isOpen) {
      form.reset({
        name: academicYear.name,
        startDate: new Date(academicYear.startDate),
        endDate: new Date(academicYear.endDate),
        isActive: academicYear.isActive,
      });
    }
  }, [academicYear, form, isOpen]);
  
  const onSubmit = (data: FormValues) => {
    if (!academicYear) return;
    
    updateAcademicYear({
      id: academicYear.id,
      name: data.name,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      isActive: data.isActive,
    });
  };
  
  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);
  
  if (!academicYear) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'année académique</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'année académique {academicYear.name}.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'année académique</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2025-2026" {...field} />
                  </FormControl>
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
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
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
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
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
                    <FormDescription>
                      Définir cette année académique comme l'année en cours
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
              >
                {isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}