import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Rongqi Lu | Research Profile",
  description:
    "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
  openGraph: {
    title: "Rongqi Lu | Research Profile",
    description:
      "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
    url: "https://www.ronchy2000.top",
    siteName: "Rongqi Lu Research Profile",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rongqi Lu | Research Profile",
    description:
      "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 自动检测并设置语言
              (function() {
                try {
                  const savedLocale = localStorage.getItem('locale');
                  if (savedLocale === 'zh' || savedLocale === 'en') {
                    document.documentElement.lang = savedLocale;
                    return;
                  }
                  const browserLang = navigator.language.toLowerCase();
                  document.documentElement.lang = browserLang.startsWith('zh') ? 'zh' : 'en';
                } catch (e) {
                  document.documentElement.lang = 'en';
                }
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
