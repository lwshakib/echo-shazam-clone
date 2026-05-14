"use client"

import React from "react"
import Logo from "@/components/Logo"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Icon } from "@iconify/react"
import { Moon, Sun, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-white font-sans text-black transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-neutral-900 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight">Echo</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 md:flex dark:text-neutral-400">
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                className="flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-white"
                target="_blank"
              >
                <Icon icon="mdi:github" className="h-4 w-4" /> Open Source
              </Link>
            </nav>
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900"
              aria-label="Toggle theme"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                ))}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl">
          <section className="mb-24 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[10px] font-bold tracking-widest uppercase dark:border-neutral-800 dark:bg-neutral-900">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              In Development
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tighter md:text-7xl">
              Acoustic intelligence <br />
              for the modern web.
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500 md:text-xl dark:text-neutral-400">
              Professional audio fingerprinting. Identify any sound playing in
              your browser tabs with millisecond precision and surgical
              accuracy.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                target="_blank"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-3 font-medium text-white transition-opacity hover:opacity-90 sm:w-auto dark:bg-white dark:text-black"
              >
                Get Extension <ArrowRight size={16} />
              </Link>
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                target="_blank"
                className="w-full rounded-lg border border-gray-200 px-8 py-3 transition-colors hover:bg-gray-50 sm:w-auto dark:border-neutral-800 dark:hover:bg-neutral-950"
              >
                Documentation
              </Link>
            </div>
          </section>

          {/* Minimal Feature Sections */}
          <div id="features" className="space-y-32">
            <section className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight">
                  High-Fidelity Tab Capture
                </h2>
                <p className="text-lg leading-relaxed text-gray-500 dark:text-neutral-400">
                  Echo intercepts raw PCM audio directly from your active
                  browser tabs. Unlike other tools, we bypass the system mixer
                  to ensure zero distortion, providing the cleanest possible
                  signal for our fingerprinting engine.
                </p>
              </div>
              <div className="group relative flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="relative h-[2px] w-full max-w-[240px] overflow-hidden bg-gray-200 dark:bg-neutral-800">
                  <div className="absolute top-0 left-0 h-full w-1/4 animate-[scan_1.5s_linear_infinite] bg-black dark:bg-white" />
                </div>
                <div className="absolute right-4 bottom-4 font-mono text-[10px] tracking-tighter text-gray-400 uppercase">
                  Real-time Stream Intercept
                </div>
              </div>
            </section>

            <section className="grid items-center gap-16 md:grid-cols-2">
              <div className="md:order-2">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">
                  Spectral Constellation Mapping
                </h2>
                <p className="text-lg leading-relaxed text-gray-500 dark:text-neutral-400">
                  Using Fast Fourier Transforms (FFT), we convert audio into a
                  2D spectrogram. We extract the strongest &quot;landmarks&quot;
                  to create a spectral constellation map that remains unique
                  even in noisy environments or heavy MP3 compression.
                </p>
              </div>
              <div className="group flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 md:order-1 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex h-24 items-end gap-2">
                  {[3, 8, 5, 10, 4, 9, 6, 12].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-sm bg-gray-300 transition-all duration-500 group-hover:bg-black dark:bg-neutral-700 dark:group-hover:bg-white"
                      style={{ height: `${h * 8}%` }}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight">
                  Distributed Architecture
                </h2>
                <p className="text-lg leading-relaxed text-gray-500 dark:text-neutral-400">
                  Echo is built on a professional-grade monorepo. A
                  high-concurrency Node.js orchestrator manages the database and
                  extension API, while a specialized Python FastAPI worker
                  handles heavy-duty signal processing using NumPy and SciPy.
                </p>
              </div>
              <div className="flex h-56 flex-col justify-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-8 font-mono text-[11px] dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">
                    apps/server: pnpm + express
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-gray-400">
                    apps/fingerprint-worker: python + fastapi
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-gray-400">
                    apps/chrome-extension: vite + react
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Detailed Footer */}
      <footer className="border-t border-gray-100 px-6 pt-16 pb-8 dark:border-neutral-900">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <Logo className="h-5 w-5" />
                <span className="font-bold tracking-tight">Echo</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
                The open-source standard for audio identification. Built with
                precision and privacy in mind.
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-bold">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-neutral-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Extension
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-bold">Connect</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-neutral-400">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:github" className="h-4 w-4" /> GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:twitter" className="h-4 w-4" /> Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:email" className="h-4 w-4" /> Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row dark:border-neutral-900">
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              © 2026 Echo Identification System. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-400 dark:text-neutral-500">
              <Link href="#" className="hover:text-black dark:hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-black dark:hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
