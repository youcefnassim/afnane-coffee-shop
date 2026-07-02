"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D2A21] flex flex-col items-center justify-center text-white p-4">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-white/80">Vérification de l&apos;accès administrateur...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark relative overflow-hidden">
      {/* Subtle Background Logo Watermark */}
      <div 
        className="fixed -bottom-24 -right-24 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-no-repeat bg-contain bg-center z-0"
        style={{ backgroundImage: "url('/logo.jpg')" }}
      />
      
      <AdminSidebar />
      <main className="flex-1 lg:overflow-y-auto z-10 relative">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
