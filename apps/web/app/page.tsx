import React from "react"
import Logo from "@/components/Logo"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 text-indigo-500" />
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Echo
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-neutral-400 md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-white"
            >
              How it Works
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-5 py-2.5 text-black transition-colors hover:bg-neutral-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-7xl px-6 text-center">
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            Real-time Audio Fingerprinting
          </div>
          <h1 className="mb-8 text-6xl leading-[1.1] font-bold tracking-tighter md:text-8xl">
            Identify any sound, <br />
            <span className="text-neutral-500">instantly.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl">
            Echo is a professional-grade audio recognition platform. Intercept
            audio from your browser tabs and match it against millions of
            fingerprints with sub-second latency.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/download"
              className="w-full rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-indigo-500 active:scale-95 sm:w-auto"
            >
              Download Extension
            </Link>
            <Link
              href="/docs"
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 px-8 py-4 font-semibold text-neutral-300 transition-all hover:bg-neutral-800 sm:w-auto"
            >
              Read Documentation
            </Link>
          </div>

          {/* Visual Element */}
          <div className="relative mx-auto mt-24 max-w-5xl">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 opacity-50 blur-[120px]"></div>
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-24 items-end gap-1">
                  {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 animate-pulse rounded-full bg-indigo-500/40"
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
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-3 opacity-50">
            <Logo className="h-6 w-6" />
            <span className="font-bold">Echo</span>
          </div>
          <p className="text-sm text-neutral-500">
            © 2026 Echo Identification System. Built for professional acoustic
            fingerprinting.
          </p>
          <div className="flex gap-6 text-neutral-500">
            <Link href="#" className="transition-colors hover:text-white">
              GitHub
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
