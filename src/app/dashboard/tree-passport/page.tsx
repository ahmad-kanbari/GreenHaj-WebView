"use client";

import { TreePine } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function TreePassportPage() {
  return (
    <ComingSoon
      icon={TreePine}
      emoji="🌳"
      title="Tree Passport"
      description="Your green legacy system is being built. Soon you'll be able to fund real trees planted in Makkah, Madinah, and AlUla — each with a digital passport and GPS coordinates."
      features={[
        "Fund real trees with green points (100 pts = 1 tree credit)",
        "Digital passport with GPS coordinates of your tree's location",
        "Track tree status: Growing → Planted → Thriving",
        "Carbon offset calculation (18kg CO₂/year per tree)",
        "Shareable carbon certificate — your living legacy from Hajj",
      ]}
    />
  );
}
