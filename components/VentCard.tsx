"use client";
import { useState, useEffect } from 'react';
import { Vent } from '@/types';
import { SameButton } from './SameButton';
import { isVentStarred, toggleStarVent } from '@/lib/deviceStorage';
import { formatDistanceToNow } from 'date-fns';

const getCatStyles = (cat: string) => {
  const map: Record<string, { bg: string, text: string, border: string }> = {
    'Exams': { border: '#38BDF8', bg: '#F0F9FF', text: '#0369A1' },
    'Placements': { border: '#10B981', bg: '#F0FDF4', text: '#15803D' },
    'Hostel': { border: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
    'Professors': { border: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' },
    'Fees': { border: '#EC4899', bg: '#FDF2F8', text: '#BE185D' },
    'Family Pressure': { border: '#10B981', bg: '#ECFDF5', text: '#047857' },
    'Mental Health': { border: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
    'Other': { border: '#6B7280', bg: '#F9FAFB', text: '#4B5563' },
  };
  return map[cat] || map['Other'];
};

export function VentCard({ vent }: { vent: Vent }) {
  const catStyle = getCatStyles(vent.category);
  const [reported, setReported] = useState(false);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem('sv_reports') || '[]');
    if (reports.includes(vent.id)) setReported(true);
    setStarred(isVentStarred(vent.id));
  }, [vent.id]);

  const handleShare = async () => {
    const text = `"${vent.text}" — anonymous vent on StudVent`;
    if (navigator.share) {
      navigator.share({ text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleStar = () => {
    const newState = toggleStarVent(vent.id);
    setStarred(newState);
  };

  const toggleReport = () => {
    const isNowReported = !reported;

    if (isNowReported && !confirm('Report this vent for inappropriate content or spam?')) {
      return;
    }

    setReported(isNowReported);

    let reports = JSON.parse(localStorage.getItem('sv_reports') || '[]');
    if (isNowReported) {
      reports.push(vent.id);
    } else {
      reports = reports.filter((id: string) => id !== vent.id);
    }
    localStorage.setItem('sv_reports', JSON.stringify(reports));
  };

  return (
    <div 
      className="relative bg-white/60 backdrop-blur-xl border border-black/[0.05] rounded-[24px] p-6 shadow-sm animate-fade-slide hover:-translate-y-1 hover:shadow-md transition-all duration-400 group overflow-hidden"
    >
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: catStyle.border }}
      ></div>

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span 
            className="w-2 h-2 rounded-full shadow-sm"
            style={{ backgroundColor: catStyle.border }}
          ></span>
          <span 
            className="text-[12px] font-bold tracking-wide uppercase"
            style={{ color: catStyle.text }}
          >
            {vent.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-text-muted text-[10px] font-medium block">
            {formatDistanceToNow(new Date(vent.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <p className="text-[16px] leading-relaxed text-text-primary font-medium mb-6 whitespace-pre-wrap break-words relative z-10">
        {vent.text}
      </p>

      <div className="flex justify-between items-center relative z-10 pt-2 border-t border-black/[0.03]">
        <SameButton ventId={vent.id} initialCount={vent.same_count} />
        <div className="flex items-center gap-4 opacity-100 transition-opacity duration-300">
          <button onClick={handleStar} className={`text-[16px] font-medium transition-all ${starred ? 'text-yellow-400 hover:scale-110' : 'text-black/20 hover:text-yellow-400'}`} title="Save for later">
            {starred ? '★' : '☆'}
          </button>
          <button onClick={toggleReport} className={`text-xs font-medium transition-colors ${reported ? 'text-accent hover:text-accent/80' : 'text-black/30 hover:text-accent'}`}>
            {reported ? 'Undo Report' : 'Report'}
          </button>
          <button onClick={handleShare} className="text-xs font-medium text-black/30 hover:text-primary transition-colors">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
