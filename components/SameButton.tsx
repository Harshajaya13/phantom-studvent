"use client";
import { useState, useEffect } from 'react';

const formatCount = (c: number) => {
  if (c < 1000) return c.toString();
  if (c < 10000) return (c / 1000).toFixed(1) + 'k';
  return Math.floor(c / 1000) + 'k';
};

export function SameButton({ ventId, initialCount }: { ventId: string, initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const votes = JSON.parse(localStorage.getItem('sv_voted') || '[]');
    if (votes.includes(ventId)) setVoted(true);
  }, [ventId]);

  const toggleVote = () => {
    const isNowVoted = !voted;
    setVoted(isNowVoted);
    setCount(c => isNowVoted ? c + 1 : Math.max(0, c - 1));

    if (isNowVoted) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 200);
    }

    // Local Storage logic
    let votes = JSON.parse(localStorage.getItem('sv_voted') || '[]');
    if (isNowVoted) {
      votes.push(ventId);
    } else {
      votes = votes.filter((id: string) => id !== ventId);
    }
    localStorage.setItem('sv_voted', JSON.stringify(votes));
  };

  return (
    <button 
      onClick={toggleVote}
      className={`
        flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
        ${voted 
          ? 'bg-primary text-white shadow-sm hover:bg-primary-dark cursor-pointer' 
          : 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
        }
        ${animating ? 'animate-scale-pop' : ''}
      `}
    >
      <span className={animating ? 'animate-scale-pop' : ''}>{voted ? '🔥' : '👍'}</span>
      <span>Same</span>
      <span className={`opacity-80 ml-0.5 font-mono text-xs ${voted ? 'text-white' : 'text-primary'}`}>
        · {formatCount(count)}
      </span>
    </button>
  );
}
