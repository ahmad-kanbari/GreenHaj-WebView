import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenHajj Companion — AI-Powered Sustainability for Every Pilgrim",
  description:
    "The world's first AI-powered sustainability companion for Hajj, Umrah, and Saudi tourism. Scan waste, verify green actions, plant trees, and earn rewards.",
  keywords: [
    "GreenHajj",
    "Hajj sustainability",
    "Saudi Vision 2030",
    "green tourism",
    "carbon credits",
    "tree planting",
    "AI recycling",
    "eco companion",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
