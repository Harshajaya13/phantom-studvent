import Link from 'next/link';

export function BlogCTA() {
  return (
    <div className="not-prose mt-16">
      <div className="gradient-separator mb-0"></div>
      <div className="glass rounded-2xl p-8 md:p-10 text-center shadow-sm">
        <h3 className="text-xl md:text-2xl font-extrabold text-text-primary mb-4 leading-snug">
          Is your college doing the exact same thing?
        </h3>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-8">
          You just read the reality. Now we need yours. StudVent is an anonymous, zero-friction board for students to drop the unvarnished truth about their academic burnout, hostel life, and college administration. No sign-ups. No tracking. Just vent.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          Drop Your Anonymous Vent Here
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
