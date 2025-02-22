import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
// import auth  from "@/auth";
// import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

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

  // if (!["admin", "teacher", "student"].includes(userRole)) {
  //   redirect("/auth/error"); // Redirect to an error page if role is invalid
  // }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="fixed top-0 bg-white dark:bg-gray-900 z-50 w-full">
          <Navbar />
        </div>
        <Menu />
        <div className="w-full bg-[#F7F8FA] dark:bg-black flex h-full pt-20">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
