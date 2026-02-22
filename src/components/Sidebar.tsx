"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Truck,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat AI", icon: MessageSquare },
  { href: "/stiri", label: "Știri", icon: Newspaper },
  { href: "/furnizori", label: "Furnizori", icon: Truck },
  { href: "/termene", label: "Termene", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://granafarm.ro/images/granafarm-logo.png"
          alt="GRANA FARM"
          className="h-12 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <div className="mt-2">
          <h1 className="text-base font-bold text-primary leading-tight">GRANA FARM</h1>
          <p className="text-xs text-gray-500">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-primary"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">© 2025 GRANA FARM SRL</p>
        <p className="text-xs text-gray-400 text-center">CUI 48892842</p>
      </div>
    </aside>
  );
}
