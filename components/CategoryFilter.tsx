"use client";

export function CategoryFilter({ active, onChange, categories }: { active: string, onChange: (c: string) => void, categories: string[] }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`
            whitespace-nowrap h-8 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]
            transition-all duration-300 ease-out border shrink-0
            ${active === cat 
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
              : 'bg-white/60 backdrop-blur-md text-gray-500 border-black/[0.05] hover:bg-white hover:text-black hover:border-black/10'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}