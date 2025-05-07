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
import { useAcademicYearsQuery } from "@/hooks/queries/use-academic-year.query";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { RiCalendarLine, RiScanLine } from "@remixicon/react";
import { useState } from "react";
import { AcademicYearsTable } from "./components/academic-years.table";
import { AddAcademicYearDialog } from "./components/add-academic-year.dialog";

export default function AcademicYearsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const { data, isLoading } = useAcademicYearsQuery(page, limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
                  <BreadcrumbPage>Années Académiques</BreadcrumbPage>
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
                <RiCalendarLine className="text-primary" />
                Années Académiques
              </h1>
              <p className="text-sm text-muted-foreground">Gérez les années académiques de votre institution.</p>
            </div>
            {user?.user?.role === "ADMIN" && <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter une année</Button>}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <AcademicYearsTable
              academicYears={data?.academicYears || []}
              isLoading={isLoading}
              page={page}
              limit={limit}
              total={data?.total || 0}
              onPageChange={handlePageChange}
              isAdmin={user?.user?.role === "ADMIN"}
            />
          </div>
        </div>
      </SidebarInset>

      {/* Add Academic Year Dialog */}
      <AddAcademicYearDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </SidebarProvider>
  );
}
