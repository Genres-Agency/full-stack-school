import Home from "@/components/home-page/Home";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen ">
      {/* <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white text-xl font-semibold">GenSchool</span>
          </div>
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-500 hover:text-blue-400"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </nav> */}
      <Home/>
    </div>
  );
};

export default page;
