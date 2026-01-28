"use client";

import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans text-slate-900 border-t-4 border-blue-600">
      {/* Top Navigation */}
      <nav className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">Unify</span>
        </div>

      </nav>

      <div className="flex-1 max-w-7xl w-auto mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side: Product Info */}
        <div className="py-12 lg:py-0">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Management <br />
            <span className="text-blue-600">Perfected.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            Collaborate, track, and ship faster with a workspace designed for high-performance teams. Unify combines your entire workflow into one clean, lightning-fast dashboard.
          </p>

          <div className="space-y-4 mb-10">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <span className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Working Demo</span>
              </div>
              <p>
                To watch the demo of how Admin Account works, click on the button below.
              </p>
              <Link
                href="https://unify-pm.vercel.app/"
                target="_blank"
                className="block mt-3 w-1/3 pl-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Go to Workspace
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Real-time Sync</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 14.535a12 12 0 0018 0l-1-8.551z" /></svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Secure Vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex flex-col items-center">
          <SignedIn >
            <div className="w-full max-w-md p-10 bg-white rounded-[2rem] border border-slate-200 shadow-xl text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Unify</h2>
              <p className="text-slate-500 mb-8">You are currently signed in as authorized user.</p>
              <Link
                href="/organisation"
                className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Go to Workspace
              </Link>
            </div>
          </SignedIn>

          <SignedOut >
            <div className="w-full max-w-md">
              {/* Tab Selector */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
                <button
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === "signin"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === "signup"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Create Account
                </button>
              </div>

              <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-100">
                {authMode === "signin" ? (
                  <SignIn
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent border-none shadow-none p-4 w-full",
                        headerTitle: "text-2xl font-bold text-slate-900",
                        headerSubtitle: "text-slate-500",
                        socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all",
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm font-bold py-3 rounded-xl transition-all",
                        footer: "hidden",
                        footerAction: "hidden",
                        internal: "hidden",
                        formFieldInput: "bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-slate-900",
                        formFieldLabel: "text-slate-700 font-semibold mb-1",
                        dividerLine: "bg-slate-100",
                        dividerText: "text-slate-400 font-medium",
                        identityPreviewText: "text-slate-900 font-semibold",
                        identityPreviewEditButtonIcon: "text-blue-600"
                      },
                      variables: {
                        colorPrimary: "#2563eb",
                      }
                    }}
                  />
                ) : (
                  <SignUp
                    routing="hash"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent border-none shadow-none p-4 w-full",
                        headerTitle: "text-2xl font-bold text-slate-900",
                        headerSubtitle: "text-slate-500",
                        socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all",
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm font-bold py-3 rounded-xl transition-all",
                        footer: "hidden",
                        footerAction: "hidden",
                        internal: "hidden",
                        formFieldInput: "bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-slate-900",
                        formFieldLabel: "text-slate-700 font-semibold mb-1",
                        dividerLine: "bg-slate-100",
                        dividerText: "text-slate-400 font-medium"
                      },
                      variables: {
                        colorPrimary: "#2563eb",
                      }
                    }}
                  />
                )}
              </div>
              <p className="mt-8 text-center text-sm text-slate-500">
                By entering, you agree to our <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </SignedOut>
        </div>
      </div>

      <footer className="h-20 flex items-center justify-center border-t border-slate-100 px-6">
        <p className="text-sm text-slate-400 font-medium">© 2026 Unify Systems Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}