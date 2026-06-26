"use client";
import { useEffect, useState } from 'react';
import { Vent } from '@/types';

export function TrendingBar() {
  const [trending, setTrending] = useState<Vent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/vents?sort=trending&limit=3')
      .then(res => res.json())
      .then(data => { setTrending(data.vents || []); setLoaded(true); });
  }, []);

  // Reserve space even while loading to prevent CLS
  if (!loaded) {
    return (
      <div className="my-8" style={{ minHeight: '120px' }}>
        <div className="skeleton h-4 w-32 rounded mb-3"></div>
        <div className="flex gap-3">
          <div className="skeleton min-w-[240px] h-[80px] rounded-xl"></div>
          <div className="skeleton min-w-[240px] h-[80px] rounded-xl"></div>
          <div className="skeleton min-w-[240px] h-[80px] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!trending.length) return null;

  return (
    <div className="my-8">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-text-secondary">
        <span className="text-base">🔥</span> Trending today
      </h3>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {trending.map(vent => (
          <div 
            key={vent.id} 
            className="min-w-[240px] max-w-[240px] glass rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300 cursor-default shadow-sm"
          >
            <p className="text-sm truncate text-text-primary mb-3">{vent.text}</p>
            <span className="text-xs text-primary font-semibold">{vent.same_count} felt this</span>
          </div>
        ))}
      </div>
    </div>
  );
}