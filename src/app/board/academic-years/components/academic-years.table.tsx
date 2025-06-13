"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteAcademicYearMutation } from "@/hooks/queries/use-academic-year.query";
import { formatDate } from "@/lib/utils";
import { AcademicYear } from "@/types/academic-year.types";
import { RiDeleteBinLine, RiEdit2Line } from "@remixicon/react";

interface AcademicYearsTableProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (year: AcademicYear) => void;
  onDelete: () => void;
}

export function AcademicYearsTable({ academicYears, isLoading, isAdmin, onEdit, onDelete }: AcademicYearsTableProps) {
  const { mutate: deleteAcademicYear } = useDeleteAcademicYearMutation();

  const handleDelete = (id: string) => {
    deleteAcademicYear(id, {
      onSuccess: () => {
        onDelete();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des années académiques...</p>
      </div>
    );
  }

  if (academicYears.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Aucune année académique trouvée.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Période</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Date de modification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {academicYears.map((year) => (
            <TableRow key={year.id}>
              <TableCell className="font-medium">{year.periode}</TableCell>
              <TableCell>{formatDate(year.createdAt)}</TableCell>
              <TableCell>{formatDate(year.updatedAt)}</TableCell>
              <TableCell className="text-right">
                {isAdmin && (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(year)}>
                      <RiEdit2Line className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <RiDeleteBinLine className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement l&apos;année académique{" "}
                            {year.periode}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(year.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
