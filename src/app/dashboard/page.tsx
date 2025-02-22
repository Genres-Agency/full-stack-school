"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (!user) {
    return redirect("/");
  }

  if (status === "loading") return <p>Loading...</p>;

  const role = (session?.user?.role as string)?.toLowerCase();
  


  return redirect(`/dashboard/${role}`);
}
