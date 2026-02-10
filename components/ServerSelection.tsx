
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface ServerSelectionProps {
  user: User;
  onSelectServer: (serverId: string) => void;
  onLogout: () => void;
}

const MOCK_SERVERS = [
  { id: 's1', name: 'ELRAENN - LİMAN', desc: 'Çaylar hazır, gıybet başlıyor.', members: 4235, icon: 'https://picsum.photos/seed/elraenn/200/200' },
  { id: 's2', name: 'JAHREİN - LORD HUB', desc: 'Drama ve siyaset terminali.', members: 3120, icon: 'https://picsum.photos/seed/jaho/200/200' },
  { id: 's3', name: 'wtcN - FERİTİN MEKANI', desc: 'Valorant ve gurme vuruşlar.', members: 2850, icon: 'https://picsum.photos/seed/wtcn/200/200' },
  { id: 's4', name: 'PQUEEN - SARAY', desc: 'Dans ve eğlence odası.', members: 1950, icon: 'https://picsum.photos/seed/pqueen/200/200' },
  { id: 's5', name: 'UNLOST - LOSTEK', desc: 'FPS artırma ve çekilişler.', members: 5400, icon: 'https://picsum.photos/seed/unlost/200/200' },
  { id: 's6', name: 'KENDİNE MÜZİSYEN', desc: 'Rakunlar burada toplanıyor.', members: 2100, icon: 'https://picsum.photos/seed/kemal/200/200' },
  { id: 's7', name: 'BARIŞ ÖZCAN', desc: 'Gelecek Tasarımı Merkezi.', members: 8900, icon: 'https://picsum.photos/seed/baris/200/200' },
  { id: 's8', name: 'ANITKABİR', desc: 'Ey Türk gençliği! Birinci v...', members: 1938, icon: 'https://picsum.photos/seed/ata/200/200' },
  { id: 's9', name: 'VALORANT TR', desc: 'Agent seçim terminali.', members: 12400, icon: 'https://picsum.photos/seed/valo/200/200' },
  { id: 's10', name: 'METİN2 TURKEY', desc: 'Dolunay kılıcı +9 takas.', members: 6700, icon: 'https://picsum.photos/seed/metin2/200/200' },
  { id: 's11', name: 'CYBERPUNK 2077', desc: 'Night City sızıntıları.', members: 4300, icon: 'https://picsum.photos/seed/cp2077/200/200' },
  { id: 's12', name: 'KNIGHT ONLINE', desc: 'Eziklere yer yok, PK zamanı.', members: 5200, icon: 'https://picsum.photos/seed/ko/200/200' },
  { id: 's13', name: 'NOSLAND', desc: 'NOSLAND - Türkçe Dublaj...', members: 320, icon: 'https://picsum.photos/seed/nos/200/200' },
  { id: 's14', name: 'TFT STRATEJİ', desc: 'Altın ekonomi taktikleri.', members: 1100, icon: 'https://picsum.photos/seed/tft/200/200' },
  { id: 's15', name: 'UYKUSUZ KÜTÜPHANE', desc: 'Gece çalışanlar kulübü.', members: 450, icon: 'https://picsum.photos/seed/lib/200/200' },
  { id: 's16', name: 'YAZILIMCI GENÇLİK', desc: 'Stackoverflow hata çözümleri.', members: 8600, icon: 'https://picsum.photos/seed/code/200/200' },
  { id: 's17', name: 'KICK TURKEY', desc: 'Yeşil devrim başlıyor.', members: 1500, icon: 'https://picsum.photos/seed/kick/200/200' },
  { id: 's18', name: 'CS2 GLOBAL', desc: 'Rush B don\'t stop.', members: 9300, icon: 'https://picsum.photos/seed/cs2/200/200' },
  { id: 's19', name: 'MINECRAFT TR', desc: 'Survival ve Skyblock.', members: 7200, icon: 'https://picsum.photos/seed/mc/200/200' },
  { id: 's20', name: 'ANİME EVRENİ', desc: 'Yeni sezon sızıntıları.', members: 4800, icon: 'https://picsum.photos/seed/anime/200/200' },
];

const OTHER_STREAMERS = [
  { name: 'Hype', icon: 'https://picsum.photos/seed/hype/100/100', status: 'online' },
  { name: 'Mithrain', icon: 'https://picsum.photos/seed/mith/100/100', status: 'offline' },
  { name: 'Levo', icon: 'https://picsum.photos/seed/levo/100/100', status: 'online' },
  { name: 'Tenz', icon: 'https://picsum.photos/seed/tenz/100/100', status: 'online' },
  { name: 'Shroud', icon: 'https://picsum.photos/seed/shroud/100/100', status: 'idle' },
  { name: 'Asmongold', icon: 'https://picsum.photos/seed/asmon/100/100', status: 'online' },
];

const ServerSelection: React.FC<ServerSelectionProps> = ({ user, onSelectServer, onLogout }) => {
  const [zoomingServerId, setZoomingServerId] = useState<string | null>(null);
  const [isExitingSystem, setIsExitingSystem] = useState(false);
  const [isEnteringFromHub, setIsEnteringFromHub] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEnteringFromHub(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (id: string) => {
    if (zoomingServerId || isExitingSystem) return;
    setZoomingServerId(id);
    setTimeout(() => {
      onSelectServer(id);
    }, 700);
  };

  const handleLogoutWithAnimation = () => {
    if (isExitingSystem || zoomingServerId) return;
    setIsExitingSystem(true);
    setTimeout(() => {
      onLogout();
    }, 800);
  };

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={`h-full bg-[#05010a] text-white flex flex-col p-8 overflow-y-auto selection:bg-[#ff00ff] relative custom-scrollbar scroll-smooth transition-all duration-700
        ${isEnteringFromHub ? 'animate-[initial-zoom-out_0.8s_ease-out_forwards]' : ''}
        ${isExitingSystem ? 'animate-[system-exit-zoom_0.8s_ease-in_forwards] pointer-events-none' : ''}`}
    >
      <div className="fixed inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
      
      {/* Header */}
      <header className={`flex items-center justify-between mb-8 shrink-0 max-w-[1400px] mx-auto w-full z-10 transition-all duration-300 ${zoomingServerId || isExitingSystem ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}>
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#ff00ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.6)] transform -rotate-3">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <span className="text-3xl font-[1000] uppercase italic tracking-tighter text-[#ff00ff] drop-shadow-[0_0_10px_rgba(255,0,255,0.3)]">TOPLUYO</span>
        </div>

        <div className="flex items-center gap-4 bg-black/60 p-1.5 pr-6 rounded-2xl border-4 border-white/5 backdrop-blur-md group hover:border-[#ff00ff]/20 transition-all cursor-pointer">
           <div className="relative">
              <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-white/10 shadow-xl group-hover:scale-105 transition-transform" alt="Profile" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
           </div>
           <div className="flex flex-col">
              <span className="font-[1000] text-white italic text-base uppercase tracking-tighter">{user.displayName || user.username}</span>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">@{user.username}</span>
           </div>
           <button onClick={handleLogoutWithAnimation} className="text-white/10 hover:text-red-500 transition-all ml-4 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           </button>
        </div>
      </header>

      {/* Grid Layout - Updated Ads (Mavi Alanlar) */}
      <div className={`max-w-[1400px] mx-auto w-full z-10 transition-all duration-500 mb-12 flex gap-6 ${zoomingServerId || isExitingSystem ? 'blur-md pointer-events-none opacity-0' : 'opacity-100'}`}>
        
        {/* Ad Billboard 1 (Topluyo Mobile Promo) */}
        <div className="w-1/5 bg-gradient-to-br from-[#ff00ff]/10 to-indigo-950 border-4 border-[#ff00ff]/30 rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400')] bg-cover opacity-20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <span className="text-[9px] font-black text-[#ff00ff] uppercase tracking-[0.4em] italic mb-2">TOPLUYO_MOBILE</span>
            <p className="text-[11px] font-[1000] text-white uppercase italic leading-tight">YENİ NESİL <br /> MOBİL TERMİNAL</p>
          </div>
          <div className="absolute bottom-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
        </div>

        {/* Kick Stream Preview */}
        <div className="flex-1 bg-red-600/5 border-4 border-red-600/20 rounded-3xl overflow-hidden relative group shadow-[0_0_50px_rgba(220,38,38,0.1)]">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors z-10">
             <a 
               href="https://kick.com/asi103" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-red-600 text-white px-10 py-4 font-[1000] uppercase italic tracking-tighter text-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 transition-all"
             >
               ASI103 YAYININI İZLE
             </a>
          </div>
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Kick Stream" />
          <div className="absolute top-6 left-6 z-20 bg-red-600 px-3 py-1 rounded text-[10px] font-black text-white uppercase tracking-widest animate-pulse">CANLI // KICK.COM</div>
        </div>

        {/* Ad Billboard 2 (Topluyo Desktop Promo) */}
        <div className="w-1/5 bg-gradient-to-br from-[#00ffff]/10 to-indigo-950 border-4 border-[#00ffff]/30 rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400')] bg-cover opacity-20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <span className="text-[9px] font-black text-[#00ffff] uppercase tracking-[0.4em] italic mb-2">PC_PRO_EXPERIENCE</span>
            <p className="text-[11px] font-[1000] text-white uppercase italic leading-tight">YÜKSEK HIZLI <br /> DESKTOP AĞI</p>
          </div>
          <div className="absolute bottom-0 w-full h-1 bg-[#00ffff] animate-pulse" />
        </div>
      </div>

      {/* Streamers Grid */}
      <div className={`max-w-[1400px] mx-auto w-full z-10 mb-12 ${zoomingServerId || isExitingSystem ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-[#53fc18]/5 border-4 border-[#53fc18]/20 p-8 rounded-3xl overflow-hidden relative">
          <h2 className="text-xs font-[1000] text-[#53fc18] uppercase italic tracking-[0.5em] mb-8">DİĞER_YAYINCILAR_NODE</h2>
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
            {OTHER_STREAMERS.map((streamer, i) => (
              <div key={i} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl border-4 p-1 transition-all group-hover:scale-110 ${streamer.status === 'online' ? 'border-[#53fc18] shadow-[0_0_15px_rgba(83,252,24,0.3)]' : 'border-white/10 opacity-40'}`}>
                  <img src={streamer.icon} className="w-full h-full object-cover rounded-xl" alt={streamer.name} />
                </div>
                <span className={`text-[10px] font-black uppercase italic tracking-widest ${streamer.status === 'online' ? 'text-white' : 'text-white/20'}`}>{streamer.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Servers Grid */}
      <div className={`max-w-[1400px] mx-auto w-full z-10 transition-all duration-500 ${zoomingServerId || isExitingSystem ? 'blur-md pointer-events-none' : ''}`}>
        <div className="bg-orange-600/5 border-4 border-orange-600/20 p-10 rounded-3xl">
          <h2 className="text-xs font-[1000] text-orange-600 uppercase italic tracking-[0.5em] mb-10">SİBER_SUNUCULAR_AĞI</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_SERVERS.map((server, idx) => (
                <div 
                  key={server.id}
                  onClick={() => handleSelect(server.id)}
                  className={`group flex items-center gap-5 bg-white/[0.03] border-4 border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/[0.07] hover:border-orange-600/20 shadow-2xl relative overflow-hidden transition-all duration-500 ease-out
                    ${zoomingServerId === server.id ? 'z-[2000] scale-[5] opacity-0 blur-3xl pointer-events-none' : (zoomingServerId || isExitingSystem ? 'opacity-0 scale-90 blur-sm' : 'hover:scale-[1.03]')}`}
                >
                  <div className="relative w-20 h-20 shrink-0 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-xl">
                     <img src={server.icon} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-110" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h3 className="text-lg font-[1000] text-white mb-1 uppercase italic tracking-tighter truncate group-hover:text-orange-600 transition-colors">{server.name}</h3>
                    <p className="text-[10px] text-white/30 font-black mb-3 line-clamp-1 uppercase tracking-tight italic">{server.desc}</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">{server.members} ÇEVRİMİÇİ</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Floating Scroll Controls */}
      {!zoomingServerId && !isExitingSystem && (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 animate-in slide-in-from-right-8">
           <button onClick={() => scrollByAmount(-400)} className="w-14 h-14 bg-black/80 border-2 border-[#00ffff] text-[#00ffff] flex items-center justify-center hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" /></svg></button>
           <button onClick={() => scrollByAmount(400)} className="w-14 h-14 bg-black/80 border-2 border-[#ff00ff] text-[#ff00ff] flex items-center justify-center hover:bg-[#ff00ff] hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,255,0.3)] active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg></button>
        </div>
      )}

      {/* Entry Transition Overlays */}
      {zoomingServerId && (
        <div className="fixed inset-0 z-[3000] pointer-events-none bg-black animate-[fade-in-quick_0.5s_forwards] flex items-center justify-center">
           <div className="w-20 h-20 border-4 border-[#ff00ff] animate-[initial-zoom-in_0.7s_ease-in_forwards]" />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 10px; }
        
        @keyframes initial-zoom-out {
          0% { transform: scale(1.05); filter: blur(20px); opacity: 0; }
          100% { transform: scale(1); filter: blur(0); opacity: 1; }
        }

        @keyframes initial-zoom-in {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(100); opacity: 0; }
        }

        @keyframes system-exit-zoom {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0; filter: blur(20px); }
        }

        @keyframes fade-in-quick {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ServerSelection;
