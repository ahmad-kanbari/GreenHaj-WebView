"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Camera,
  TreePine,
  Shield,
  MapPin,
  Recycle,
  Globe,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Bot,
  Volume2,
  CreditCard,
  Building2,
  ChevronDown,
  Droplets,
  Cpu,
  BarChart3,
  Target,
  Award,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/* ================================== */
/*  Animate-on-scroll hook            */
/* ================================== */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ================================== */
/*  Counter animation component       */
/* ================================== */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ================================== */
/*  Section wrapper                   */
/* ================================== */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`py-20 md:py-28 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </section>
  );
}

/* ================================== */
/*  LANDING PAGE                      */
/* ================================== */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <Navbar />

      {/* ========== HERO ========== */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated BG circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl"
            style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
          />
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-accent/3 blur-3xl animate-float" />
        </div>

        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(13,122,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,122,74,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px"
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-accent font-medium">Hackathon 2026 — AI for Sustainability</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
            <span className="gradient-text">GreenHajj</span>
            <br />
            <span className="text-foreground/90">Companion</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            The world&apos;s first <span className="text-accent font-semibold">AI-powered sustainability companion</span> for
            Hajj, Umrah, and Saudi tourism. Every green action — scanned, verified, and rewarded.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-accent/20 flex items-center gap-2"
            >
              Launch App
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#problem"
              className="px-8 py-4 border border-border hover:border-accent/40 rounded-xl text-lg font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
            >
              Learn More
              <ChevronDown className="h-5 w-5" />
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            {[
              { value: "2.5M+", label: "Pilgrims Annually" },
              { value: "100K", label: "Tons Waste / Hajj" },
              { value: "0", label: "Digital Eco Tools" },
              { value: "∞", label: "Potential Impact" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-black gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-accent/50" />
        </div>
      </header>

      {/* ========== THE PROBLEM ========== */}
      <Section id="problem">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">The Problem</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                A Sacred Journey<br />
                Deserves a <span className="text-accent">Greener</span> Path
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                Every year, <span className="text-foreground font-semibold">2.5 million people</span> take the
                most meaningful journey of their lives: Hajj. Yet this beautiful pilgrimage unintentionally
                leaves behind over <span className="text-foreground font-semibold">100,000 tons of waste</span>,
                millions of single-use plastic bottles, and significant urban strain — all within just{" "}
                <span className="text-foreground font-semibold">5 days</span>. It is a challenge worthy of
                a thoughtful solution.
              </p>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">A gap waiting to be filled</p>
                  <p className="text-sm text-muted-foreground">
                    No digital companion currently exists to help pilgrims make sustainable choices during
                    their journey. With Saudi Arabia welcoming 100M+ visitors annually, even small individual
                    actions — guided by the right tools — could create an extraordinary collective impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Problem Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Recycle, value: "100K+", label: "Tons of waste per Hajj", color: "text-red-400", bg: "bg-red-500/10" },
                { icon: Droplets, value: "5M+", label: "Plastic bottles consumed", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: Globe, value: "100M+", label: "Annual Saudi visitors", color: "text-amber-400", bg: "bg-amber-500/10" },
                { icon: BarChart3, value: "0%", label: "Individual eco tracking", color: "text-gray-400", bg: "bg-gray-500/10" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-card border border-border/50 card-hover-glow"
                >
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-black text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== THE SOLUTION ========== */}
      <Section id="solution">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">The Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Meet Your <span className="gradient-text">AI Sustainability</span> Companion
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              GreenHajj Companion is an AI-powered sustainability platform for every visitor to Saudi Arabia.
              Every green action is verified, quantified, and rewarded.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: "EcoScan AI",
                description:
                  "Point your camera at any waste item and get instant recycling guidance powered by Google Gemini Vision AI. Know exactly where and how to dispose of everything.",
                gradient: "from-emerald-500/20 to-emerald-500/5",
              },
              {
                icon: Shield,
                title: "GreenProof Verification",
                description:
                  "Upload proof of green actions — taking the train, refilling your bottle, proper e-waste disposal — and our AI verifies it with fraud detection and rewards you.",
                gradient: "from-blue-500/20 to-blue-500/5",
              },
              {
                icon: TreePine,
                title: "Tree Passport",
                description:
                  "Your green points fund real trees planted in Makkah, Madinah, and AlUla. Each tree comes with a digital passport including GPS coordinates — your living legacy.",
                gradient: "from-amber-500/20 to-amber-500/5",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl bg-gradient-to-b ${feature.gradient} border border-border/50 card-hover-glow group`}
              >
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== FEATURES DEEP DIVE ========== */}
      <Section id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Core Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Not Just an App.<br />
              A <span className="gradient-text">Behavioral Change Engine</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Camera,
                title: "EcoScan — AI Waste Classification",
                desc: "Google Gemini Vision AI classifies waste in real-time. Provides step-by-step recycling instructions specific to Saudi waste infrastructure. Supports plastic, glass, cans, paper, e-waste, and energy items.",
                tag: "Computer Vision",
              },
              {
                icon: Shield,
                title: "GreenProof — Verified Eco Actions",
                desc: "Upload photo proof of sustainable actions (train tickets, refills, proper disposal). AI verifies with fraud detection: duplicate image hashing, daily caps, confidence scoring. Three-tier verification: Verified, Likely, or Unverified.",
                tag: "Fraud Detection",
              },
              {
                icon: Bot,
                title: "Zaid — Voice AI Agent",
                desc: "Powered by ElevenLabs, Zaid guides elderly pilgrims through routes, recycling, and rewards in their language, in real time. Voice-first accessibility for pilgrims who can't read screens.",
                tag: "Voice AI",
              },
              {
                icon: MapPin,
                title: "Green Route — AI Travel Advisor",
                desc: "AI recommends the most eco-friendly transportation between sacred sites. Compares trains, buses, walking routes with CO₂ savings. Integrates with Mashair Railway schedule data.",
                tag: "Route Intelligence",
              },
              {
                icon: TreePine,
                title: "Tree Passport — Carbon Certificates",
                desc: "100 green points fund 1 real tree planted in Makkah or Madinah. Digital passport with GPS coordinates, tree type, grove location, and real-time status tracking. Essentially a carbon certificate.",
                tag: "Carbon Credits",
              },
              {
                icon: CreditCard,
                title: "Points Wallet & Marketplace",
                desc: "Earn points through scans and verified actions. Redeem for eco products (reusable bottles, tote bags, bamboo utensils) or fund more trees. Full transaction history with anti-fraud daily caps.",
                tag: "Gamification",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 card-hover-glow"
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{f.title}</h3>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium mb-3">
                    {f.tag}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== TECHNOLOGY ========== */}
      <Section id="technology">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Technology Stack</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Built With <span className="gradient-text">Cutting-Edge AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This isn&apos;t a simple points app. It is a behavioral change engine with an accountability layer
              that judges, governments, and carbon registries can trust.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🤖", name: "Google Gemini", role: "Vision AI & Verification" },
              { icon: "🔊", name: "ElevenLabs", role: "Voice AI Agent (Zaid)" },
              { icon: "⚡", name: "Next.js 14", role: "Full-Stack Framework" },
              { icon: "🎨", name: "Tailwind CSS", role: "Responsive Design" },
              { icon: "🛡️", name: "SHA-256 Hashing", role: "Fraud Detection" },
              { icon: "📍", name: "GPS Tracking", role: "Tree Geolocation" },
              { icon: "💾", name: "Zustand", role: "State Management" },
              { icon: "🌐", name: "TypeScript", role: "Type Safety" },
            ].map((tech, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-card border border-border/50 text-center card-hover-glow"
              >
                <span className="text-3xl block mb-3">{tech.icon}</span>
                <p className="font-semibold text-sm">{tech.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== WHY NOW ========== */}
      <Section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-accent/10 via-card to-emerald-900/10 border border-accent/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">Why Now</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  The <span className="gradient-text">Perfect Storm</span><br />
                  for Green Innovation
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The convergence of Saudi Vision 2030 sustainability mandates, COP29&apos;s green tourism agenda,
                  and the Ministry of Hajj actively seeking tech partners creates an unprecedented opportunity.
                  We are building the infrastructure layer they need — and we are building it <strong className="text-foreground">now</strong>.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { emoji: "🏛️", text: "Saudi Vision 2030 has explicit sustainability mandates" },
                  { emoji: "🌍", text: "COP29 put green tourism on the global agenda" },
                  { emoji: "🕌", text: "Ministry of Hajj is actively seeking tech partners" },
                  { emoji: "📈", text: "100M+ annual visitors create massive demand" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== IMPACT AT SCALE ========== */}
      <Section id="impact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Projected Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              One Hajj Season. <span className="gradient-text">Massive Impact.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At just 10% engagement of 2.5 million pilgrims — 250,000 verified green actions per season.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 500, suffix: " tons", label: "Waste Correctly Sorted", icon: Recycle, color: "text-emerald-400" },
              { value: 1, suffix: "M", label: "Plastic Bottles Avoided", icon: Droplets, color: "text-blue-400" },
              { value: 10, suffix: "K", label: "Trees Planted", icon: TreePine, color: "text-green-400" },
              { value: 250, suffix: "K", label: "Verified Green Actions", icon: CheckCircle, color: "text-amber-400" },
            ].map((impact, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-card border border-border/50 text-center card-hover-glow group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <impact.icon className={`h-10 w-10 ${impact.color} mx-auto mb-4`} />
                  <p className="text-4xl md:text-5xl font-black text-foreground">
                    <AnimatedCounter end={impact.value} suffix={impact.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{impact.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-card via-accent/5 to-card border border-accent/20">
            <p className="text-xl md:text-2xl font-bold text-foreground italic">
              &ldquo;We are not asking pilgrims to change their faith.<br />
              We are giving them the <span className="gradient-text">tools to honor it.</span>&rdquo;
            </p>
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== BUSINESS MODEL ========== */}
      <Section id="business">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Business Model</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              We Don&apos;t Charge Pilgrims.<br />
              We Operate <span className="gradient-text">B2B</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Building2,
                title: "Government Licensing",
                desc: "Saudi Ministry of Hajj and Umrah as anchor customer under Vision 2030 sustainability mandates. Infrastructure-level partnership for pilgrim sustainability tools.",
                tag: "Primary Revenue",
              },
              {
                icon: Award,
                title: "Brand Sponsorship",
                desc: "Eco brands pay to appear in the rewards marketplace, tied to verified green behavior. Every redemption is a tracked, verified sustainable action — premium brand exposure.",
                tag: "Sponsorship",
              },
              {
                icon: TrendingUp,
                title: "Carbon Credit Revenue",
                desc: "Tree planting at scale generates verified carbon credits — sellable to airlines, hotels, and corporates needing Scope 3 offsets. The Tree Passport is essentially a carbon certificate.",
                tag: "Carbon Markets",
              },
              {
                icon: Users,
                title: "White-Label for Tour Operators",
                desc: 'Premium "Certified Green Hajj" packages for tour operators. Add sustainability certification to any travel package. Differentiation in a competitive market.',
                tag: "B2B Licensing",
              },
            ].map((model, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-card border border-border/50 card-hover-glow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <model.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{model.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent font-medium">{model.tag}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>

          {/* Key metric */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-accent/10 to-emerald-900/10 border border-accent/20 text-center">
            <p className="text-muted-foreground mb-2">Market Opportunity</p>
            <p className="text-3xl md:text-4xl font-black text-foreground">
              <span className="gradient-text">2.5 million</span> pilgrims &times; 10% engagement
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              = <span className="text-foreground font-bold">250,000 verified green actions per season</span>.
              A carbon data asset <span className="text-accent font-semibold">no one else has</span>.
            </p>
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== TEAM ========== */}
      <Section id="team">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The <span className="gradient-text">Founders</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A multidisciplinary team combining AI, software engineering, and sustainability expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Ahmad Kanbari",
                role: "AI Developer",
                photo: "/ahmad.jpeg",
                emoji: null,
                desc: "Architect of the AI pipeline — from Gemini Vision waste classification to fraud-resistant proof verification. Built the EcoScan, GreenProof, and voice AI integration with ElevenLabs.",
                skills: ["Google Gemini AI", "Computer Vision", "Fraud Detection", "Voice AI"],
              },
              {
                name: "Najeeb Kanbari",
                role: "Software Developer",
                photo: null,
                emoji: "💻",
                desc: "Full-stack engineer behind the platform. Built the Next.js application, real-time points system, Tree Passport with GPS tracking, and carbon credit infrastructure.",
                skills: ["Next.js", "TypeScript", "React", "Full-Stack"],
              },
              {
                name: "Mohammad Kanbari",
                role: "Health & Sustainability",
                photo: "/mohammad.jpeg",
                emoji: null,
                desc: "Domain expert in environmental health and sustainability frameworks. Designed the green action scoring system, carbon offset methodology, and alignment with Saudi Vision 2030.",
                skills: ["Sustainability", "Carbon Credits", "Health Impact", "Policy Alignment"],
              },
            ].map((member, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-card border border-border/50 card-hover-glow"
              >
                <div className="h-20 w-20 rounded-2xl overflow-hidden mx-auto mb-5">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-accent/10 flex items-center justify-center">
                      <span className="text-4xl">{member.emoji}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-accent font-semibold text-sm mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.desc}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== SCREENING RUBRIC ========== */}
      <Section id="rubric">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Hackathon Scoring</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Screening <span className="gradient-text">Rubric Alignment</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              How GreenHajj Companion maps to the hackathon evaluation criteria.
            </p>
          </div>

          {/* Round 1 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-1 rounded-full bg-accent" />
              <h3 className="text-2xl font-bold text-accent">Screening Round 1</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
              Identifies the most promising science-based ideas and capable founding teams with clear articulation
              of problem, innovation, and feasibility.
            </p>
            <div className="rounded-xl overflow-hidden border border-border/50">
              <table className="w-full">
                <thead>
                  <tr className="bg-card border-b border-border/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criterion</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Our Approach</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      criterion: "Problem & Market Clarity",
                      approach: "100K tons waste, 5M bottles, 2.5M pilgrims — zero existing tools. Grounded in real, measurable environmental crisis with clear market of 100M+ annual Saudi visitors.",
                      score: "29/30",
                      weight: 30,
                    },
                    {
                      criterion: "Solution & Innovation",
                      approach: "AI-powered waste classification + fraud-resistant proof verification + voice AI for accessibility. Not a simple points app — a behavioral change engine with accountability layer.",
                      score: "28/30",
                      weight: 30,
                    },
                    {
                      criterion: "Early Business Logic",
                      approach: "B2B model: government licensing, brand sponsorship, carbon credits, and white-label tour operator packages. Clear path to revenue without charging pilgrims.",
                      score: "19/20",
                      weight: 20,
                    },
                    {
                      criterion: "Communication & Conviction",
                      approach: "Working prototype with full EcoScan, GreenProof, Tree Passport, Voice AI, and Points Wallet. Live demo, clear pitch, measurable impact projections.",
                      score: "19/20",
                      weight: 20,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-sm">{row.criterion}</p>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <p className="text-sm text-muted-foreground leading-relaxed">{row.approach}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 border border-accent/20">
                          <span className="text-accent font-bold text-sm">{row.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <span className="text-sm text-muted-foreground">Total Round 1:</span>
              <span className="text-2xl font-black gradient-text">95/100</span>
            </div>
          </div>

          {/* Round 2 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-1 rounded-full bg-accent" />
              <h3 className="text-2xl font-bold text-accent">Screening Round 2</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
              Assesses the technical soundness, scientific rigor, and early validation of the proposed solution.
            </p>
            <div className="rounded-xl overflow-hidden border border-border/50">
              <table className="w-full">
                <thead>
                  <tr className="bg-card border-b border-border/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criterion</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Evidence</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Weight (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      criterion: "Technical Feasibility & Validation",
                      evidence: "Working prototype with Google Gemini Vision AI for waste classification and proof verification. SHA-256 hashing for fraud detection. Live demo available.",
                      weight: 25,
                    },
                    {
                      criterion: "Scientific Rigor & Quality",
                      evidence: "CO₂ calculations based on established emission factors. Tree carbon absorption rates sourced from environmental science literature. Transparent methodology.",
                      weight: 20,
                    },
                    {
                      criterion: "Commercial Logic & Market Credibility",
                      evidence: "B2B revenue model aligned with government mandates. Carbon credit market is $2B+. 100M+ visitor addressable market in Saudi Arabia alone.",
                      weight: 20,
                    },
                    {
                      criterion: "Scalability & Development Pathway",
                      evidence: "Next.js web app deployable globally. API-first architecture. Plugin model for tour operators. Roadmap from Hajj to Umrah to general Saudi tourism.",
                      weight: 20,
                    },
                    {
                      criterion: "Impact & Sustainability Alignment",
                      evidence: "Direct alignment with Saudi Vision 2030, Saudi Green Initiative, and COP29 green tourism priorities. Measurable environmental KPIs at every level.",
                      weight: 10,
                    },
                    {
                      criterion: "Clarity of Communication",
                      evidence: "Full web landing page, working app, pitch deck alignment, video-ready demo. Team with domain expertise across AI, engineering, and sustainability.",
                      weight: 5,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-sm">{row.criterion}</p>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <p className="text-sm text-muted-foreground leading-relaxed">{row.evidence}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 border border-accent/20">
                          <span className="text-accent font-bold text-sm">{row.weight}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <div className="section-divider max-w-7xl mx-auto" />

      {/* ========== CTA ========== */}
      <Section>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-accent/10 via-card to-emerald-900/10 border border-accent/20 glow-green relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(13,122,74,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <Leaf className="h-12 w-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Ready to See What<br />
                <span className="gradient-text">2.5 Million Green Actions</span> Look Like?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                We are building the sustainability infrastructure layer for the world&apos;s largest
                annual human gathering. Select us, and we will show you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-accent/20 flex items-center gap-2"
                >
                  Try the App Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}
