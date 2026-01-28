import type { Metadata } from "next";
import { Lato, Raleway } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopLoader from "@/components/TopLoader";
import { Suspense } from "react";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: "400",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Unify PM",
  description: "Product Management System",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${lato.variable} ${raleway.variable} antialiased`}
        >
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
