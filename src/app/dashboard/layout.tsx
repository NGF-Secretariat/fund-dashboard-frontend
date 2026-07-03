"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <>
      <Toaster position="top-right" />

      <div
        className="flex min-h-screen bg-ngfGreenLight transition-all duration-300 ease-in-out print:bg-white"
        style={{ "--sidebar-width": `${sidebarWidth}px` } as any}
      >
        {/* Sidebar for desktop */}
        <div
          aria-label="sidebar-wrapper"
          className={`
            fixed left-0 top-0 h-full z-10 transition-all duration-300 bg-white shadow print:hidden
            ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0
          `}
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>

        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)] print:ml-0">
          <div className="print:hidden">
            <Topbar
              collapsed={collapsed}
              toggleMobileMenu={() => setMobileOpen((o) => !o)}
            />
          </div>
          <main className="p-2 print:p-0">{children}</main>
        </div>
      </div>
    </>
  );
}
