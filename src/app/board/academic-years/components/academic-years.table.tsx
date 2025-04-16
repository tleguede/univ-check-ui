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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteAcademicYearMutation } from "@/hooks/queries/use-academic-year.query";
import { formatDate } from "@/lib/utils";
import { AcademicYear } from "@/types/academic-year.types";
import { RiDeleteBinLine, RiEdit2Line } from "@remixicon/react";
import { useState } from "react";
import { EditAcademicYearDialog } from "./edit-academic-year.dialog";

interface AcademicYearsTableProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  isAdmin: boolean;
}

export function AcademicYearsTable({ academicYears, isLoading, page, limit, total, onPageChange, isAdmin }: AcademicYearsTableProps) {
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutate: deleteAcademicYear } = useDeleteAcademicYearMutation();

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAcademicYear(id);
  };

  const totalPages = Math.ceil(total / limit);

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
            <TableHead className="w-[200px]">Nom</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {academicYears.map((year) => (
            <TableRow key={year.id}>
              <TableCell className="font-medium">{year.name}</TableCell>
              <TableCell>{formatDate(year.startDate)}</TableCell>
              <TableCell>{formatDate(year.endDate)}</TableCell>
              <TableCell>
                <Badge variant={year.isActive ? "default" : "outline"}>{year.isActive ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {isAdmin && (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(year)}>
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
                            Cette action ne peut pas être annulée. Cela supprimera définitivement l&apos;année académique {year.name}.
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => page > 1 && onPageChange(page - 1)} disabled={page === 1} />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Only show current page, first, last, and pages around current
                if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= page - 1 && pageNumber <= page + 1)) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink onClick={() => onPageChange(pageNumber)} isActive={page === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis for gaps
                if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNumber}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext onClick={() => page < totalPages && onPageChange(page + 1)} disabled={page === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <EditAcademicYearDialog isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} academicYear={editingYear} />
    </div>
  );
}
