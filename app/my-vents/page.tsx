"use client";
import { useState, useEffect } from 'react';
import { Vent } from '@/types';
import { VentCard } from '@/components/VentCard';
import { getDeviceHash } from '@/lib/deviceStorage';

export default function MyVentsDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [vents, setVents] = useState<Vent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Beta Request State
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchDashboardVents = async () => {
      setIsLoading(true);
      const deviceHash = getDeviceHash();
      const stars = JSON.parse(localStorage.getItem('sv_stars') || '[]');
      
      try {
        const res = await fetch(`/api/my-vents?tab=${activeTab}&hash=${deviceHash}&stars=${stars.join(',')}`);
        const data = await res.json();
        setVents(data.vents || []);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchDashboardVents();
  }, [activeTab]);

  const handleBetaSubmit = async () => {
    if (!email) return;
    setSubmitLoading(true);
    
    try {
      const deviceHash = getDeviceHash();
      await fetch('/api/beta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason, device_hash: deviceHash })
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setEmail('');
        setReason('');
      }, 3000);
    } catch (e) {
      console.error(e);
    }
    setSubmitLoading(false);
  };

  return (
    <>
      <div className="min-h-screen pb-16">
        <main className="max-w-[680px] mx-auto px-[24px] md:px-[40px] pt-[30px]">
          
          {/* Warning Banner */}
          <div className="bg-[#FEF2F2] border border-[#E24B4A]/30 rounded-xl p-4 md:p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-bold text-[#B91C1C] text-sm mb-1">Anonymous Browsing Active</h4>
                <p className="text-xs text-[#B91C1C]/80 leading-relaxed max-w-sm">
                  Your history is stored locally on this device. If you clear your browser data or switch devices, you will lose access to these posts.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Secure My Account
            </button>
          </div>

          {/* Header & Tabs */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-text-primary mb-6">My Vents</h1>
            <div className="flex gap-2 bg-black/[0.03] rounded-xl p-1 border border-black/[0.06] w-fit">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'posts' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
              >
                My Posts
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'saved' ? 'bg-white shadow-sm text-yellow-500' : 'text-text-muted hover:text-text-primary'}`}
              >
                Saved Vents
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4 min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center py-10 opacity-50">Loading your data...</div>
            ) : vents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
                <span className="text-4xl mb-4">{activeTab === 'posts' ? '✍️' : '⭐'}</span>
                <p className="text-sm font-medium">
                  {activeTab === 'posts' 
                    ? "You haven't posted any vents from this device yet." 
                    : "You haven't saved any vents yet. Tap the star icon on any vent to save it."}
                </p>
              </div>
            ) : (
              vents.map((vent) => (
                <VentCard key={vent.id} vent={vent} />
              ))
            )}
          </div>

        </main>
      </div>

      {/* Beta Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fade-slide">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary text-xl"
            >
              &times;
            </button>
            
            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Request Received</h3>
                <p className="text-sm text-text-muted">We will email you if a spot opens up.</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">StudVent is currently in Private Beta.</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Persistent accounts are currently invite-only to protect the community vibe. Request access below.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">Email (Required)</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu" 
                      className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">Why do you need an account? (Optional)</label>
                    <textarea 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="I want to save my posts..." 
                      className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 text-sm font-bold text-text-muted hover:text-text-primary transition-colors bg-black/5 hover:bg-black/10 rounded-xl py-3"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBetaSubmit}
                    disabled={!email || submitLoading}
                    className="flex-1 bg-primary text-white text-sm font-bold py-3 rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? 'Sending...' : 'Request Access'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
