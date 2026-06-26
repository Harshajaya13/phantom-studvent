"use client";
import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('sv_cookie_consent')) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-slide">
      <div className="glass-strong rounded-2xl p-5 shadow-2xl shadow-black/40">
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          We use cookies to serve personalized ads and improve your experience. 
          By using StudVent, you agree to our{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{' '}
          <a href="/terms" className="text-primary hover:underline">Terms</a>.
        </p>
        <button 
          onClick={() => { localStorage.setItem('sv_cookie_consent', 'true'); setShow(false); }} 
          className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
