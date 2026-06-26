"use client";
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[100px] sm:w-[140px] md:w-[180px] h-8 bg-black/[0.03] border border-black/[0.06] rounded-full px-4 text-xs outline-none focus:w-[130px] md:focus:w-[240px] focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-text-primary placeholder:text-text-muted"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity">
        🔍
      </button>
    </form>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Guide', href: '/guide' },
    { name: 'Support', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
  ];

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4 mb-6">
      <div className="w-full max-w-[900px] relative">
        <header className={`
          h-[56px] flex items-center px-6 rounded-full w-full justify-between
          transition-all duration-500 ease-out border
          ${scrolled 
            ? 'glass-strong shadow-sm border-black/[0.05]' 
            : 'bg-white/80 backdrop-blur-md border-black/[0.03]'
          }
        `}>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[18px] font-bold text-text-primary">
              stud<span className="text-primary">vent</span>
            </Link>
            <nav className="hidden lg:flex gap-6 text-[13px] font-medium text-text-muted">
              {navLinks.slice(0, 3).map(link => (
                <Link key={link.name} href={link.href} className="hover:text-text-primary transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Suspense fallback={<div className="w-[100px] h-8 bg-black/5 rounded-full animate-pulse" />}>
              <SearchInput />
            </Suspense>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors relative"
            >
              {menuOpen ? <X size={20} className="text-primary" /> : <Menu size={20} className="text-text-muted" />}
            </button>
          </div>
        </header>

        {/* 🌌 Instant-Snappy "Pure Glass" Mobile Menu */}
        <div className={`
          absolute top-[60px] left-0 right-0 lg:hidden
          transition-all duration-300 ease-out origin-top
          ${menuOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto blur-none' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none blur-sm'}
        `}>
          <div className="bg-white/70 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center gap-3 sm:gap-4 overflow-hidden mx-4 h-10 border border-black/[0.05] px-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[9px] sm:text-[10px] font-black text-gray-800 hover:text-primary transition-all whitespace-nowrap uppercase tracking-[0.1em] shrink-0"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
