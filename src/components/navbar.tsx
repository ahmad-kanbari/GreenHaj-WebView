"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#impact", label: "Impact" },
  { href: "#business", label: "Business" },
  { href: "#team", label: "Team" },
  { href: "#rubric", label: "Rubric" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#022c18]",
        isScrolled
          ? "shadow-xl shadow-black/30"
          : "shadow-md shadow-black/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/greenHaj_logo.png"
            alt="GreenHajj"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-green-200 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-accent hover:bg-green-400 text-white rounded-lg text-sm font-bold transition-all hover:shadow-lg hover:shadow-accent/40"
          >
            Launch App
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[#022c18] border-t border-green-800 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block py-2 text-sm text-green-200 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setIsMobileOpen(false)}
            className="block w-full text-center px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-bold"
          >
            Launch App
          </Link>
        </div>
      )}
    </nav>
  );
}
