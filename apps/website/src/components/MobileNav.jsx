"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Sun, Moon, Laptop } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";

const programGroups = [
    {
        title: "On-Job Degree",
        href: "/programs/on-job-degree",
        items: [
            { label: "BCA", href: "/bca-training-program-in-agra" },
            { label: "BBA", href: "/bba-training-program-in-agra" },
        ],
    },
    {
        title: "On-Job Training",
        href: "/programs/on-job-training",
        items: [
            { label: "Full-Stack Development", href: "/full-stack-web-development-training-in-agra" },
            { label: "Digital Marketing", href: "/digital-marketing-course-in-agra" },
        ],
    },
];

export default function MobileNav({ onClose, theme, toggleTheme }) {
    return (
        <LazyMotion features={domAnimation}>
        <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 desk:hidden w-[calc(100%-2rem)] mx-auto max-w-[1100px] pointer-events-auto z-20"
        >
            <Card className="rounded-2xl p-4 shadow-lg border border-border/60 bg-background/95 backdrop-blur-md max-h-[calc(100vh-7rem)] overflow-y-auto pointer-events-auto">
                <div className="flex flex-col gap-1">
                    <MobileLink href="/" onClick={onClose}>Home</MobileLink>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="programs" className="border-none">
                            <AccordionTrigger className="py-2.5 px-4 rounded-xl hover:no-underline text-sm font-medium text-foreground hover:bg-accent/80 transition">
                                All Programs
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 pb-0 pt-1 border-l border-border/60 ml-2">
                                <div className="grid grid-cols-1 gap-3">
                                    <Link
                                        href="/programs"
                                        onClick={onClose}
                                        className="rounded-2xl border border-border/60 bg-card/40 px-4 py-3 transition hover:border-primary/30 hover:bg-accent/50"
                                    >
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                                            All Programs
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            View complete programs overview page.
                                        </p>
                                    </Link>

                                    {programGroups.map((group) => (
                                        <div key={group.title} className="rounded-2xl border border-border/60 bg-card/40 p-3">
                                            <Link
                                                href={group.href}
                                                onClick={onClose}
                                                className="inline-block px-1 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition hover:text-primary"
                                            >
                                                {group.title}
                                            </Link>
                                            <div className="mt-2 grid grid-cols-1 gap-1">
                                                {group.items.map((item) => (
                                                    <MobileLink key={item.href} href={item.href} onClick={onClose}>
                                                        {item.label}
                                                    </MobileLink>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <MobileLink href="/blog" onClick={onClose}>Blog</MobileLink>
                    <MobileLink href="/about" onClick={onClose}>About</MobileLink>
                    <MobileLink href="/contact" onClick={onClose}>Contact</MobileLink>

                    <div className="border-t border-border/60 mt-2 pt-3">
                        <Link
                            href={process.env.NEXT_PUBLIC_PHONE ? `tel:${process.env.NEXT_PUBLIC_PHONE}` : "/contact"}
                            onClick={onClose}
                            className="flex items-center justify-center w-[200px] text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition py-2.5 px-4 mx-auto rounded-xl mb-2"
                        >
                            Claim Free Counselling
                        </Link>
                    </div>

                    <div className="border-t border-border/60 mt-2 pt-3">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:bg-accent/80 transition py-2.5 px-4 rounded-xl"
                        >
                            <span>Toggle Theme</span>
                            <div className="rounded-full p-1.5 bg-accent border border-border/60 shadow-sm text-muted-foreground">
                                {theme === "light" ? <Moon className="w-4 h-4" /> : theme === "dark" ? <Sun className="w-4 h-4 text-yellow-500" /> : <Laptop className="w-4 h-4 text-blue-500" />}
                            </div>
                        </button>
                    </div>
                </div>
            </Card>
        </m.div>
        </LazyMotion>
    );
}

function MobileLink({ href, children, onClick }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`text-sm font-medium transition py-2.5 px-4 rounded-xl block
                ${isActive
                    ? "text-foreground bg-accent/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                }
            `}
        >
            {children}
        </Link>
    );
}
