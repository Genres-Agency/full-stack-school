"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSeparator,
} from "@/components/ui/sidebar"; // Import Shadcn Sidebar components
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  MdSpaceDashboard,
  MdOutlineEventNote,
  MdOutlinePayments,
  MdAdminPanelSettings,
} from "react-icons/md";
import { GrAnnounce, GrMoney } from "react-icons/gr";
import { GiNotebook, GiTeacher, GiNewspaper } from "react-icons/gi";
import { PiExam, PiChalkboardTeacherFill } from "react-icons/pi";
import { RiPagesLine, RiFileList3Line } from "react-icons/ri";
import { FaAmazonPay, FaUsers, FaUsersCog } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { IoPersonAddSharp } from "react-icons/io5";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { CiWallet } from "react-icons/ci";
import { FaUsersRectangle } from "react-icons/fa6";
import { LogoutButton } from "../auth/LogoutButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronsUpDown, CircleUserRound } from "lucide-react";

const menuItems = [
  { icon: <MdSpaceDashboard />, label: "Dashboard", href: "/admin", visible: ["admin"] },
  { icon: <MdSpaceDashboard />, label: "Dashboard", href: "/teacher", visible: ["teacher"] },
  { icon: <MdSpaceDashboard />, label: "Dashboard", href: "/student", visible: ["student"] },
  { icon: <GrAnnounce />, label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student"] },
  { icon: <IoPersonAddSharp />, label: "Admission", href: "/list/admission", visible: ["admin"] },
  { icon: <LiaChalkboardTeacherSolid />, label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher"] },
  { icon: <PiChalkboardTeacherFill />, label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
  { icon: <ImBooks />, label: "Subjects", href: "/list/subjects", visible: ["admin"] },
  { icon: <GiTeacher />, label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
  { icon: <GiNewspaper />, label: "Assignments", href: "/list/assignments", visible: ["teacher", "student"] },
  { icon: <FaUsersRectangle />, label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher"] },
  { icon: <GrMoney />, label: "Finance", href: "/list/finance", visible: ["admin"] },
  {
    icon: <GiNotebook />,
    label: "Exams",
    visible: ["admin", "teacher", "student"],
    subLevel: [
      { subIcon: <MdOutlineEventNote />, subLabel: "Routine", subHref: "exams/routine", visible: ["admin", "teacher", "student"] },
      { subIcon: <RiPagesLine />, subLabel: "Admit", subHref: "exams/admit", visible: ["admin"] },
      { subIcon: <PiExam />, subLabel: "Results", subHref: "results", visible: ["admin", "teacher"] },
      { subIcon: <PiExam />, subLabel: "Your Results", subHref: "student-result", visible: ["student"] },
    ],
  },
  {
    icon: <CiWallet />,
    label: "Payments",
    visible: ["admin", "student"],
    subLevel: [
      { subIcon: <FaAmazonPay />, subLabel: "Online Payment", subHref: "payment/online-payment", visible: ["admin", "student"] },
      { subIcon: <MdOutlinePayments />, subLabel: "Make Payment", subHref: "payment", visible: ["admin"] },
      { subIcon: <RiFileList3Line />, subLabel: "Payment History", subHref: "payment/payment-history", visible: ["admin"] },
    ],
  },
  {
    icon: <FaUsersCog />,
    label: "User Management",
    visible: ["admin"],
    subLevel: [
      { subIcon: <MdAdminPanelSettings />, subLabel: "Admins", subHref: "admins", visible: ["admin"] },
      { subIcon: <FaUsers />, subLabel: "Users", subHref: "users", visible: ["admin"] },
    ],
  },
];

const Menu = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (session?.user?.role as string)?.toLowerCase();

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="font-bold">GenSchool</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden list-none">
        {menuItems.map((item, index) =>
          item.visible.includes(role) ? (
            item.subLevel ? (
              <SidebarMenu key={index}>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between gap-3 rounded-md">
                      <span className="flex items-center gap-4 text-[16px]">{item.icon}{item.label}</span>
                      <IoIosArrowDown className="arrow-down transition-transform duration-300" />
                      <IoIosArrowForward className="arrow-forward transition-transform duration-300" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.subLevel.filter(sub => sub.visible.includes(role)).map((sub, subIndex) => (
                      <SidebarMenuSub key={subIndex}>
                        <Link href={`/dashboard/list/${sub.subHref}`} className="flex items-center gap-2 py-2 pl-3">{sub.subIcon}{sub.subLabel}</Link>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            ) : (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard${item.href}`} className="flex items-center gap-4 py-2 pl-2">{item.icon}{item.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ) : null
        )}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image as string}
                      alt={user?.name as string}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || ""}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg font-bold">
                        {user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || ""}
                      </span>
                      <span className="truncate text-xs">
                        {" "}
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>

                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard/${role}`}
                      className="flex flex-row gap-2"
                    >
                      <CircleUserRound />
                      Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Menu;
