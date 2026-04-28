"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: any) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <html lang="en ">
      <body>
        {!hideNavbar && <Navbar />}
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
