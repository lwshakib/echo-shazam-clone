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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight">Echo</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 dark:text-neutral-400 md:flex">
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
                target="_blank"
              >
                <Icon icon="mdi:github" className="w-4 h-4" /> Open Source
              </Link>
            </nav>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted &&
                (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <section className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-widest mb-8 border border-gray-200 dark:border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              In Development
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Acoustic intelligence <br />
              for the modern web.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Professional audio fingerprinting. Identify any sound playing in your
              browser tabs with millisecond precision and surgical accuracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                target="_blank"
                className="w-full sm:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Get Extension <ArrowRight size={16} />
              </Link>
              <Link
                href="https://github.com/lwshakib/echo-shazam-clone"
                target="_blank"
                className="w-full sm:w-auto px-8 py-3 border border-gray-200 dark:border-neutral-800 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-950 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </section>

          {/* Minimal Feature Sections */}
          <div id="features" className="space-y-24">
            <section className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 tracking-tight">
                  Tab Capture Engine
                </h2>
                <p className="text-gray-500 dark:text-neutral-400 leading-relaxed">
                  Direct system-level audio interception. Echo captures high-fidelity
                  streams from active browser tabs without distortion, ensuring
                  maximum matching probability.
                </p>
              </div>
              <div className="h-40 rounded-xl bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex items-center justify-center">
                <div className="w-full max-w-[200px] h-[2px] bg-gray-200 dark:bg-neutral-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-black dark:bg-white animate-[scan_2s_linear_infinite]" />
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <h2 className="text-2xl font-bold mb-4 tracking-tight">
                  Spectral Fingerprinting
                </h2>
                <p className="text-gray-500 dark:text-neutral-400 leading-relaxed">
                  Advanced Fourier analysis transforms audio into unique
                  constellations of peaks. Our algorithm is resistant to background
                  noise, low-quality speakers, and heavy compression.
                </p>
              </div>
              <div className="md:order-1 h-40 rounded-xl bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 flex items-center justify-center">
                <div className="flex gap-1 items-end h-12">
                  {[3, 7, 5, 9, 4, 8, 6, 10].map((h, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gray-300 dark:bg-neutral-700 rounded-sm"
                      style={{ height: `${h * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Detailed Footer */}
      <footer className="border-t border-gray-100 dark:border-neutral-900 pt-16 pb-8 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-5 w-5" />
                <span className="font-bold tracking-tight">Echo</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                The open-source standard for audio identification. Built with
                precision and privacy in mind.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-neutral-400">
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white">
                    Extension
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-black dark:hover:text-white">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-neutral-400">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:github" className="w-4 h-4" /> GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:twitter" className="w-4 h-4" /> Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white"
                  >
                    <Icon icon="mdi:email" className="w-4 h-4" /> Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 dark:border-neutral-900 gap-4">
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

      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  )
}
