import MobileMenu from "@/components/mobile-menu";
import Sidebar from "@/components/sidebar";
import AlertManager from "@/components/alert-manager";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <Sidebar />
          </div>
          <div className="flex flex-col">
            <MobileMenu />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        <AlertManager />
        <Toaster />
      </ThemeProvider>
  );
}