
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
  const renderIcon = (icon: string) => {
    const isImage = icon.startsWith('http') || icon.startsWith('data:image');
    if (isImage) {
      return <img src={icon} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Server Icon" />;
    }
    return <span className="text-white font-black text-sm uppercase italic group-hover:scale-110 transition-transform">{icon}</span>;
  };

  return (
    <div className="w-[72px] bg-[#0f051a] flex flex-col items-center py-3 gap-2 overflow-y-auto overflow-x-hidden no-scrollbar shrink-0 h-full border-r border-white/5 select-none">
      {/* Sentinel Security Indicator */}
      <div className="mb-2 flex flex-col items-center gap-1 group cursor-help">
         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
         <div className="text-[6px] font-black text-white/20 uppercase tracking-tighter">99.9%</div>
         <div className="absolute left-20 bg-black text-white px-3 py-1.5 rounded-lg text-[8px] font-black italic whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[1000] border border-green-500/20">
            SENTINEL_SHIELD: AKTİF <br /> STABİLİTE: KRİTİK_OLMAYAN
         </div>
      </div>

      <div 
        onClick={() => onBackToHub?.()}
        className="group relative flex items-center justify-center w-12 h-12 bg-[#ff00ff] rounded-xl hover:rounded-lg transition-all duration-300 cursor-pointer text-white shadow-[0_0_15px_rgba(255,0,255,0.3)] shrink-0"
      >
        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute left-0 w-1 h-2 bg-white rounded-r-full hidden group-hover:block" />
      </div>

      <div className="w-8 h-[2px] bg-white/10 rounded-full my-1 shrink-0" />

      <div className="flex-1 flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar overflow-x-hidden">
        {servers.map(server => (
          <div 
            key={server.id} 
            onClick={() => onServerSelect(server)}
            className={`group relative flex items-center justify-center w-12 h-12 transition-all duration-300 cursor-pointer shrink-0 overflow-hidden
              ${activeServerId === server.id 
                ? 'bg-[#ff00ff] rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.4)]' 
                : 'bg-[#1e1135] rounded-xl hover:rounded-lg hover:bg-[#ff00ff]/80 shadow-md'}`}
          >
            {renderIcon(server.icon)}
            <div className={`absolute left-[-4px] w-2 bg-white rounded-r-full transition-all duration-500 
              ${activeServerId === server.id ? 'h-10 scale-100' : 'h-2 scale-0 group-hover:scale-100'}`} 
            />
          </div>
        ))}
      </div>

      <div 
        onClick={() => onAddServer()}
        className="group relative flex items-center justify-center w-12 h-12 bg-[#1e1135] rounded-xl hover:rounded-lg hover:bg-[#00ffff] transition-all duration-300 cursor-pointer text-[#00ffff] hover:text-black mt-1 shrink-0 border border-[#00ffff]/20"
      >
        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      </div>
    </div>
  );
};

export default Sidebar;
