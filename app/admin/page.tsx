"use client";
// v1.0.2 - Production Stable
import { useState, useEffect, useCallback } from 'react';

interface Vent {
  id: string;
  text: string;
  category: string;
  same_count: number;
  report_count: number;
  created_at: string;
  is_visible: boolean;
  real_count?: { count: number }[];
}

interface ChatRequest {
  id: string;
  cause: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: number;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'vents' | 'chats' | 'logs'>('vents');
  
  const [vents, setVents] = useState<Vent[]>([]);
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<'fresh' | 'trending' | 'reports' | 'hidden'>('fresh');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [isRestMode, setIsRestMode] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedVentIds, setSelectedVentIds] = useState<string[]>([]);
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [boostAmount, setBoostAmount] = useState(10);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [new Date().toLocaleTimeString() + ": " + msg, ...prev].slice(0, 100));

  const toggleRestMode = async () => {
    const nextState = !isRestMode;
    const res = await fetch('/api/admin/rest-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode, enabled: nextState }),
    });
    if (res.ok) {
      setIsRestMode(nextState);
      addLog(`SYSTEM REST MODE: ${nextState ? 'ENGAGED' : 'DISENGAGED'}`);
    }
  };

  useEffect(() => {
    const fetchRestStatus = async () => {
      const res = await fetch('/api/admin/rest-mode');
      const data = await res.json();
      setIsRestMode(data.isRestMode);
    };
    if (authed) fetchRestStatus();
  }, [authed]);

  const fetchVents = useCallback(async (p = page, s = sort, d = dateFilter) => {
    setLoading(true);
    setAuthError(false);
    try {
      const currentPasscode = passcode || localStorage.getItem('studvent_admin_key') || '';
      const res = await fetch(`/api/admin/vents?passcode=${encodeURIComponent(currentPasscode)}&page=${p}&sort=${s}&date=${d}`);
      if (res.ok) {
        const data = await res.json();
        setVents(data.vents || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
        setAuthed(true);
        if (passcode) {
          localStorage.setItem('studvent_admin_key', passcode);
          setPasscode(passcode);
        } else {
          setPasscode(currentPasscode);
        }
        addLog("Vents Synced");
      } else if (res.status === 401) {
        setAuthed(false);
        setAuthError(true);
        localStorage.removeItem('studvent_admin_key');
        addLog("Auth Denied");
      }
    } catch { addLog("Fetch failed"); }
    finally { setLoading(false); }
  }, [passcode, page, sort, dateFilter]);

  useEffect(() => {
    const saved = localStorage.getItem('studvent_admin_key');
    if (saved && !authed) {
      setPasscode(saved);
      fetchVents(1);
    }
  }, [authed, fetchVents]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests?passcode=${encodeURIComponent(passcode)}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        addLog("Chats Synced");
      }
    } catch { addLog("Chat fetch failed"); }
    finally { setLoading(false); }
  }, [passcode]);

  useEffect(() => {
    if (authed) {
      if (activeTab === 'vents') fetchVents();
      else if (activeTab === 'chats') fetchRequests();
    }
  }, [authed, activeTab, fetchVents, fetchRequests]);

  const updateVent = async (id: string, updates: Partial<Vent>) => {
    setUpdating(id);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/vents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, passcode, updates, action: 'single' }),
      });
      const data = await res.json();
      if (res.ok && data.vent) {
        setVents(prev => prev.map(v => v.id === id ? { ...v, ...data.vent } : v));
        setSuccess(id);
        addLog(`Saved #${id.slice(0, 4)}`);
        setTimeout(() => setSuccess(null), 1000);
      } else {
        alert("SYNC ERROR: " + data.error);
        if (res.status === 401) setAuthed(false);
      }
    } catch { addLog("Sync Error"); }
    finally { setUpdating(null); }
  };

  const updateRequest = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, passcode }),
      });
      if (res.ok) {
        addLog(`Chat ${status}`);
        fetchRequests();
      }
    } catch { addLog("Chat Error"); }
    finally { setUpdating(null); }
  };

  const bulkUpdateRequests = async (status: string) => {
    setLoading(true);
    try {
      const targetIds = selectedRequestIds.length > 0 ? selectedRequestIds : requests.filter(r => r.status === 'pending').map(r => r.id);
      if (targetIds.length === 0) return;
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: targetIds, status, passcode }),
      });
      if (res.ok) {
        setSelectedRequestIds([]);
        addLog(`Bulk ${status} ${targetIds.length} users`);
        fetchRequests();
      }
    } catch { addLog("Bulk Error"); }
    finally { setLoading(false); }
  };

  const boostSelectedVents = async () => {
    if (selectedVentIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedVentIds, passcode, boost: boostAmount, action: 'boost' }),
      });
      if (res.ok) {
        setSelectedVentIds([]);
        addLog(`Boosted ${selectedVentIds.length} vents`);
        fetchVents();
      }
    } catch { addLog("Boost Error"); }
    finally { setLoading(false); }
  };

  const deleteVent = async (id: string) => {
    if (!confirm("Delete permanently?")) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/vents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, passcode }),
      });
      if (res.ok) {
        setVents(prev => prev.filter(v => v.id !== id));
        addLog(`Deleted #${id.slice(0, 4)}`);
      }
    } catch { addLog("Delete Error"); }
    finally { setDeleting(null); }
  };

  const bulkDeleteVents = async () => {
    if (selectedVentIds.length === 0) return;
    if (!confirm(`Permanently delete ${selectedVentIds.length} selected vents?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedVentIds, passcode }),
      });
      if (res.ok) {
        setSelectedVentIds([]);
        addLog(`Vaporized ${selectedVentIds.length} vents`);
        fetchVents();
      }
    } catch { addLog("Bulk Delete Error"); }
    finally { setLoading(false); }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request forever?")) return;
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, passcode }),
      });
      if (res.ok) {
        addLog(`Deleted request #${id.slice(0, 4)}`);
        fetchRequests();
      }
    } catch { addLog("Chat Delete Error"); }
    finally { setUpdating(null); }
  };

  const bulkDeleteRequests = async () => {
    if (selectedRequestIds.length === 0) return;
    if (!confirm(`Vaporize ${selectedRequestIds.length} selected chat requests?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRequestIds, passcode }),
      });
      if (res.ok) {
        setSelectedRequestIds([]);
        addLog(`Vaporized ${selectedRequestIds.length} chat requests`);
        fetchRequests();
      }
    } catch { addLog("Bulk Chat Delete Error"); }
    finally { setLoading(false); }
  };

  if (!authed) {
    return (
      <div className="max-w-[400px] mx-auto mt-[120px] p-6 font-mono">
        <h1 className="text-[20px] font-black mb-4 uppercase italic tracking-tighter text-black text-center">Master Vault Lock</h1>
        <div className="border-4 border-black p-8 bg-white shadow-[12px_12px_0px_#000] relative">
          {loading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-black animate-pulse uppercase text-black">Checking Key...</div>}
          <input 
            type="password" 
            placeholder="ENTER PASSCODE" 
            value={passcode} 
            onChange={(e) => setPasscode(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !loading && fetchVents(1)} 
            className={`w-full p-4 border-4 border-black mb-6 outline-none font-black text-center text-black ${authError ? 'bg-red-50 text-red-600 border-red-600' : 'bg-neutral-50'}`} 
          />
          <button onClick={() => fetchVents(1)} disabled={loading} className="w-full p-4 bg-black text-white font-black shadow-[4px_4px_0px_#333] active:translate-y-1 active:shadow-none transition-all uppercase">Unlock</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 font-mono text-black">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-4 border-black pb-4 mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-black text-white p-1">🛡️</span> MODERATION CENTER
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button onClick={() => setActiveTab('vents')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-black font-black text-[10px] sm:text-xs ${activeTab === 'vents' ? 'bg-black text-white shadow-[2px_2px_0px_#333]' : 'bg-white'}`}>VENTS</button>
          <button onClick={() => setActiveTab('chats')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-black font-black text-[10px] sm:text-xs ${activeTab === 'chats' ? 'bg-black text-white shadow-[2px_2px_0px_#333]' : 'bg-white'}`}>CHATS</button>
          <button onClick={() => setActiveTab('logs')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-black font-black text-[10px] sm:text-xs ${activeTab === 'logs' ? 'bg-black text-white shadow-[2px_2px_0px_#333]' : 'bg-white'}`}>LOGS</button>
          <button onClick={toggleRestMode} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-black font-black text-[10px] sm:text-xs transition-all ${isRestMode ? 'bg-amber-400 text-black animate-pulse' : 'bg-white text-neutral-400'}`}>
            {isRestMode ? 'SYSTEM RESTING' : 'REST MODE'}
          </button>
          <button onClick={() => setAuthed(false)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-600 text-white font-black text-[10px] sm:text-xs">LOCK</button>
        </div>
      </div>

      {activeTab === 'vents' ? (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-neutral-100 p-4 border-2 border-black shadow-[4px_4px_0px_#000] gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-black uppercase whitespace-nowrap">Boost:</label>
                <input type="number" value={boostAmount} onChange={(e) => setBoostAmount(parseInt(e.target.value) || 0)} className="w-16 sm:w-20 px-2 py-1 border-2 border-black font-black text-sm" />
              </div>
              <button onClick={boostSelectedVents} disabled={selectedVentIds.length === 0 || loading} className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5">🚀 BOOST ({selectedVentIds.length})</button>
              <button onClick={bulkDeleteVents} disabled={selectedVentIds.length === 0 || loading} className="flex-1 sm:flex-none px-4 py-1.5 bg-red-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5">🗑️ DELETE ({selectedVentIds.length})</button>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              {[
                { id: 'fresh', label: 'Fresh' },
                { id: 'trending', label: 'Trending' },
                { id: 'reports', label: 'Reports' },
                { id: 'hidden', label: 'Hidden' }
              ].map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setSort(s.id as 'fresh' | 'trending' | 'reports' | 'hidden'); setPage(1); }} 
                  className={`px-3 py-1.5 border-2 border-black font-black text-[9px] uppercase tracking-wider transition-all ${sort === s.id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="flex-1 sm:flex-none p-1 border-2 border-black text-[10px] font-black" />
              <button onClick={() => fetchVents(page)} className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase">Refresh</button>
              
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="font-black px-1 hover:text-primary transition-all">&lt;</button>
                {(() => {
                  const windowSize = 6;
                  let start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, start + windowSize - 1);
                  if (end - start + 1 < windowSize) {
                    start = Math.max(1, end - windowSize + 1);
                  }
                  const pages = [];
                  for (let i = start; i <= end; i++) pages.push(i);
                  return pages.map(pNum => (
                    <button 
                      key={pNum} 
                      onClick={() => setPage(pNum)}
                      className={`text-[10px] font-black w-5 h-5 flex items-center justify-center border border-black ${page === pNum ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'}`}
                    >
                      {pNum}
                    </button>
                  ));
                })()}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="font-black px-1 hover:text-primary transition-all">&gt;</button>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-neutral-400">TOTAL: {totalCount} | PAGE {page}/{totalPages}</div>
          </div>

          <div className="grid gap-4">
            {vents.map(v => (
              <div key={v.id} className={`border-2 border-black p-3 sm:p-4 transition-all duration-500 relative ${success === v.id ? 'bg-green-50 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-white shadow-[4px_4px_0px_#000]'}`}>
                {updating === v.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none font-black text-[10px] animate-pulse">SAVING...</div>
                )}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <input type="checkbox" checked={selectedVentIds.includes(v.id)} onChange={(e) => e.target.checked ? setSelectedVentIds([...selectedVentIds, v.id]) : setSelectedVentIds(selectedVentIds.filter(id => id !== v.id))} className="mt-1.5 w-4 h-4 cursor-pointer accent-black border-2 border-black shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] font-bold opacity-50 mb-2 gap-1">
                      <div className="flex gap-2 items-center overflow-hidden">
                        <span className="bg-black text-white px-2 py-0.5 whitespace-nowrap">{v.category}</span>
                        <span className="truncate">{new Date(v.created_at).toLocaleString()}</span>
                      </div>
                      <span className="font-mono text-[9px] truncate">#{v.id.slice(0, 12)}</span>
                    </div>
                    <textarea
                      value={v.text}
                      onChange={(e) => setVents(prev => prev.map(vnt => vnt.id === v.id ? { ...vnt, text: e.target.value } : vnt))}
                      onBlur={(e) => updateVent(v.id, { text: e.target.value })}
                      className="w-full p-2 border border-black/10 text-sm font-medium outline-none focus:border-black bg-neutral-50/30 min-h-[100px]"
                    />
                    <div className="flex flex-wrap gap-x-4 gap-y-3 mt-3 pt-3 border-t border-black/5 items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase">Likes:</label>
                        <input type="number" value={v.same_count} onChange={(e) => setVents(prev => prev.map(vnt => vnt.id === v.id ? { ...vnt, same_count: parseInt(e.target.value) || 0 } : vnt))} className="w-16 px-1 border-2 border-black font-black text-xs text-right bg-blue-50" />
                        <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 uppercase tracking-tighter">
                          Audit: {v.real_count?.[0]?.count ?? 0}
                        </span>
                        <button onClick={() => updateVent(v.id, { same_count: v.same_count })} className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase active:translate-y-0.5">Save</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase text-red-600">Reports:</label>
                        <input type="number" value={v.report_count} onChange={(e) => setVents(prev => prev.map(vnt => vnt.id === v.id ? { ...vnt, report_count: parseInt(e.target.value) || 0 } : vnt))} className="w-16 px-1 border-2 border-black font-black text-xs text-right text-red-600 bg-red-50" />
                        <button onClick={() => updateVent(v.id, { report_count: v.report_count })} className="px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase active:translate-y-0.5">Save</button>
                      </div>
                      <div className="flex gap-2 ml-auto w-full sm:w-auto sm:justify-end">
                        <button onClick={() => updateVent(v.id, { is_visible: !v.is_visible })} className={`flex-1 sm:flex-none px-3 py-1 font-black text-[10px] border-2 border-black ${v.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v.is_visible ? '● PUBLIC' : '○ HIDDEN'}</button>
                        <button onClick={() => deleteVent(v.id)} disabled={deleting === v.id} className="flex-1 sm:flex-none px-3 py-1 bg-red-600 text-white font-black text-[10px] border-2 border-black">{deleting === v.id ? '...' : 'DELETE'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-6 mt-8 pb-10">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="px-6 py-2 border-2 border-black font-black disabled:opacity-20 hover:bg-black hover:text-white transition-all uppercase tracking-widest text-xs"
            >
              Prev
            </button>
            <div className="text-xs font-black uppercase tracking-widest">
              Page {page}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="px-6 py-2 border-2 border-black font-black disabled:opacity-20 hover:bg-black hover:text-white transition-all uppercase tracking-widest text-xs"
            >
              Next
            </button>
          </div>
        </div>
      ) : activeTab === 'chats' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-neutral-100 p-4 border-2 border-black shadow-[4px_4px_0px_#000] gap-4">
            <div className="flex flex-wrap gap-3">
              <button onClick={() => bulkUpdateRequests('accepted')} className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5 uppercase">Accept Selected</button>
              <button onClick={() => bulkUpdateRequests('rejected')} className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5 uppercase">Reject Selected</button>
              <button onClick={bulkDeleteRequests} disabled={selectedRequestIds.length === 0 || loading} className="flex-1 sm:flex-none px-4 py-2 bg-red-700 text-white font-black text-[10px] shadow-[2px_2px_0px_#000] active:translate-y-0.5 uppercase">🗑️ Vaporize</button>
            </div>
            <div className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase text-center">{selectedRequestIds.length} Selected</div>
          </div>

          <div className="grid gap-4">
            {requests.length === 0 ? <div className="text-center py-20 font-bold opacity-30 uppercase tracking-widest">No Requests in Queue</div> : (
              requests.map(r => (
                <div key={r.id} className={`border-2 border-black p-3 sm:p-4 transition-all relative ${selectedRequestIds.includes(r.id) ? 'bg-neutral-50 shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[4px_4px_0px_#000]'}`}>
                  {updating === r.id && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 font-black text-[10px] animate-pulse uppercase">Modifying...</div>}
                  <div className="flex gap-3 sm:gap-4">
                    <input type="checkbox" checked={selectedRequestIds.includes(r.id)} onChange={(e) => e.target.checked ? setSelectedRequestIds([...selectedRequestIds, r.id]) : setSelectedRequestIds(selectedRequestIds.filter(id => id !== r.id))} className="mt-1 w-4 h-4 cursor-pointer accent-black border-2 border-black shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-2 text-[10px] font-bold opacity-50 gap-2">
                        <span className="truncate">ID: {r.id.slice(0, 12)}...</span>
                        <div className="flex gap-2 shrink-0">
                          <span className={`uppercase px-2 py-0.5 border border-black ${r.status === 'accepted' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                          <button onClick={() => deleteRequest(r.id)} className="px-2 py-0.5 bg-red-600 text-white font-black text-[9px] hover:bg-red-700">DELETE</button>
                        </div>
                      </div>
                      <p className="text-sm font-bold bg-neutral-50 p-3 border border-dashed border-neutral-300 rounded-lg italic break-words">&quot;{r.cause}&quot;</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {r.status === 'pending' ? (
                          <>
                            <button onClick={() => updateRequest(r.id, 'accepted')} className="flex-1 sm:flex-none px-4 py-1.5 bg-green-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5">ACCEPT</button>
                            <button onClick={() => updateRequest(r.id, 'rejected')} className="flex-1 sm:flex-none px-4 py-1.5 bg-red-600 text-white font-black text-[10px] shadow-[2px_2px_0px_#333] active:translate-y-0.5">REJECT</button>
                          </>
                        ) : (
                          <button onClick={() => updateRequest(r.id, 'pending')} className="flex-1 sm:flex-none px-3 py-1 border-2 border-black font-black text-[9px] hover:bg-black hover:text-white transition-all uppercase">Reset to Pending</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">System Logs History</h2>
            <button onClick={() => setLogs([])} className="text-[10px] font-black bg-red-600 text-white px-3 py-1 hover:bg-red-700 active:translate-y-0.5">WIPE CONSOLE</button>
          </div>
          <div className="bg-black p-4 sm:p-6 min-h-[400px] border-4 border-neutral-800 shadow-[8px_8px_0px_#333] font-mono text-[11px] text-green-400 overflow-y-auto max-h-[600px]">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center opacity-30 italic">IDLE: Awaiting system activity...</div>
            ) : logs.map((log, i) => (
              <div key={i} className="mb-2 border-b border-neutral-900 pb-2 flex gap-4">
                <span className="text-neutral-600 shrink-0">[{i.toString().padStart(3, '0')}]</span>
                <span className="break-words">{log}</span>
              </div>
            ))}
            <div className="mt-4 animate-pulse text-white">_ SYSTEM STANDBY...</div>
          </div>
        </div>
      )}
      
      {/* GLOBAL STATUS CONSOLE (Minimal) */}
      <div className="mt-12 p-3 bg-neutral-900 text-[9px] font-mono text-green-500/70 border-t-2 border-black flex justify-between items-center">
        <span>STATUS: {loading ? 'SYNCING_DATA...' : 'SYSTEM_IDLE'}</span>
        <span>SESSION: AUTHENTICATED_ADMIN</span>
      </div>
    </div>
  );
}
