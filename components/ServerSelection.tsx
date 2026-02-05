
import React from 'react';
import { User } from '../types';

interface ServerSelectionProps {
  user: User;
  onSelectServer: (serverId: string) => void;
  onLogout: () => void;
}

const MOCK_SERVERS = [
  { id: 's1', name: 'Destek', desc: 'Topluyo resmi istek & destek', members: 3, icon: 'https://picsum.photos/seed/destek/200/200', color: 'bg-pink-600' },
  { id: 's2', name: 'ilerliyo programı', desc: 'Yayıncılar birleşin!', members: 3, icon: 'https://picsum.photos/seed/progress/200/200', color: 'bg-gray-800' },
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
];

const ServerSelection: React.FC<ServerSelectionProps> = ({ user, onSelectServer, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#05010a] text-white flex flex-col p-8 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#ff00ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.4)]">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <span className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#ff00ff]">Topluyo</span>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="font-black text-white italic">{user.displayName || user.username}</span>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">@{user.username}</span>
           </div>
           <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-[#ff00ff]/20 shadow-xl" alt="Profile" />
           <button onClick={onLogout} className="text-white/20 hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           </button>
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_SERVERS.map(server => (
              <div 
                key={server.id}
                onClick={() => onSelectServer(server.id)}
                className="group relative bg-white/[0.02] border-2 border-white/5 p-6 rounded-3xl cursor-pointer hover:bg-white/[0.05] hover:border-[#ff00ff]/30 transition-all hover:-translate-y-2 shadow-2xl"
              >
                <div className={`w-16 h-16 ${server.color} rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-xl border-2 border-white/10 group-hover:scale-110 transition-transform`}>
                   <img src={server.icon} className="w-full h-full object-cover" alt="" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">{server.name}</h3>
                <p className="text-xs text-white/40 font-bold mb-6 line-clamp-2 h-8">{server.desc}</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{server.members} Çevrimiçi</span>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-6 h-6 text-[#ff00ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Footer Tools */}
      <footer className="mt-12 py-8 border-t border-white/5 flex items-center justify-between text-white/10 font-black text-[10px] uppercase tracking-[0.5em]">
         <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors">YENİ SUNUCU KUR</span>
            <span className="hover:text-white cursor-pointer transition-colors">KEŞFET</span>
         </div>
         <div className="flex items-center gap-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
            <span>v2.5.0-ALPHA</span>
         </div>
      </footer>
    </div>
  );
};

export default ServerSelection;
