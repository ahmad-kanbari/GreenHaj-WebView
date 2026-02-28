"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Camera, MapPin, Wallet, TreePine, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGreenHajjStore } from "@/lib/store";
import { ElevenLabsWidget } from "@/components/elevenlabs-widget";

const sidebarItems = [
  { href: "/dashboard",              icon: Home,     label: "Dashboard",     comingSoon: false },
  { href: "/dashboard/scan",         icon: Camera,   label: "EcoScan",       comingSoon: false },
  { href: "/dashboard/route",        icon: MapPin,   label: "Green Route",   comingSoon: true  },
  { href: "/dashboard/wallet",       icon: Wallet,   label: "Wallet",        comingSoon: true  },
  { href: "/dashboard/tree-passport",icon: TreePine, label: "Tree Passport", comingSoon: true  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { points, treeCredits } = useGreenHajjStore();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#022c18] border-r border-green-800 fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-green-800">
          <Link href="/" className="flex items-center">
            <Image
              src="/greenHaj_logo.png"
              alt="GreenHajj"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "text-green-200 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.comingSoon && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="px-4 py-4 border-t border-green-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-300">Points</span>
            <span className="font-bold text-green-400">{points}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-300">Tree Credits</span>
            <span className="font-bold text-green-400">{treeCredits}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-green-300 hover:text-white transition-colors mt-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Landing
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#022c18] border-b-2 border-accent shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/greenHaj_logo.png"
              alt="GreenHajj"
              width={110}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{points} pts</span>
            <Link
              href="/dashboard/tree-passport"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/20"
            >
              <TreePine className="h-3 w-3 text-green-300" />
              <span className="text-xs font-bold text-green-300">{treeCredits}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#022c18] border-t-2 border-accent shadow-lg">
        <div className="flex items-center justify-around py-2">
          {sidebarItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative",
                  isActive
                    ? "text-green-400"
                    : "text-green-200"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-green-400" : "text-green-200")} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.comingSoon && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-20 lg:pt-8 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      <ElevenLabsWidget />
    </div>
  );
}
