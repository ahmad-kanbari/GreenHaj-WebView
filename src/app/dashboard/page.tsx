"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Leaf,
  Flame,
  TreePine,
  Recycle,
  Sparkles,
  Lightbulb,
  Globe,
  Zap,
  Volume2,
  Clock,
  Wallet,
  Bot,
  MessageCircle,
} from "lucide-react";
import { useGreenHajjStore, TRAVEL_THEMES } from "@/lib/store";

const ECO_TIPS = [
  { icon: "💧", tip: "Refill your bottle at ZamZam stations instead of buying plastic" },
  { icon: "🚶", tip: "Walking between holy sites is both spiritual and sustainable" },
  { icon: "🌡️", tip: "Set AC to 24°C - saves energy while staying comfortable" },
  { icon: "🥤", tip: "One reusable bottle saves 150+ plastic bottles per trip" },
  { icon: "🚄", tip: "Mashair Railway produces 70% less CO₂ than buses" },
  { icon: "🧊", tip: "Unplug phone chargers when not in use - they still draw power" },
  { icon: "🌿", tip: "Plant a tree to offset your travel carbon footprint" },
  { icon: "♻️", tip: "Saudi Arabia aims for 60% waste diversion by 2030" },
];

const IMPACT_FACTS = [
  "2 million+ pilgrims visit Hajj yearly - small actions create massive impact",
  "A single plastic bottle takes 450 years to decompose",
  "Walking 1km instead of driving saves 0.2kg of CO₂",
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours",
  "Saudi Vision 2030 targets 50% renewable energy",
];

export default function DashboardHome() {
  const {
    points,
    co2Saved,
    bottlesAvoided,
    itemsSorted,
    streak,
    travelTheme,
    setTravelTheme,
  } = useGreenHajjStore();
  const [currentTip, setCurrentTip] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [showAllThemes, setShowAllThemes] = useState(false);

  useEffect(() => {
    const tipInterval = setInterval(
      () => setCurrentTip((prev) => (prev + 1) % ECO_TIPS.length),
      5000
    );
    const factInterval = setInterval(
      () => setCurrentFact((prev) => (prev + 1) % IMPACT_FACTS.length),
      7000
    );
    return () => {
      clearInterval(tipInterval);
      clearInterval(factInterval);
    };
  }, []);

  const themeData = TRAVEL_THEMES.find((t) => t.value === travelTheme);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent/80 to-emerald-600 p-8 text-white">
        <div className="absolute top-0 right-0 opacity-10">
          <Globe className="h-40 w-40 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium text-yellow-300">
              AI-Powered Sustainability
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">GreenSaudi</h1>
          <p className="text-white/80">
            Making your {themeData?.label || "Hajj"} journey eco-friendly
          </p>

          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Flame className="h-4 w-4 text-yellow-300" />
              <span className="font-semibold">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <TreePine className="h-4 w-4 text-emerald-300" />
              <span className="font-semibold">{points} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 ZAID — AI Assistant Spotlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-accent/5 to-card border border-accent/30 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
            <Bot className="h-8 w-8 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Meet Zaid</h2>
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-semibold">LIVE</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Your AI sustainability companion. Zaid can answer questions about recycling in Saudi Arabia,
              suggest green routes, explain eco-actions, and guide you through your sustainable journey — all
              in <span className="text-foreground font-medium">your language</span>, in real time.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">🗣️ Voice-Enabled</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">🌍 Multilingual</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">♻️ Sustainability Expert</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">🔊 ElevenLabs AI</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
              <MessageCircle className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Click the chat widget<br/>in the bottom-right ↘</p>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Theme + Eco Tip Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Theme Selector */}
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          {showAllThemes ? (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-3">
                What brings you to Saudi?
              </p>
              <div className="grid grid-cols-6 gap-2">
                {TRAVEL_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      setTravelTheme(theme.value);
                      setShowAllThemes(false);
                    }}
                    className={`p-2 rounded-lg text-center transition-all ${
                      travelTheme === theme.value
                        ? "bg-accent text-white shadow"
                        : "bg-muted/50 hover:bg-accent/10"
                    }`}
                  >
                    <span className="text-lg block">{theme.icon}</span>
                    <span className="text-[10px]">{theme.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAllThemes(true)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{themeData?.icon}</span>
                <span className="font-medium">{themeData?.label}</span>
              </div>
              <span className="text-sm text-accent">Change</span>
            </button>
          )}
        </div>

        {/* Eco Tip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-700/30">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1 min-h-[48px]">
              <p className="text-xs font-semibold text-yellow-400 mb-1">ECO TIP</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                <span className="mr-1.5">{ECO_TIPS[currentTip].icon}</span>
                {ECO_TIPS[currentTip].tip}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {ECO_TIPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentTip ? "w-4 bg-yellow-500" : "w-1 bg-yellow-500/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-900/20 border border-emerald-700/30 text-center">
          <Leaf className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-emerald-400">{co2Saved.toFixed(1)}</p>
          <p className="text-xs text-emerald-400/70">kg CO₂ saved</p>
        </div>
        <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-700/30 text-center">
          <svg
            className="h-7 w-7 text-blue-400 mx-auto mb-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" />
          </svg>
          <p className="text-3xl font-bold text-blue-400">{bottlesAvoided}</p>
          <p className="text-xs text-blue-400/70">bottles avoided</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-900/20 border border-amber-700/30 text-center">
          <Recycle className="h-7 w-7 text-amber-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-amber-400">{itemsSorted}</p>
          <p className="text-xs text-amber-400/70">items recycled</p>
        </div>
      </div>

      {/* Upcoming Features */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/dashboard/scan",          icon: Camera,    label: "EcoScan",       sub: "AI recycling guide",    live: true  },
            { href: "/dashboard/route",          icon: MapPin,    label: "Green Route",   sub: "AI travel advisor",     live: false },
            { href: "/dashboard/tree-passport",  icon: TreePine,  label: "Tree Passport", sub: "Plant \u0026 track trees",   live: false },
            { href: "/dashboard/wallet",         icon: Wallet,    label: "Wallet",        sub: "Points \u0026 rewards",        live: false },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className={`relative p-6 rounded-2xl bg-card border border-border/50 text-center card-hover-glow group cursor-pointer h-full flex flex-col items-center justify-center transition-opacity ${action.live ? "" : "opacity-70 hover:opacity-100"}`}>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full border">
                  {action.live
                    ? <span className="text-[10px] text-accent font-semibold bg-accent/10 border-accent/20 px-1.5 py-0.5 rounded-full">Live</span>
                    : <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 border-amber-500/20 px-1.5 py-0.5 rounded-full">Soon</span>
                  }
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <action.icon className="h-6 w-6 text-accent" />
                </div>
                <p className="font-semibold">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Did You Know */}
      <div className="p-5 rounded-2xl bg-card border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-accent mb-1">DID YOU KNOW?</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {IMPACT_FACTS[currentFact]}
            </p>
          </div>
        </div>
      </div>

      {/* Powered By */}
      <div className="rounded-2xl bg-muted/30 p-5">
        <p className="text-xs font-semibold text-center text-muted-foreground mb-4">
          POWERED BY
        </p>
        <div className="flex justify-center gap-8">
          {[
            { icon: "🤖", label: "Gemini Vision" },
            { icon: "🔊", label: "ElevenLabs" },
            { icon: "🌳", label: "Tree Credits" },
            { icon: "♻️", label: "Eco Points" },
          ].map((p) => (
            <div key={p.label} className="text-center">
              <div className="h-10 w-10 rounded-lg bg-card border border-border/50 flex items-center justify-center mx-auto mb-1">
                <span className="text-lg">{p.icon}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quote */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground italic">
          &quot;The Earth is a mosque; keep it clean.&quot;
        </p>
        <p className="text-xs text-accent font-medium mt-1">
          — Islamic Environmental Ethics
        </p>
      </div>
    </div>
  );
}
