"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { useTheme } from "@/app/context/ThemeContext";
import { Menu, X, Sun, Moon, Laptop, Phone, Mail } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const isCampaignRoute = pathname?.startsWith("/campaigns");
    const isAgraBranch = pathname === "/branch/agra" || pathname?.startsWith("/branch/agra/");

    useEffect(() => {
        const onScroll = () => setIsSticky(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsOpen(false);
    }

    if (isCampaignRoute) {
        return null;
    }

    return (
        <header
            className={`fixed inset-x-0 top-0 md:top-3 z-50 flex flex-col items-center px-4 sm:px-6 transition-all duration-300 pointer-events-none`}
        >
            {/* Backdrop overlay when mobile menu is open */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-background/60 backdrop-blur-xs pointer-events-auto desk:hidden"
                    aria-hidden="true"
                />
            )}

            <nav className={`w-full max-w-[1100px] flex items-center justify-between p-2 sm:p-2.5 rounded-full border border-border/80 bg-background/80 backdrop-blur-md shadow-sm transition-all duration-300 pointer-events-auto relative z-10`}>

                {/* Left Side: Logo & Version */}
                <div className="flex items-center gap-2 md:pl-2">
                    <Link href="/" className="flex items-center shrink-0">
                        <Logo />
                    </Link>
                </div>

                {/* Desktop Nav Items */}
                <div className="hidden desk:flex flex-1 items-center justify-between ml-8">
                    <DesktopNav theme={theme} toggleTheme={toggleTheme} isSticky={isSticky} />
                </div>

                {/* Mobile buttons */}
                <div className="flex items-center gap-1 desk:hidden pl-2">
                    <ThemeButton theme={theme} toggleTheme={toggleTheme} />

                    <button
                        onClick={() => setIsOpen(v => !v)}
                        aria-label="Toggle menu"
                        className="rounded-full p-2.5 text-muted-foreground hover:bg-accent transition"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Top Contact Strip Just Below Navbar (Agra Branch Only) */}
            {isAgraBranch && (
                <div className="mt-1.5 flex items-center justify-center gap-3 sm:gap-6 px-4 py-1.5 rounded-full border border-border bg-card/95 backdrop-blur-md shadow-xs text-xs font-bold transition-all pointer-events-auto relative z-10">
                    <a
                        href="tel:+917060100562"
                        className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity group"
                        title="Call Skillyards"
                    >
                        <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">070601 00562</span>
                    </a>
                    <span className="h-3 w-px bg-border" />
                    <a
                        href="mailto:info@skillyards.in"
                        className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity group"
                        title="Email Skillyards"
                    >
                        <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">info@skillyards.in</span>
                    </a>
                </div>
            )}

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <MobileNav
                        onClose={() => setIsOpen(false)}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}

function ThemeButton({ theme, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="flex items-center justify-center rounded-full p-2.5 text-muted-foreground hover:bg-accent transition"
        >
            {theme === "light" ? (
                <Moon className="h-4 w-4" />
            ) : theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
                <Laptop className="h-4 w-4 text-blue-500" />
            )}
        </button>
    );
}
