import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Echo
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Real-time Audio Fingerprinting
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Identify any sound, <br />
            <span className="text-neutral-500">instantly.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed">
            Echo is a professional-grade audio recognition platform. Intercept audio 
            from your browser tabs and match it against millions of fingerprints 
            with sub-second latency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/download" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20">
              Download Extension
            </Link>
            <Link href="/docs" className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-2xl font-semibold hover:bg-neutral-800 transition-all">
              Read Documentation
            </Link>
          </div>

          {/* Visual Element */}
          <div className="mt-24 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full opacity-50"></div>
            <div className="relative aspect-video rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-1 items-end h-24">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-3 bg-indigo-500/40 rounded-full animate-pulse" 
                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Logo className="w-6 h-6" />
            <span className="font-bold">Echo</span>
          </div>
          <p className="text-sm text-neutral-500">
            © 2026 Echo Identification System. Built for professional acoustic fingerprinting.
          </p>
          <div className="flex gap-6 text-neutral-500">
             <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
             <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
