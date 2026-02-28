import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  type: "scan" | "proof" | "redeem" | "tree";
  description: string;
  points: number;
  timestamp: string;
}

export interface TreePassport {
  id: string;
  batchId: string;
  city: "Makkah" | "Madinah";
  dateFunded: string;
  status: "Growing" | "Planted" | "Thriving";
  credits: number;
  imageUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  treeType?: string;
  groveName?: string;
}

export type TravelTheme = "hajj" | "umrah" | "riyadh_festival" | "alula" | "jeddah" | "other";

export const TRAVEL_THEMES: { value: TravelTheme; label: string; icon: string }[] = [
  { value: "hajj", label: "Hajj", icon: "🕋" },
  { value: "umrah", label: "Umrah", icon: "🤲" },
  { value: "riyadh_festival", label: "Riyadh Season", icon: "🎭" },
  { value: "alula", label: "AlUla", icon: "🏜️" },
  { value: "jeddah", label: "Jeddah", icon: "🌊" },
  { value: "other", label: "Other", icon: "✈️" },
];

interface GreenHajjState {
  // Points
  points: number;
  dailyScanPoints: number;
  dailyProofPoints: number;
  lastDailyReset: string;

  // Eco stats
  co2Saved: number;
  bottlesAvoided: number;
  itemsSorted: number;
  streak: number;

  // Transactions
  transactions: Transaction[];

  // Tree Credits
  treeCredits: number;
  treePassports: TreePassport[];

  // Anti-fraud
  scannedImageHashes: string[];

  // Travel Theme
  travelTheme: TravelTheme;

  // Actions
  addPoints: (amount: number, type: Transaction["type"], description: string) => boolean;
  canAddScanPoints: (amount: number) => boolean;
  canAddProofPoints: (amount: number) => boolean;
  addImageHash: (hash: string) => boolean;
  isImageDuplicate: (hash: string) => boolean;
  redeemPoints: (amount: number, description: string) => boolean;
  fundTree: (credits: number) => boolean;
  addTreePassport: (passport: TreePassport) => void;
  resetDailyLimits: () => void;
  incrementStats: (co2?: number, bottles?: number, items?: number) => void;
  setTravelTheme: (theme: TravelTheme) => void;
}

const DAILY_SCAN_LIMIT = 50;
const DAILY_PROOF_LIMIT = 100;

const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "scan",
    description: "Recycled plastic bottle",
    points: 15,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    type: "proof",
    description: "Train ticket verified",
    points: 30,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
];

const initialTreePassport: TreePassport = {
  id: "tp-001",
  batchId: "GH-2026-MK-0042",
  city: "Makkah",
  dateFunded: new Date(Date.now() - 172800000).toISOString(),
  status: "Growing",
  credits: 1,
  imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400",
  coordinates: {
    lat: 21.4225,
    lng: 39.8262,
  },
  treeType: "Umbrella Thorn (Acacia)",
  groveName: "Makkah Green Grove",
};

export const useGreenHajjStore = create<GreenHajjState>()(
  persist(
    (set, get) => ({
      // Initial state
      points: 150,
      dailyScanPoints: 0,
      dailyProofPoints: 0,
      lastDailyReset: new Date().toDateString(),

      co2Saved: 2.4,
      bottlesAvoided: 12,
      itemsSorted: 8,
      streak: 3,

      transactions: initialTransactions,
      treeCredits: 1,
      treePassports: [initialTreePassport],
      scannedImageHashes: [],
      travelTheme: "hajj",

      // Actions
      resetDailyLimits: () => {
        const today = new Date().toDateString();
        const state = get();
        if (state.lastDailyReset !== today) {
          set({
            dailyScanPoints: 0,
            dailyProofPoints: 0,
            lastDailyReset: today,
            streak: state.streak + 1,
          });
        }
      },

      canAddScanPoints: (amount: number) => {
        const state = get();
        state.resetDailyLimits();
        return state.dailyScanPoints + amount <= DAILY_SCAN_LIMIT;
      },

      canAddProofPoints: (amount: number) => {
        const state = get();
        state.resetDailyLimits();
        return state.dailyProofPoints + amount <= DAILY_PROOF_LIMIT;
      },

      addPoints: (amount: number, type: Transaction["type"], description: string) => {
        const state = get();
        state.resetDailyLimits();

        // Check daily limits
        if (type === "scan" && state.dailyScanPoints + amount > DAILY_SCAN_LIMIT) {
          return false;
        }
        if (type === "proof" && state.dailyProofPoints + amount > DAILY_PROOF_LIMIT) {
          return false;
        }

        const transaction: Transaction = {
          id: Date.now().toString(),
          type,
          description,
          points: amount,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          points: s.points + amount,
          dailyScanPoints: type === "scan" ? s.dailyScanPoints + amount : s.dailyScanPoints,
          dailyProofPoints: type === "proof" ? s.dailyProofPoints + amount : s.dailyProofPoints,
          transactions: [transaction, ...s.transactions].slice(0, 20),
        }));

        return true;
      },

      addImageHash: (hash: string) => {
        const state = get();
        if (state.scannedImageHashes.includes(hash)) {
          return false;
        }
        set((s) => ({
          scannedImageHashes: [...s.scannedImageHashes, hash].slice(-100),
        }));
        return true;
      },

      isImageDuplicate: (hash: string) => {
        return get().scannedImageHashes.includes(hash);
      },

      redeemPoints: (amount: number, description: string) => {
        const state = get();
        if (state.points < amount) return false;

        const transaction: Transaction = {
          id: Date.now().toString(),
          type: "redeem",
          description,
          points: -amount,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          points: s.points - amount,
          transactions: [transaction, ...s.transactions].slice(0, 20),
        }));

        return true;
      },

      fundTree: (credits: number) => {
        const state = get();
        const cost = credits * 100;
        if (state.points < cost) return false;

        const isMakkah = Math.random() > 0.5;
        const groves = isMakkah 
          ? [
              { name: "Makkah Green Grove", lat: 21.4225, lng: 39.8262 },
              { name: "Pilgrim's Legacy Forest", lat: 21.3891, lng: 39.8579 }
            ]
          : [
              { name: "Madinah Date Palm Grove", lat: 24.5247, lng: 39.5692 }
            ];
        const grove = groves[Math.floor(Math.random() * groves.length)];
        const trees = ["Umbrella Thorn (Acacia)", "Sidra Tree", "Date Palm"];

        const passport: TreePassport = {
          id: `tp-${Date.now()}`,
          batchId: `GH-2026-${isMakkah ? "MK" : "MD"}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
          city: isMakkah ? "Makkah" : "Madinah",
          dateFunded: new Date().toISOString(),
          status: "Growing",
          credits,
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
          coordinates: {
            lat: grove.lat + (Math.random() - 0.5) * 0.01,
            lng: grove.lng + (Math.random() - 0.5) * 0.01,
          },
          treeType: trees[Math.floor(Math.random() * trees.length)],
          groveName: grove.name,
        };

        const transaction: Transaction = {
          id: Date.now().toString(),
          type: "tree",
          description: `Funded ${credits} tree credit(s)`,
          points: -cost,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          points: s.points - cost,
          treeCredits: s.treeCredits + credits,
          treePassports: [passport, ...s.treePassports],
          transactions: [transaction, ...s.transactions].slice(0, 20),
        }));

        return true;
      },

      addTreePassport: (passport: TreePassport) => {
        set((s) => ({
          treePassports: [passport, ...s.treePassports],
        }));
      },

      incrementStats: (co2 = 0, bottles = 0, items = 0) => {
        set((s) => ({
          co2Saved: s.co2Saved + co2,
          bottlesAvoided: s.bottlesAvoided + bottles,
          itemsSorted: s.itemsSorted + items,
        }));
      },

      setTravelTheme: (theme: TravelTheme) => {
        set({ travelTheme: theme });
      },
    }),
    {
      name: "greenhajj-storage",
    }
  )
);
