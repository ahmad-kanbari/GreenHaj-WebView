import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#022c18] border-t-2 border-accent text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/greenHaj_logo.png"
                alt="GreenHajj"
                width={130}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-green-300 max-w-md leading-relaxed">
              The world&apos;s first AI-powered sustainability companion for Hajj and Saudi tourism.
              Making every pilgrimage a green legacy.
            </p>
            <p className="text-xs text-green-400 mt-4 italic">
              &quot;The Earth is a mosque; keep it clean.&quot; — Islamic Environmental Ethics
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-sm mb-3 text-white">Platform</p>
            <ul className="space-y-2 text-sm text-green-300">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors">Impact</a></li>
              <li><a href="#business" className="hover:text-white transition-colors">Business Model</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Launch App</a></li>
            </ul>
          </div>

          {/* Alignment */}
          <div>
            <p className="font-semibold text-sm mb-3 text-white">Aligned With</p>
            <ul className="space-y-2 text-sm text-green-300">
              <li>Saudi Vision 2030</li>
              <li>Saudi Green Initiative</li>
              <li>COP29 Green Tourism</li>
              <li>Ministry of Hajj &amp; Umrah</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 mb-6 h-px bg-green-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-green-400">
          <p>&copy; 2026 GreenHajj Companion. Built for a sustainable future.</p>
          <p>Made with 💚 by Team GreenHajj</p>
        </div>
      </div>
    </footer>
  );
}
