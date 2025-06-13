"use client";

import { AppSidebar } from "@/components/shared/navigation/app.sidebar";
import UserDropdown from "@/components/shared/navigation/user.dropdown";
import FeedbackDialog from "@/components/shared/others/feedback.dialog";
import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { RiBookmarkLine, RiScanLine } from "@remixicon/react";
import { useState } from "react";
import { EditProgramDialog } from "./components/edit-program.dialog";
import { useProgramsQuery } from "@/hooks/queries/use-program.query";
import { Program } from "@/types/program.types";
import { ProgramsTable } from "./components/programs.table";
import { AddProgramDialog } from "./components/add-program.dialog";

export default function ProgramsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  useCurrentUser();
  const { data: programs, isLoading, refetch } = useProgramsQuery();

  // const isAdmin = user?.user?.role === "ADMIN";
  const isAdmin = true;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ms-4" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/board">
                    <RiScanLine size={22} aria-hidden="true" />
                    <span className="sr-only">Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Programmes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-3 ml-auto">
            <FeedbackDialog />
            <ModeToggle />
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
          {/* Page intro */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <RiBookmarkLine className="text-primary" />
                Programmes
              </h1>
              <p className="text-sm text-muted-foreground">Gérez les programmes académiques de votre institution.</p>
            </div>
            {isAdmin && <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter</Button>}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <ProgramsTable
              programs={programs || []}
              isLoading={isLoading}
              isAdmin={isAdmin}
              onEdit={(program) => setEditingProgram(program)}
              onDelete={() => refetch()}
            />
          </div>
        </div>
      </SidebarInset>

      {/* Add Program Dialog */}
      <AddProgramDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => refetch()} />

      {/* Edit Program Dialog */}
      <EditProgramDialog
        isOpen={!!editingProgram}
        onOpenChange={(open) => !open && setEditingProgram(null)}
        program={editingProgram}
        onSuccess={() => refetch()}
      />
    </SidebarProvider>
  );
}