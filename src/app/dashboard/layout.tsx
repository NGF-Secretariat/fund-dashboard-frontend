'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/');
    }
  }, [router]);

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <>
      <Toaster position='top-right' />

      <div className="flex min-h-screen bg-ngfGreenLight transition-all duration-300 ease-in-out">
        {/* Sidebar */}
        <div
          className="fixed left-0 top-0 h-full z-10 transition-all duration-300 bg-white shadow"
          style={{ width: sidebarWidth }}
        >
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Main content area */}
        <div
          className="flex flex-col flex-1 ml-0 transition-all duration-300 ease-in-out"
          style={{ marginLeft: sidebarWidth }}
        >
          <Topbar collapsed={collapsed} />

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
