"use client";

import Link from "next/link";
import { Moon, Sun, Laptop, ChevronDown, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      {
        label: "Full-Stack Development",
        href: "/full-stack-web-development-training-in-agra",
      },
      { label: "Digital Marketing", href: "/digital-marketing-course-in-agra" },
    ],
  },
];

export default function DesktopNav({ theme, toggleTheme }) {
  return (
    <div className="w-full flex items-center justify-between">
      {/* Nav Links */}
      <div className="flex items-center gap-5 sm:gap-6">
        <NavLink href="/">Home</NavLink>

        {/* Programs */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-[13px] font-medium text-foreground hover:text-muted-foreground hover:bg-accent transition px-3 py-1.5 rounded-full outline-none data-[state=open]:bg-accent data-[state=open]:text-foreground">
            All Programs <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={10}
            className="w-[34rem] rounded-3xl border border-border/70 bg-popover/95 p-4 shadow-xl backdrop-blur-md"
          >
            <Link
              href="/programs"
              className="mb-4 block rounded-2xl border border-border/60 bg-card/50 px-4 py-3 transition hover:border-primary/30 hover:bg-accent/40"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                All Programs
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose between degree-led paths and focused job training tracks.
              </p>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              {programGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-border/60 bg-background p-4"
                >
                  <Link
                    href={group.href}
                    className="inline-block text-sm font-bold uppercase tracking-[0.16em] text-foreground transition hover:text-primary"
                  >
                    {group.title}
                  </Link>
                  <div className="mt-3 flex flex-col gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-accent/50 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </div>

      {/* Separator, CTA, Icons */}
      <div className="flex items-center gap-3">
        <span className="text-border select-none hidden lg:block">·</span>

        <Link
          href="/contact"
          className="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-semibold px-5 py-2 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-1 transition-all duration-150"
        >
          <Phone className="w-4 h-4" />
          Claim Free Counselling{" "}
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-1.5 ml-1 ">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:text-foreground bg-background hover:bg-accent transition border border-border/60 shadow-sm "
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Laptop className="h-4 w-4 text-blue-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-[13px] font-medium transition px-3 py-1.5 rounded-full block
                ${
                  isActive
                    ? "text-foreground bg-accent/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                }
            `}
    >
      {children}
    </Link>
  );
}

function SocialButton({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-full p-2 text-muted-foreground hover:text-foreground bg-background hover:bg-accent transition border border-border/60 shadow-sm"
    >
      {children}
    </a>
  );
}
