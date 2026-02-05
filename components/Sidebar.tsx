
import React from 'react';
import { Server } from '../types';

interface SidebarProps {
  servers: Server[];
  activeServerId: string;
  onServerSelect: (server: Server) => void;
  onAddServer: () => void;
  onBackToHub?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ servers, activeServerId, onServerSelect, onAddServer, onBackToHub }) => {
  const playSound = (type: 'click' | 'blip') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(type === 'click' ? 300 : 800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  const handleHubClick = () => {
    playSound('blip');
    onBackToHub?.();
  };

  const handleServerClick = (server: Server) => {
    playSound('click');
    onServerSelect(server);
  };

  return (
    <div className="w-[72px] bg-[#0f051a] flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar overflow-x-hidden shrink-0 h-full border-r border-white/5">
      {/* Home / Hub Button */}
      <div 
        onClick={handleHubClick}
        className="group relative flex items-center justify-center w-12 h-12 bg-[#ff00ff] rounded-xl hover:rounded-lg transition-all duration-300 cursor-pointer text-white shadow-[0_0_15px_rgba(255,0,255,0.3)] shrink-0 magnetic-btn"
      >
        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute left-0 w-1 h-2 bg-white rounded-r-full hidden group-hover:block transition-all" />
        <div className="absolute left-20 bg-black text-white px-3 py-1.5 rounded-lg text-sm font-black italic whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-xl border border-white/10 uppercase tracking-tighter">
          Hub'a Dön
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 border-l border-b border-white/10" />
        </div>
      </div>

      <div className="w-8 h-[2px] bg-white/10 rounded-full my-1 shrink-0" />

      {/* Server List - strictly vertical */}
      <div className="flex-1 flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar">
        {servers.map(server => (
          <div 
            key={server.id} 
            onClick={() => handleServerClick(server)}
            className={`group relative flex items-center justify-center w-12 h-12 transition-all duration-300 cursor-pointer shrink-0 magnetic-btn
              ${activeServerId === server.id 
                ? 'bg-[#ff00ff] rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.4)]' 
                : 'bg-[#1e1135] rounded-xl hover:rounded-lg hover:bg-[#ff00ff]/80 shadow-md'}`}
          >
            <span className="text-white font-black text-sm uppercase italic group-hover:scale-110 transition-transform">{server.icon}</span>
            <div className={`absolute left-[-4px] w-2 bg-white rounded-r-full transition-all duration-500 
              ${activeServerId === server.id ? 'h-10 scale-100' : 'h-2 scale-0 group-hover:scale-100'}`} 
            />
            <div className="absolute left-20 bg-black text-white px-3 py-1.5 rounded-lg text-sm font-black italic whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-xl border border-white/10 uppercase tracking-tighter">
              {server.name}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 border-l border-b border-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Server Button */}
      <div 
        onClick={() => { playSound('blip'); onAddServer(); }}
        className="group relative flex items-center justify-center w-12 h-12 bg-[#1e1135] rounded-xl hover:rounded-lg hover:bg-[#00ffff] transition-all duration-300 cursor-pointer text-[#00ffff] hover:text-black mt-1 shrink-0 border border-[#00ffff]/20 magnetic-btn"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        <div className="absolute left-20 bg-black text-white px-3 py-1.5 rounded-lg text-sm font-black italic whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-xl border border-white/10 uppercase tracking-tighter">
          Sunucu Ekle
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 border-l border-b border-white/10" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
