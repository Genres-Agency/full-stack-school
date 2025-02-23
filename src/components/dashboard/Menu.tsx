"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSeparator,
} from "@/components/ui/sidebar"; // Import Shadcn Sidebar components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { CiWallet } from "react-icons/ci";
import { MdAdminPanelSettings, MdOutlinePayments } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { GiNotebook, GiTeacher, GiNewspaper } from "react-icons/gi";
import { MdOutlineEventNote, MdSpaceDashboard } from "react-icons/md";
import { PiExam, PiChalkboardTeacherFill } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { LogoutButton } from "../auth/LogoutButton";
import { useSession } from "next-auth/react";
import { FaAmazonPay, FaUsers, FaUsersCog } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { GrAnnounce, GrMoney } from "react-icons/gr";
import { IoPersonAddSharp } from "react-icons/io5";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaUsersRectangle } from "react-icons/fa6";

// Define the structure of the menu items
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  visible: string[];
}

interface MenuItem2 {
  icon: React.ReactNode;
  label: string;
  visible: string[];
  subLevel: {
    subIcon: React.ReactNode;
    subLabel: string;
    subHref: string;
    visible: string[];
  }[];
}

const menuItems: MenuItem[] = [
  {
    icon: <MdSpaceDashboard />,
    label: "Admin Dashboard",
    href: "/admin",
    visible: ["admin"],
  },
  {
    icon: <MdSpaceDashboard />,
    label: "Teacher Dashboard",
    href: "/teacher",
    visible: ["teacher"],
  },
  {
    icon: <MdSpaceDashboard />,
    label: "Student Dashboard",
    href: "/student",
    visible: ["student"],
  },
  {
    icon: <GrAnnounce />,
    label: "Announcements",
    href: "/list/announcements",
    visible: ["admin", "teacher", "student"],
  },
  {
    icon: <IoPersonAddSharp />,
    label: "Admission",
    href: "/list/admission",
    visible: ["admin"],
  },
  {
    icon: <LiaChalkboardTeacherSolid />,
    label: "Teachers",
    href: "/list/teachers",
    visible: ["admin", "teacher"],
  },

  {
    icon: <PiChalkboardTeacherFill />,
    label: "Students",
    href: "/list/students",
    visible: ["admin", "teacher"],
  },

  {
    icon: <ImBooks />,
    label: "Subjects",
    href: "/list/subjects",
    visible: ["admin"],
  },
  {
    icon: <GiTeacher />,
    label: "Classes",
    href: "/list/classes",
    visible: ["admin", "teacher"],
  },

  {
    icon: <GiNewspaper />,
    label: "Assignments",
    href: "/list/assignments",
    visible: ["teacher", "student"],
  },

  {
    icon: <FaUsersRectangle />,
    label: "Attendance",
    href: "/list/attendance",
    visible: ["admin", "teacher"],
  },

  {
    icon: <GrMoney />,
    label: "Finance",
    href: "/list/finance",
    visible: ["admin"],
  },
];

const menuItems2: MenuItem2[] = [
  {
    icon: <GiNotebook />,
    label: "Exams",
    visible: ["admin", "teacher", "student"],
    subLevel: [
      {
        subIcon: <MdOutlineEventNote />,
        subLabel: "Routine",
        subHref: "exams/routine",
        visible: ["admin", "teacher", "student"],
      },
      {
        subIcon: <RiPagesLine />,
        subLabel: "Admit",
        subHref: "exams/admit",
        visible: ["admin"],
      },
      {
        subIcon: <PiExam />,
        subLabel: "Results",
        subHref: "results",
        visible: ["admin", "teacher"],
      },
      {
        subIcon: <PiExam />,
        subLabel: "Your Results",
        subHref: "student-result",
        visible: ["student"],
      },
    ],
  },

  {
    icon: <CiWallet />,
    label: "Payments",
    visible: ["admin", "student"],
    subLevel: [
      {
        subIcon: <FaAmazonPay />,
        subLabel: "Online Payment",
        subHref: "payment/online-payment",
        visible: ["admin", "student"],
      },
      {
        subIcon: <MdOutlinePayments />,
        subLabel: "Make Payment",
        subHref: "payment",
        visible: ["admin"],
      },
      {
        subIcon: <RiFileList3Line />,
        subLabel: "Payment History",
        subHref: "payment/payment-history",

        visible: ["admin"],
      },
    ],
  },

  {
    icon: <FaUsersCog />,
    label: "Users Managment",
    visible: ["admin"],
    subLevel: [
      {
        subIcon: <MdAdminPanelSettings />,
        subLabel: "Admins",
        subHref: "admins",
        visible: ["admin"],
      },
      {
        subIcon: <FaUsers />,
        subLabel: "Users",
        subHref: "users",
        visible: ["admin"],
      },
    ],
  },
];

// First, create a client component for the logout button
// Then use it in the server component Menu
const Menu = () => {
  const { data: session } = useSession();
  const role = (session?.user?.role as string)?.toLowerCase();

  return (
    <Sidebar className="pt-16 ">
      <SidebarContent className="pb-5">
        <div className="flex flex-col gap-3 pt-2 ">
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <SidebarMenuItem className="overflow-hidden pl-2" key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/dashboard${item.href}`}
                        className="flex pl-2 items-center gap-4 text-gray-500 py-2 rounded-md hover:scale-105 transition-all duration-300"
                      >
                        {item.icon}
                        <span className="hidden lg:block">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
              return null;
            })}
          </SidebarMenu>
        </div>
        {menuItems2.map((menuItem, index) => {
          if (menuItem.visible.includes(role)) {
            return (
              <SidebarMenu key={index}>
                <Collapsible>
                  <CollapsibleTrigger
                    asChild
                    className="text-gray-500 py-2 px-4 rounded-md"
                  >
                    <SidebarMenuButton className="flex items-center justify-between gap-3 rounded-md">
                      <span className="flex items-center gap-4 text-[16px]">
                        {menuItem.icon}
                        {menuItem.label}
                      </span>
                      <IoIosArrowDown className="arrow-down transition-transform duration-300" />
                      <IoIosArrowForward className="arrow-forward transition-transform duration-300" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="arrow-down ease-in-out transition-transform duration-300">
                    {menuItem.subLevel
                      .filter((subItem) => subItem.visible.includes(role))
                      .map((subItem, subIndex) => (
                        <SidebarMenuSub key={subIndex} className="px-0">
                          <Link
                            href={`/dashboard/list/${subItem.subHref}`}
                            className="flex items-center gap-2 py-2 text-gray-500 pl-3 rounded-md hover:scale-105 transition-all duration-300"
                          >
                            {subItem.subIcon}
                            {subItem.subLabel}
                          </Link>
                        </SidebarMenuSub>
                      ))}
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            );
          }
          return null;
        })}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Menu;
