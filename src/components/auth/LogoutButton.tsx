"use client"
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const LogoutButton = () => {
    return (
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center w-full gap-4 py-2 px-2 rounded-md hover:scale-105 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="hidden lg:block">Logout</span>
        </Button>
    );
  };