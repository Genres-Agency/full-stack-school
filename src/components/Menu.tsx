"use client";

// Menu.tsx (Server Component)
// import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
// import { UserButton } from "@clerk/nextjs";
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
import { GiNotebook } from "react-icons/gi";
import { MdOutlineEventNote } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
// Define the structure of the menu items
interface MenuItem {
  icon: string;
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
    icon: "/home.png",
    label: "Admin Dashboard",
    href: "/admin",
    visible: ["admin"],
  },
  {
    icon: "/home.png",
    label: "Teacher Dashboard",
    href: "/teacher",
    visible: ["teacher"],
  },
  {
    icon: "/home.png",
    label: "Student Dashboard",
    href: "/student",
    visible: ["student"],
  },
  {
    icon: "/announcement.png",
    label: "Announcements",
    href: "/list/announcements",
    visible: ["admin", "teacher", "student"],
  },
  {
    icon: "/student.png",
    label: "Admission",
    href: "/list/admission",
    visible: ["admin"],
  },
  {
    icon: "/teacher.png",
    label: "Teachers",
    href: "/list/teachers",
    visible: ["admin", "teacher"],
  },

  {
    icon: "/student.png",
    label: "Students",
    href: "/list/students",
    visible: ["admin", "teacher"],
  },

  {
    icon: "/subject.png",
    label: "Subjects",
    href: "/list/subjects",
    visible: ["admin"],
  },
  {
    icon: "/class.png",
    label: "Classes",
    href: "/list/classes",
    visible: ["admin", "teacher"],
  },

  {
    icon: "/assignment.png",
    label: "Assignments",
    href: "/list/assignments",
    visible: ["teacher", "student"],
  },

  {
    icon: "/attendance.png",
    label: "Attendance",
    href: "/list/attendance",
    visible: ["admin", "teacher"],
  },

  {
    icon: "/finance.png",
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
        visible: ["admin", "student"],
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
    visible: ["admin"],
    subLevel: [
      {
        subIcon: <RiFileList3Line />,
        subLabel: "Payment History",
        subHref: "payment/payment-history",

        visible: ["admin"],
      },
      {
        subIcon: <MdOutlinePayments />,
        subLabel: "Make Payment",
        subHref: "payment",
        visible: ["admin"],
      },
    ],
  },

  {
    icon: <User />,
    label: "Users Managment",
    visible: ["admin"],
    subLevel: [
      {
        subIcon: <MdAdminPanelSettings />,
        subLabel: "Admin",
        subHref: "admins",
        visible: ["admin"],
      },
      {
        subIcon: <User />,
        subLabel: "Teachers",
        subHref: "teachers",
        visible: ["admin"],
      },
    ],
  },
];

// First, create a client component for the logout button
const LogoutButton = () => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="flex items-center gap-4 text-gray-500 py-2 pl-2 rounded-md hover:scale-105 transition-all duration-300"
      >
        <LogOut size={20} />
        <span className="hidden lg:block">Logout</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// Then use it in the server component Menu
const Menu = () => {
  // const user = await currentUser();
  // const role = user?.publicMetadata.role as string;

  return (
    <Sidebar className="pt-16 ">
      <SidebarContent className="pb-5">
        <div className="flex flex-col gap-2 pt-2 pl-2 ">
          <SidebarMenu>
            {menuItems.map((item) => {
              // if (item.visible.includes(role)) {
              return (
                <SidebarMenuItem className=" overflow-hidden" key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/dashboard${item.href}`}
                      key={item.label}
                      className="flex pl-2 items-center   gap-4 text-gray-500 py-2  rounded-md  hover:scale-105 transition-all duration-300"
                    >
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
              // }

              return null; // Return null if the item is not visible
            })}
          </SidebarMenu>
        </div>
        {menuItems2.map(
          (menuItem, index) => (
            // menuItem.visible.includes(role) ? (
            <SidebarMenu key={index} className=" ">
              <Collapsible>
                <CollapsibleTrigger
                  asChild
                  className="text-gray-500 py-2 px-4  rounded-md "
                >
                  <SidebarMenuButton className="flex items-center justify-between gap-2 rounded-md">
                    <span className="flex items-center gap-4 text-[16px]">
                      {menuItem.icon}
                      {menuItem.label}
                    </span>

                    <IoIosArrowDown className="arrow-down transition-transform duration-300" />
                    <IoIosArrowForward className="arrow-forward transition-transform duration-300" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="arrow-down ease-in-out transition-transform duration-300">
                  {
                    menuItem.subLevel?.map((subItem, subIndex) => (
                      // subItem.visible.includes(role) && (
                      <SidebarMenuSub key={subIndex} className="px-0">
                        <Link
                          href={` /dashboard/list/${subItem.subHref}`}
                          className="flex items-center gap-2 py-2 text-gray-500 pl-3  rounded-md hover:scale-105 transition-all duration-300"
                        >
                          {subItem.subIcon}
                          {subItem.subLabel}
                        </Link>
                      </SidebarMenuSub>
                    ))
                    // )
                  }
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          )
          //   ) : null
        )}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <LogoutButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Menu;
