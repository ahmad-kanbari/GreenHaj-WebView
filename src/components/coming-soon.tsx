"use client";

import { LucideIcon, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  emoji: string;
}

export function ComingSoon({ icon: Icon, title, description, features, emoji }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Glow background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full scale-150" />
        <div className="relative h-24 w-24 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <span className="text-5xl">{emoji}</span>
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
        <Clock className="h-4 w-4 text-amber-400" />
        <span className="text-sm text-amber-400 font-semibold">Coming Soon</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black mb-3">
        <Icon className="h-8 w-8 text-accent inline mr-2 -mt-1" />
        {title}
      </h1>

      {/* Description */}
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Planned Features */}
      <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border/50 text-left mb-8">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
          Planned Features
        </p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-accent font-bold">{i + 1}</span>
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hint about Zaid */}
      <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/10 max-w-md">
        <p className="text-xs text-muted-foreground">
          💡 <span className="text-accent font-medium">Tip:</span> While you wait, try talking to{" "}
          <span className="font-semibold text-foreground">Zaid</span>, our AI sustainability assistant!
          Click the chat widget in the bottom-right corner.
        </p>
      </div>
    </div>
  );
}
