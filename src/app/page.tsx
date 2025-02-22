import { SignIn } from "@/components/auth/signin-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white text-xl font-semibold">Gen-School</span>
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
      </nav>
    </div>
  );
};

export default page;
