import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';
import { Navbar } from '@/components/Navbar';
import { Suspense } from 'react';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#7F77DD",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://studvent.harshalabs.me'),
  title: "StudVent — India's Student Frustration Board",
  description: "The anonymous place where Indian college students vent their real frustrations. Exams, placements, hostel life, professors — say what you actually think.",
  keywords: "student problems india, college frustrations, iit nit student vent, anonymous student platform india",
  openGraph: {
    title: "StudVent — India's Student Frustration Board",
    description: "The anonymous place where Indian college students vent their real frustrations.",
    images: ['/og.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5779094273402172"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-text-primary`}>
        <Suspense fallback={<div className="h-[56px]" />}>
          <Navbar />
        </Suspense>
        {children}
        <CookieBanner />
        {/* ─── Scripts ─────────────────────────────────── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];window.CRISP_WEBSITE_ID="${process.env.NEXT_PUBLIC_CRISP_ID || 'PASTE_ID_HERE'}";
              (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
              window.$crisp.push(["do", "chat:hide"]);
            `,
          }}
        />
      </body>
    </html>
  );
}
