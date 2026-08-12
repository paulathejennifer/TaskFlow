import type { ReactNode } from "react";

import { Sidebar } from "@/app/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}