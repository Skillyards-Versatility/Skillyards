"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, ChevronsLeft, ChevronsRight, X, ShieldCheck, Inbox, PhoneCall, ClipboardList, UserCircle, Coffee } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { logout } from "@/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, minRole: "MANAGER" },
  { name: "Students", href: "/students", icon: Users, minRole: "MANAGER" },
  { name: "Enquiries", href: "/enquiries", icon: Inbox, minRole: "MANAGER" },
  { name: "Calls", href: "/calls", icon: PhoneCall, minRole: "MANAGER" },
  { name: "EOD Reports", href: "/eod", icon: ClipboardList },
  { name: "Breaks", href: "/breaks", icon: Coffee },
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Users", href: "/users", icon: ShieldCheck },
];

const ROLE_LEVEL = { SALES: 0, HR: 0, DEVELOPER: 0, DIGITAL_MARKETER: 0, EDITOR: 0, OUTSIDE_SALES: 0, MANAGER: 1, ADMIN: 2 };

function canSee(minRole, userRole) {
  if (!minRole) return true;
  return (ROLE_LEVEL[userRole] ?? 0) >= (ROLE_LEVEL[minRole] ?? 0);
}

function SidebarContent({ variant, user }) {
  const pathname = usePathname();
  const { isCollapsed, toggle, closeMobile } = useSidebar();
  const collapsed = variant === "desktop" && isCollapsed;

  const handleNavClick = () => {
    if (variant === "mobile") closeMobile();
  };

  return (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border shrink-0">
        {collapsed ? (
          <>
            <Image src="/logo/logo-square.png" alt="Skillyards" width={36} height={36} />
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <Logo />
            {variant === "mobile" ? (
              <button
                onClick={closeMobile}
                className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={toggle}
                className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4">Core</p>
        )}
        {navItems
          .filter((item) => canSee(item.minRole, user?.role))
          .map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && item.name}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => logout()}
          title={collapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}

export function Sidebar({ user }) {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent variant="desktop" user={user} />
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent variant="mobile" user={user} />
      </div>
    </>
  );
}
