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
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUsersQuery } from "@/hooks/queries/use-user.query";
import { User } from "@/types/user.types";
import { RiScanLine, RiUserLine } from "@remixicon/react";
import { useState } from "react";
import AddUserDialog from "./components/add-user.dialog";
import { EditUserDialog } from "./components/edit-user.dialog";
import UsersTable from "./components/users.table";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { data, isLoading, refetch } = useUsersQuery(page, 10);
  const users = data?.users || [];
  const total = data?.total || 0;
  const limit = data?.limit || 10;

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
                  <BreadcrumbPage>Utilisateurs</BreadcrumbPage>
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
                <RiUserLine className="text-primary" />
                Utilisateurs
              </h1>
              <p className="text-sm text-muted-foreground">Gérez les utilisateurs de votre institution.</p>
            </div>
            <AddUserDialog onSuccess={refetch} />
          </div>
          <UsersTable
            users={users}
            isLoading={isLoading}
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onEdit={(user) => setEditingUser(user)}
            onDelete={() => refetch()}
          />
        </div>
      </SidebarInset>
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSuccess={() => {
          setEditingUser(null);
          refetch();
        }}
      />
    </SidebarProvider>
  );
}
