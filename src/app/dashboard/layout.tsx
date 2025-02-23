import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Menu from "@/components/dashboard/Menu";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
// import auth  from "@/auth";
// import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userRole = session.user.role?.toLowerCase();

  if (!["admin", "teacher", "student"].includes(userRole)) {
    redirect("/auth/error"); // Redirect to an error page if role is invalid
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Menu />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto mt-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
