"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaUniversity,
  FaWallet,
  FaMoneyBillWave,
  FaListAlt,
  FaClipboardCheck,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { checkLoggedIn } from "../lib/util";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const res = checkLoggedIn();
    setRole(res?.role ?? "user");
  }, []);

  const navItems = [
    {
      href: "/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      roles: ["user", "acct", "audit", "admin"],
    },
    {
      href: "/dashboard/bank",
      icon: <FaUniversity />,
      label: "Banks",
      roles: ["acct", "audit", "admin"],
    },
    {
      href: "/dashboard/account",
      icon: <FaWallet />,
      label: "Accounts",
      roles: ["acct"],
    },
    {
      href: "/dashboard/currency",
      icon: <FaMoneyBillWave />,
      label: "Currencies",
      roles: ["acct"],
    },
    {
      href: "/dashboard/category",
      icon: <FaListAlt />,
      label: "Categories",
      roles: ["acct"],
    },
    {
      href: "/dashboard/transaction",
      icon: <FaClipboardCheck />,
      label: "Transaction",
      roles: ["acct", "audit", "admin"],
    },
    {
      href: "/dashboard/audit",
      icon: <FaClipboardCheck />,
      label: "Audit",
      roles: ["audit", "admin"],
    },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-myGreenDark text-white p-2 rounded"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Open sidebar"
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-myGreenDark text-white p-4 z-40
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Collapse/Expand Button */}
        <button
          className="hidden md:flex items-center justify-center absolute top-4 right-[-16px] bg-myGreenDark border border-white rounded-full w-8 h-8 z-50 shadow"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Logo */}
        <div className={`flex ${collapsed ? "py-2" : "py-5"}`}>
          <Image
            src="/logo.png"
            alt="NGF Logo"
            width={collapsed ? 50 : 180}
            height={collapsed ? 50 : 60}
            className={`object-contain transition-all duration-300 ${
              collapsed ? "w-10" : "w-36"
            } h-auto`}
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 mt-2">
          {role &&
            navItems
              .filter((item) => item.roles.includes(role))
              .map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`p-2 rounded flex items-center space-x-2 transition-all duration-200 hover:bg-dashHover ${
                      isActive ? "bg-dashHover" : ""
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="ml-2">{item.label}</span>}
                  </Link>
                );
              })}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
