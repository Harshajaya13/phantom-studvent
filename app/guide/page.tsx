import { UserGuide } from '@/components/UserGuide';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-12 mb-8">
        <div className="max-w-[1000px] mx-auto px-6">
          <Link href="/" className="text-xs font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
            Platform Explorer
          </h1>
          <p className="text-gray-500 font-medium max-w-lg leading-relaxed">
            Everything you need to know about navigating India&apos;s anonymous student community.
          </p>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="max-w-[1000px] mx-auto px-4">
        <UserGuide />
      </div>

      {/* FOOTER CTA */}
      <div className="max-w-[1000px] mx-auto px-6 mt-12 text-center">
        <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
          <h2 className="text-2xl font-black mb-2 tracking-tight">Ready to break the silence?</h2>
          <p className="text-blue-100 font-medium mb-6">Your first vent is just a click away. 100% anonymous, 100% yours.</p>
          <Link href="/" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">
            Go to Home Feed ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
