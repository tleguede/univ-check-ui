import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "dd MMMM yyyy", { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date invalide";
  }
}
