import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Rongqi Lu | Research Profile",
  description:
    "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28 sm:px-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
