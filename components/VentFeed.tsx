"use client";
import { useState, useEffect } from 'react';
import { Vent } from '@/types';
import { VentCard } from './VentCard';
import { CategoryFilter } from './CategoryFilter';

const categories = ['All', 'Exams', 'Placements', 'Hostel', 'Professors', 'Fees', 'Family Pressure', 'Mental Health', 'Other'];

// Static Mock Vents representing various college issues
const mockVentsList: Vent[] = [
  {
    id: "1",
    text: "Placements are starting next week and the TPO office is asking us to pay a 'fine' of 5000 INR for not attending a useless seminar on 'corporate etiquette'. How does this even make sense? It's literally extortion.",
    category: "Placements",
    same_count: 142,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    is_approved: true,
  },
  {
    id: "2",
    text: "The hostel mess served us raw chicken yesterday. When we complained to the warden, he said 'eat or go outside'. We pay 1.2 lakhs per year just for lodging and food. Absolutely ridiculous.",
    category: "Hostel",
    same_count: 98,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    is_approved: true,
  },
  {
    id: "3",
    text: "Professors cutting internal marks because I didn't join their paid certification courses. It's not education anymore, it's just an extortion scheme masked as a college degree.",
    category: "Professors",
    same_count: 215,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    is_approved: true,
  },
  {
    id: "4",
    text: "Parents comparing me to Sharma ji's son who got a 40 LPA package. I'm struggling to clear my backlogs and my mental health is in the gutter. I just want this semester to end.",
    category: "Family Pressure",
    same_count: 88,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    is_approved: true,
  },
  {
    id: "5",
    text: "Semester fees hiked by 20% in the middle of a academic year without any warning or reason. When students protested, security threatened to call the police. Is this a university or a prison?",
    category: "Fees",
    same_count: 154,
    created_at: new Date(Date.now() - 18000000).toISOString(),
    is_approved: true,
  }
];

export function VentFeed() {
  const [vents, setVents] = useState<Vent[]>(mockVentsList);
  const [sort, setSort] = useState<'trending' | 'fresh'>('fresh');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(mockVentsList.length);

  useEffect(() => {
    let filtered = [...mockVentsList];
    
    // Filter by Category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(v => v.category === activeCategory);
    }
    
    // Sort
    if (sort === 'trending') {
      filtered.sort((a, b) => b.same_count - a.same_count);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setVents(filtered);
    setTotal(filtered.length);
    setPage(1);
  }, [sort, activeCategory]);

  const totalPages = 5; // Fixed 5 pages to simulate depth

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    return [1, 2, 3, 4, 5];
  };

  return (
    <div className="mt-6">
      {/* 🛡️ PEAK SORT BAR */}
      <div className="flex justify-between items-center mb-6 gap-2">
        <div className="flex gap-2 p-1 bg-black/[0.03] border border-black/[0.05] rounded-full">
          <button 
            onClick={() => setSort('trending')} 
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${sort === 'trending' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-text-muted hover:bg-black/5'}`}
          >
            <span className={sort === 'trending' ? 'animate-pulse' : ''}>🔥</span> Trending
          </button>
          <button 
            onClick={() => setSort('fresh')} 
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${sort === 'fresh' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-text-muted hover:bg-black/5'}`}
          >
            <span>🌱</span> Fresh
          </button>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed">
          <span>👤</span> My Vents
        </div>
      </div>

      {/* Category Bar */}
      <div style={{ minHeight: '40px' }}>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} categories={categories} />
      </div>

      {/* Numbered Pagination (Top) */}
      <div style={{ minHeight: '52px' }} className="mt-6 mb-2">
        <div className="flex justify-center items-center gap-1.5 h-full">
          <button 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="text-text-muted text-lg font-medium mr-2 disabled:opacity-30 transition-all hover:text-primary"
          >
            &lt;
          </button>
          
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-8 h-8 rounded-md text-sm font-bold transition-all duration-200 ${
                page === p 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-muted hover:text-text-primary hover:bg-black/5'
              }`}
            >
              {p}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="text-text-muted text-lg font-medium ml-2 disabled:opacity-30 transition-all hover:text-primary"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Feed Container */}
      <div className="mt-2 space-y-3" style={{ minHeight: '400px' }}>
        {vents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-bold text-text-primary mb-2">Pigeon has landed.</h3>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed italic">
              No vents in this category right now.
            </p>
          </div>
        ) : page === 1 ? (
          vents.map((vent) => (
            <VentCard key={vent.id} vent={vent} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-slide">
            <div className="text-5xl mb-4">🕊️</div>
            <h3 className="text-lg font-bold text-text-primary mb-2">The StudVent Pigeon has landed.</h3>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed italic">
              &quot;Remaining is peak.&quot; You&apos;ve reached the absolute end of the frustrations. Go out and enjoy the fresh air—you&apos;ve earned it.
            </p>
          </div>
        )}
      </div>

      {/* Prev/Next Pagination (Bottom) */}
      <div className="mt-12 flex justify-center items-center gap-4">
        <button 
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-6 py-2.5 glass rounded-xl text-sm font-bold disabled:opacity-30 transition-all hover:shadow-sm text-text-secondary"
        >
          &larr; Prev
        </button>
        <button 
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-6 py-2.5 glass rounded-xl text-sm font-bold disabled:opacity-30 transition-all hover:shadow-sm text-text-secondary"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
