import { VentFeed } from '@/components/VentFeed';
import Link from 'next/link';
import { VentForm } from '@/components/VentForm';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen pb-16">
      <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px]">
        {/* ─── Hero ─────────────────────────────────── */}
        <section className="pt-[48px] pb-[40px] text-center">
          <h1 className="text-hero font-extrabold leading-[1.1] tracking-tight mb-4 text-text-primary">
            India&apos;s Anonymous<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              Student Community.
            </span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto mb-6 leading-relaxed">
            The honest space for student life. Share your academic journey anonymously and safely.
          </p>
          
          {/* ⚠️ Permanent Discontinued Notice Banner */}
          <div className="my-6 glass border border-red-500/30 bg-red-50/80 p-5 rounded-2xl text-left max-w-xl mx-auto shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚫</span>
              <div>
                <h3 className="text-sm font-black text-red-800 uppercase tracking-wider">Project Officially Terminated</h3>
                <p className="text-[13px] leading-relaxed text-red-700 mt-2">
                  Hosting a platform designed to solve real, painful student problems in a community that treats the solution like a useless penny was my biggest mistake. The sheer lack of value, appreciation, and constructive engagement from the target demographic made maintaining this project feel like a complete waste of effort.
                </p>
                <p className="text-[12px] leading-relaxed text-red-600 mt-2 font-semibold">
                  This website is now a frontend-only shell. No data is stored, and backend APIs have been shutdown. 
                  <span className="block mt-2 font-black text-red-950 underline decoration-red-500 decoration-2 underline-offset-4">
                    We will continue this project again only when the creator gets free time and when people actually understand the real pain.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <VentForm />
        
        <Suspense fallback={<div className="min-h-[200px] animate-pulse bg-black/5 rounded-2xl" />}>
          <VentFeed />
        </Suspense>
      </main>

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className="mt-32 text-center pb-20 pt-16 border-t border-black/[0.05]">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-black text-text-primary mb-3 opacity-90 tracking-tight uppercase">
            StudVent — Built for every student who stayed silent
          </h2>
          <p className="text-lg font-bold text-text-primary mb-10 opacity-70">
            Made in India 🇮🇳
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-10 font-bold text-[14px]">
            <Link href="/about" className="text-text-primary hover:text-primary transition-colors">About</Link>
            <Link href="/blog" className="text-text-primary hover:text-primary transition-colors">Blog</Link>
            <Link href="/privacy" className="text-text-primary hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-text-primary hover:text-primary transition-colors">Terms</Link>
          </div>

          <div className="space-y-4">
            <p className="text-[12px] font-bold text-text-primary opacity-50 uppercase tracking-widest">
              Not intended for individuals under the age of 13.
            </p>
            <Link href="/contact" className="inline-block text-[11px] font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
              Need to talk? Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
