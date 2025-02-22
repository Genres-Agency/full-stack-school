
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

const Navbar = async () => {

  const session = await getServerSession(authOptions); 
  const user = session?.user;

  return (
    <div className="flex items-center justify-between p-4 ">
      {/* SEARCH BAR */}
      <div className="flex gap-10">
        <div>
          <Link href="/" className="flex items-center justify-start gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">GenSchool</span>
          </Link>
        </div>
       
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div> */}
         <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-400 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search..."
            className="w-[200px] p-2 bg-transparent outline-none"
          />
        </div>
        <ThemeSwitcher />
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Link href={"/dashboard/announcements"}>
            <Image
              className="cursor-pointer"
              src="/announcement.png"
              alt=""
              width={20}
              height={20}
            />
          </Link>
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user?.name}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.role as string}
          </span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
        {/* <UserButton /> */}
      </div>
    </div>
  );
};

export default Navbar;
