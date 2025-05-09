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
import { useProfessorTodaysCoursesQuery } from "@/hooks/queries/use-attendance.query";
import { useCurrentUser } from "@/hooks/queries/use-auth.query";
import { RiCheckboxLine, RiScanLine } from "@remixicon/react";
import { TodaysCoursesList } from "./components/todays-courses-list";

export default function AttendancePage() {
  const { data: user } = useCurrentUser();
  const userId = user?.user?.id;
  const isProfessor = user?.user?.role === "TEACHER";

  const { data: todaysCourses, isLoading, refetch } = useProfessorTodaysCoursesQuery(userId || "");

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
                  <BreadcrumbPage>Émargement</BreadcrumbPage>
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
                <RiCheckboxLine className="text-primary" />
                Émargement des cours
              </h1>
              <p className="text-sm text-muted-foreground">Émargez vos cours du jour pour confirmer votre présence.</p>
            </div>
            <Button onClick={() => refetch()}>Actualiser</Button>
          </div>

          {/* Courses List */}
          <div className="flex-1 overflow-auto">
            {isProfessor ? (
              <TodaysCoursesList courses={todaysCourses || []} isLoading={isLoading} onAttendanceSubmitted={() => refetch()} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  Vous n&apos;êtes pas autorisé à accéder à cette page. Seuls les professeurs peuvent émarger.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
