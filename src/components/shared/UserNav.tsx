"use client";
// import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogoutButton } from "../auth/LogoutButton";
export function UserNav() {
  const { data: session } = useSession();
  const role = (session?.user?.role as string)?.toLowerCase();
  const menuItems = [
    { label: "Dashboard", href: `/dashboard/${role}`, shortcut: "⇧⌘D" },
    { label: "Profile", href: `/dashboard`, shortcut: "⇧⌘P" },
  ];
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="size-10">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className="p-0 hover:bg-gray-100"
              >
                <Link
                  href={item.href}
                  className="flex h-full w-full items-center justify-between p-2"
                >
                  {item.label}
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="p-2 font-semibold hover:bg-gray-100"
          >
            <LogoutButton />

          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
