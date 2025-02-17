"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex bg-background">
          {!isAuthPage && (
            <div className="fixed inset-y-0 left-0 w-64">
              <Sidebar />
            </div>
          )}
          <main className={isAuthPage ? "w-full" : "ml-64 flex-1"}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
