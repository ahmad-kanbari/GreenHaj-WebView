"use client";

import { MapPin } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function RoutePage() {
  return (
    <ComingSoon
      icon={MapPin}
      emoji="🗺️"
      title="Green Route Planner"
      description="Our AI-powered sustainable travel advisor is coming. It will help you find the most eco-friendly transportation between sacred sites and tourist destinations."
      features={[
        "AI recommendations for eco-friendly transport between holy sites",
        "CO₂ comparison across trains, buses, and walking routes",
        "Integration with Mashair Railway schedules",
        "Real-time crowd level indicators to avoid congestion",
        "Spiritual reminders and green travel tips for every route",
      ]}
    />
  );
}
