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
import { PiBuildingsDuotone } from "react-icons/pi";
import { EditOrganizationDialog } from "./components/edit-organizations.dialog";
import { useOrganizationsQuery } from "@/hooks/queries/use-organizations.query";
import { Organization } from "@/types/organization.types";
import { RiScanLine } from "@remixicon/react";
import { useState } from "react";
import { AddOrganizationDialog } from "./components/add-organization.dialog";
import { OrganizationsTable } from "./components/organizations.table";

export default function AcademicYearsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<Organization | null>(null);

  const { data: user } = useCurrentUser();
  const { data: organizations, isLoading, refetch } = useOrganizationsQuery();

  // const isAdmin = user?.user?.role === "ADMIN";
  const isAdmin = true;
  console.log("user", user);
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
                  <BreadcrumbPage>Organisations</BreadcrumbPage>
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
                <PiBuildingsDuotone className="text-primary" />
                Organisations
              </h1>
              <p className="text-sm text-muted-foreground">Gérez les organisations de votre institution.</p>
            </div>
            {isAdmin && <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter</Button>}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <OrganizationsTable
              organizations={organizations || []}
              isLoading={isLoading}
              isAdmin={isAdmin}
              onEdit={(org) => setEditingYear(org)}
              onDelete={() => refetch()}
            />
          </div>
        </div>
      </SidebarInset>

      {/* Add Organization Dialog */}
      <AddOrganizationDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => refetch()} />

      {/* Edit Organization Dialog */}
      <EditOrganizationDialog
        isOpen={!!editingYear}
        onOpenChange={(open) => !open && setEditingYear(null)}
        organization={editingYear}
      />
    </SidebarProvider>
  );
}
