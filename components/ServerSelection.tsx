
import React from 'react';
import { User } from '../types';

interface ServerSelectionProps {
  user: User;
  onSelectServer: (serverId: string) => void;
  onLogout: () => void;
}

const MOCK_SERVERS = [
  { id: 's1', name: 'Destek', desc: 'Topluyo resmi istek & destek', members: 3, icon: 'https://picsum.photos/seed/destek/200/200', color: 'bg-pink-600' },
  { id: 's2', name: 'ilerliyo programı (Topluyo)', desc: 'Yayıncılar birleşin!', members: 3, icon: 'https://picsum.photos/seed/prog/200/200', color: 'bg-gray-800' },
  { id: 's3', name: 'senkopist', desc: 'Ben SENKOPİST, eğlence...', members: 3, icon: 'https://picsum.photos/seed/senk/200/200', color: 'bg-black' },
  { id: 's4', name: 'Ekip', desc: 'Topluyo Ekibi', members: 1, icon: 'https://picsum.photos/seed/team/200/200', color: 'bg-red-900' },
  { id: 's5', name: 'EfeErdoğan', desc: 'Yazıyı okuyarak takip etti...', members: 2, icon: 'https://picsum.photos/seed/efe/200/200', color: 'bg-yellow-500' },
  { id: 's6', name: 'ANITKABİR', desc: 'Ey Türk gençliği! Birinci v...', members: 2, icon: 'https://picsum.photos/seed/ata/200/200', color: 'bg-blue-900' },
  { id: 's7', name: 'Topluyo Futbol', desc: 'Topluyo Futbol Teknik Di...', members: 2, icon: 'https://picsum.photos/seed/ball/200/200', color: 'bg-purple-800' },
  { id: 's8', name: 'PUBG: BATTLEGROUNDS', desc: 'Savaşçıların buluşma noktası', members: 2, icon: 'https://picsum.photos/seed/pubg/200/200', color: 'bg-orange-900' },
  { id: 's9', name: 'Quantum RolePlay', desc: 'Fivem Oyun Sunucusu', members: 2, icon: 'https://picsum.photos/seed/quantum/200/200', color: 'bg-fuchsia-900' },
  { id: 's10', name: 'ASABİYİZ', desc: 'KICK KANALIMIZIN TOPL...', members: 2, icon: 'https://picsum.photos/seed/kick/200/200', color: 'bg-orange-600' },
  { id: 's11', name: 'NOSLAND', desc: 'NOSLAND - Türkçe Dubl...', members: 2, icon: 'https://picsum.photos/seed/nos/200/200', color: 'bg-cyan-500' },
  { id: 's12', name: 'TFT', desc: 'Gelin beraber oynayalım =)', members: 2, icon: 'https://picsum.photos/seed/tft/200/200', color: 'bg-yellow-700' },
  { id: 's13', name: 'Kris Topluluğu', desc: 'Yeniden Şahlanış', members: 1, icon: 'https://picsum.photos/seed/kris/200/200', color: 'bg-black' },
  { id: 's14', name: 'Valorant', desc: 'Valorant yayıncı ve agent...', members: 1, icon: 'https://picsum.photos/seed/val/200/200', color: 'bg-red-500' },
  { id: 's15', name: 'ZedaxYT', desc: 'we ❤️ topluyo', members: 1, icon: 'https://picsum.photos/seed/zed/200/200', color: 'bg-gray-700' },
  { id: 's16', name: 'Uykusuz Kütüphane', desc: 'Online Ders Çalışma Plat...', members: 1, icon: 'https://picsum.photos/seed/lib/200/200', color: 'bg-white' },
];

const ServerSelection: React.FC<ServerSelectionProps> = ({ user, onSelectServer, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#05010a] text-white flex flex-col p-8 overflow-y-auto no-scrollbar selection:bg-pink-500">
      {/* Header */}
      <header className="flex items-center justify-between mb-12 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#ff00ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.4)] transform -rotate-3">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <span className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#ff00ff]">Topluyo</span>
        </div>

        <div className="flex items-center gap-6 bg-black/40 p-2 pr-6 rounded-2xl border border-white/5">
           <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-[#ff00ff]/20 shadow-xl" alt="Profile" />
           <div className="flex flex-col">
              <span className="font-black text-white italic text-sm">{user.displayName || user.username}</span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">@{user.username}</span>
           </div>
           <button onClick={onLogout} className="text-white/10 hover:text-red-500 transition-colors ml-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           </button>
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_SERVERS.map(server => (
              <div 
                key={server.id}
                onClick={() => onSelectServer(server.id)}
                className="group flex items-start gap-4 bg-white/[0.03] border border-white/5 p-5 rounded-2xl cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all hover:scale-[1.02] shadow-xl relative overflow-hidden"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-20 h-20 shrink-0 ${server.color} rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/5 shadow-lg group-hover:shadow-[#ff00ff]/10 transition-shadow`}>
                   <img src={server.icon} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-black text-white mb-1 uppercase italic tracking-tighter truncate group-hover:text-[#ff00ff] transition-colors">{server.name}</h3>
                  <p className="text-[10px] text-white/40 font-bold mb-3 line-clamp-1 opacity-80">{server.desc}</p>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{server.members} Çevrimiçi</span>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Footer Tools */}
      <footer className="mt-12 py-8 border-t border-white/5 flex items-center justify-between text-white/10 font-black text-[9px] uppercase tracking-[0.4em]">
         <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">YENİ SUNUCU KUR</span>
            <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">SUNUCU KEŞFET</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex gap-4">
               <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg></button>
            </div>
            <span>v2.5.0-ALPHA // PROTOCOL_TOPLUYO</span>
         </div>
      </footer>
    </div>
  );
};

export default ServerSelection;
