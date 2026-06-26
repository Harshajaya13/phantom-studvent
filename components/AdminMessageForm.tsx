"use client";
import { useState, useEffect, Suspense } from 'react';
import { getSuperFingerprint } from '@/lib/super-fingerprint';
import { useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    $crisp: unknown[][];
  }
}

function AdminMessageFormContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [cause, setCause] = useState('');
  const [type, setType] = useState<'suggestion' | 'assurance'>('assurance');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const [hardwareId, setHardwareId] = useState('');

  useEffect(() => {
    const t = searchParams.get('type');
    if (t === 'suggestion' || t === 'assurance') {
      setType(t as 'suggestion' | 'assurance');
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkStatus() {
      const id = await getSuperFingerprint();
      setHardwareId(id);
      
      try {
        const res = await fetch(`/api/support/request?hardwareId=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          setRequestStatus(data.request?.status || 'none');
        }
      } catch (err) {
        console.error("Status check failed", err);
      }
    }
    checkStatus();
  }, []);

  const handleSendSuggestion = async () => {
    if (message.length < 5 || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/admin/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type: 'suggestion' }),
      });
      if (res.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Send suggestion failed', err);
      setStatus('error');
    }
  };

  const handleRequestChat = async () => {
    if (cause.length < 10 || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/support/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hardwareId, cause }),
      });

      if (res.ok) {
        setRequestStatus('pending');
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const openLiveChat = () => {
    if (typeof window !== 'undefined' && window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-primary/10 shadow-lg">
      <div className="flex gap-2 mb-6 p-1 bg-black/[0.03] rounded-xl">
        <button 
          onClick={() => setType('assurance')}
          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${type === 'assurance' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          🤝 Need any help?
        </button>
        <button 
          onClick={() => setType('suggestion')}
          className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${type === 'suggestion' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          💡 Suggestion
        </button>
      </div>

      {type === 'suggestion' ? (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-black text-text-primary mb-1">Help us grow!</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">Have an idea to make StudVent better? Share your feedback directly with our team.</p>
          </div>
          <textarea
            className="w-full min-h-[120px] bg-white/[0.05] border border-black/[0.06] rounded-xl p-4 text-[14px] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-text-primary placeholder:text-text-muted"
            placeholder="Your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === 'sending' || status === 'success'}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] font-mono text-text-muted">{message.length} chars</span>
            <button onClick={handleSendSuggestion} disabled={message.length < 5 || status === 'sending' || status === 'success'} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${status === 'success' ? 'bg-green-500 text-white' : status === 'error' ? 'bg-red-500 text-white' : 'bg-primary text-white hover:bg-primary-dark shadow-md active:scale-95 disabled:opacity-50'}`}>{status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent! ✓' : status === 'error' ? 'Failed!' : 'Send Suggestion'}</button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>⚖️</span> Legal Disclaimer & Privacy
            </h4>
            <div className="space-y-2 text-[10px] leading-relaxed text-amber-900/80 font-medium">
              <p>• We provide <strong>positive peer advice</strong>, not professional medical cures or legal help.</p>
              <p>• <strong>No financial aid</strong> or money transfers are provided under any circumstances.</p>
              <p>• We are not available 24/7. Response times vary based on admin availability.</p>
              <p>• By clicking &quot;Request&quot;, you waive all rights to legal action or lawsuits against StudVent.</p>
            </div>
          </div>

          {requestStatus === 'none' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-text-primary mb-1">State your cause</h3>
                <p className="text-[12px] text-text-secondary leading-relaxed mb-4">Spam or &quot;Hi&quot; messages are ignored. Briefly explain what you want to talk about.</p>
                <textarea
                  className="w-full min-h-[100px] bg-white/[0.05] border border-black/[0.06] rounded-xl p-4 text-[14px] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-text-primary"
                  placeholder="The real reason you want to talk..."
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                />
              </div>
              <button onClick={handleRequestChat} disabled={cause.length < 10 || status === 'sending'} className="w-full bg-primary text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50">Request Chat Access</button>
            </div>
          )}

          {requestStatus === 'pending' && (
            <div className="text-center py-6 bg-primary/5 rounded-2xl border border-primary/10 animate-pulse">
              <p className="text-primary font-black uppercase tracking-widest text-[13px]">Request Pending</p>
              <p className="text-[11px] text-text-secondary mt-1">Admin is reviewing your cause. Check back later.</p>
            </div>
          )}

          {requestStatus === 'rejected' && (
            <div className="text-center py-6 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-600 font-black uppercase tracking-widest text-[13px]">Request Denied</p>
              <p className="text-[11px] text-red-800 mt-1">Spam or vague causes are rejected. Please be real next time.</p>
            </div>
          )}

          {requestStatus === 'accepted' && (
            <div className="text-center py-6">
              <p className="text-green-600 font-black uppercase tracking-widest text-[12px] mb-4">Request Approved ✓</p>
              <button onClick={openLiveChat} className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3">Start Anonymous Chat 💬</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminMessageForm() {
  return (
    <Suspense fallback={<div className="h-[300px] animate-pulse bg-black/5 rounded-2xl" />}>
      <AdminMessageFormContent />
    </Suspense>
  );
}
