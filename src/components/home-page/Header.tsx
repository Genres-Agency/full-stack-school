"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { LogoutButton } from "../auth/LogoutButton";
import { useSession } from "next-auth/react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        { label: "Admission", href: "/" },
        { label: "Academics", href: "/" },
        { label: "Administration", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contact", href: "/" }
    ];
    const { data: session } = useSession();
    const user = session?.user;
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-900 text-white py-4 shadow-md relative">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="logo" width={32} height={32} />
                            <span className="hidden md:block font-bold text-xl">GenSchool</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex pt-1 space-x-6">
                            {menuItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-gray-300 transition duration-200"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="px-4  border-t border-blue-800 md:border-0" >
                                {user ? (
                                    <LogoutButton />
                                ) : (
                                    <Link href="/auth/login">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-500/30 text-blue-500 hover:text-blue-400"
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                )}
                            </li>
                        </ul>

                    </nav>
                </div>

                {/* Mobile navigation */}
                <nav
                    className={`${isMenuOpen ? "block" : "hidden"
                        } md:hidden absolute left-0 right-0 top-full bg-sky-900 shadow-lg`}
                >
                    <ul className="px-4 py-2">
                        {menuItems.map((item) => (
                            <li key={item.label} className="py-2">
                                <Link
                                    href={item.href}
                                    className="block hover:text-gray-300 transition duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {/* Auth buttons */}
                    <div className="px-4 py-2 border-t border-blue-800 md:border-0" >
                        {user ? (
                            <LogoutButton />
                        ) : (
                            <Link href="/auth/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-500/30 text-blue-500 hover:text-blue-400"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
