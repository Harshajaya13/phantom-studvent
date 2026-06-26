"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Map, Search } from 'lucide-react';

const categories = ['Exams', 'Placements', 'Hostel', 'Professors', 'Fees', 'Family Pressure', 'Mental Health', 'Other'];

export function VentForm() {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Other');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
    alert(
      "Submission Blocked: This platform is officially discontinued.\n\n" +
      "Hosting a platform to solve real student problems in a place where the real worth of the problem feels like a penny was my mistake. The backend has been permanently taken offline."
    );
  };

  return (
    <div className={`glass rounded-2xl p-0 mb-8 shadow-sm overflow-hidden border-2 border-red-500/20 ${shake ? 'animate-shake' : ''}`}>
      {/* ⚠️ Solid Security Warning Banner */}
      <div className="bg-red-50 border-b border-red-100 px-5 py-3 flex items-center gap-3">
        <span className="text-red-600 text-lg flex-shrink-0">🚫</span>
        <p className="text-[11px] leading-tight text-red-800 font-medium">
          <span className="font-black uppercase tracking-tight mr-2">Status:</span>
          Submissions are disabled. This platform is permanently discontinued.
        </p>
      </div>

      <div className="p-5">
        <textarea 
          className="w-full min-h-[90px] outline-none text-[15px] resize-none bg-transparent text-text-primary placeholder:text-text-muted leading-relaxed"
          placeholder="What's frustrating you today? Submissions are disabled..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="gradient-separator my-3"></div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="text-sm bg-black/[0.03] border border-black/[0.06] rounded-lg px-3 py-1.5 outline-none text-text-secondary cursor-pointer hover:bg-black/[0.05] transition-colors"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="text-xs font-mono text-text-muted">
                {text.length}/280
              </span>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary glow-ready hover:bg-primary-dark cursor-pointer h-10"
          >
            Vent it
          </button>
        </div>

        {/* ─── The Blue Navigation Hub ──────────────────────── */}
        <div className="mt-4 pt-4 border-t border-black/[0.03] flex justify-center items-center gap-6">
          <Link 
            href="/guide" 
            className="text-[12px] font-black text-primary hover:text-primary-dark transition-all uppercase tracking-widest flex items-center gap-2 group"
          >
            <div className="flex -space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <Map size={15} />
              <Search size={15} />
            </div>
            How to use <span className="text-[14px] animate-arrow-swing">➔</span>
          </Link>

          <div className="w-[1px] h-3 bg-primary/20" />

          <Link 
            href="/contact" 
            className="text-[12px] font-black text-primary hover:text-primary-dark transition-all uppercase tracking-widest flex items-center gap-1.5"
          >
            Peer Support <span className="text-[14px] animate-arrow-swing">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
