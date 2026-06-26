"use client";
import { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  User, 
  ShieldCheck, 
  Newspaper, 
  MessageSquareHeart,
  ChevronRight,
  ExternalLink,
  Star,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';

type SectionId = 'home' | 'support' | 'myvents' | 'legal' | 'blog' | 'feedback';

export function UserGuide() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const menuItems = [
    { id: 'home', icon: <Home size={18} />, label: 'Home Feed' },
    { id: 'support', icon: <MessageCircle size={18} />, label: 'Need Help?' },
    { id: 'myvents', icon: <User size={18} />, label: 'My Vents' },
    { id: 'legal', icon: <ShieldCheck size={18} />, label: 'Privacy & Legal' },
    { id: 'blog', icon: <Newspaper size={18} />, label: 'The Blog' },
    { id: 'feedback', icon: <MessageSquareHeart size={18} />, label: 'Feedback' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="text-blue-600" /> Home & Venting
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              The Home feed is where the collective voice of students lives. It is designed for maximum expression with zero judgment.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[13px] text-gray-900 mb-1 uppercase tracking-wider">Post Vents</h4>
                <p className="text-xs text-gray-500 font-medium">Simply type your story in the main box and click Post. No login required, ever.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[13px] text-gray-900 mb-1 uppercase tracking-wider">Categories</h4>
                <p className="text-xs text-gray-500 font-medium">Filter the feed by Exams, Hostel, or Placements to find students going through the same thing.</p>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="text-blue-600" /> Need Any Help?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              Sometimes venting isn&apos;t enough. Our support system is built for peer advice and direct help.
            </p>
            <div className="grid gap-4 mb-6">
              <div className="p-4 border-l-4 border-blue-600 bg-blue-50/50">
                <h4 className="font-bold text-sm text-gray-900 mb-1">Direct Support</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">Your requests are stored using secure hardware fingerprinting. Only you and the admin can see the conversation thread.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              Go to Support Page <ChevronRight size={14} />
            </Link>
          </div>
        );
      case 'myvents':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="text-blue-600" /> My Vents & Account
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              Choose how you want to manage your history on StudVent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-100 transition-colors">
                <Fingerprint className="text-blue-600 mb-3" size={24} />
                <h4 className="font-bold text-sm text-gray-900 mb-1">Without Account</h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4">Uses local storage & hardware fingerprinting to link vents to your browser.</p>
                <Link href="/my-vents" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View My Local Vents</Link>
              </div>
              <div className="p-5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl opacity-80">
                <ShieldAlert className="text-gray-400 mb-3" size={24} />
                <h4 className="font-bold text-sm text-gray-400 mb-1">With Account</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-4">Sync your vents across devices. (Coming Soon for higher security).</p>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Locked</span>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-3">
              <Star className="text-yellow-600 shrink-0" size={18} />
              <p className="text-[11px] text-yellow-700 font-medium">Click the star icon on any vent to save it permanently to your collection.</p>
            </div>
          </div>
        );
      case 'legal':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> About & Privacy
            </h3>
            <div className="space-y-3">
              <Link href="/about" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="font-bold text-sm">Our Mission</span>
                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/privacy" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="font-bold text-sm">Privacy Policy</span>
                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Newspaper className="text-blue-600" /> The StudVent Blog
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              We don&apos;t just host vents; we provide solutions. Our blogs cover:
            </p>
            <ul className="space-y-2 mb-6">
              {['Academic Survival Guides', 'Mental Health Resources', 'Placement Strategies', 'Tech & Syllabus Updates'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/blog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              Visit Blog <ExternalLink size={14} />
            </Link>
          </div>
        );
      case 'feedback':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
            <MessageSquareHeart size={48} className="text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Peer Advice</h3>
            <p className="text-gray-500 text-sm font-medium mb-6 px-4">
              Your feedback is treated as Peer Advice. Share your suggestions on how we can make StudVent better for everyone.
            </p>
            <Link href="/contact?type=suggestion" className="inline-block px-8 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
              SEND PLATFORM TIP ➔
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="h-1.5 w-10 bg-blue-600 rounded-full" />
        <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-900">Platform Explorer</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[450px]">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SectionId)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === item.id 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <span className={activeSection === item.id ? 'text-blue-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-8 md:p-12 bg-white overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
