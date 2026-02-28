"use client";

import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function WalletPage() {
  return (
    <ComingSoon
      icon={Wallet}
      emoji="💰"
      title="Points Wallet & Marketplace"
      description="The green rewards marketplace is under construction. You'll soon be able to earn and redeem points for eco-friendly products and fund tree planting initiatives."
      features={[
        "Earn points through EcoScan and verified GreenProof actions",
        "Redeem for eco products: reusable bottles, tote bags, bamboo utensils",
        "Fund tree credits to plant real trees in Saudi Arabia",
        "Full transaction history with anti-fraud daily caps",
        "Brand-sponsored rewards tied to verified green behavior",
      ]}
    />
  );
}
