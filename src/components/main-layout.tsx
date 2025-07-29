
"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainNav />
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b bg-background p-2 md:justify-end">
          <SidebarTrigger className="md:hidden" />
          {/* Add header content here if needed */}
        </header>
        <main className="min-h-[calc(100vh_-_3rem)] bg-muted/40 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
