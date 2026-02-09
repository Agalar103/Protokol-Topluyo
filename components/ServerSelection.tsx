
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
  { id: 's21', name: 'HYPE ZONE', desc: 'Çağdaş ve ekibi burada.', members: 2100, icon: 'https://picsum.photos/seed/hype/200/200' },
  { id: 's22', name: 'MITHRAIN - MİTH', desc: 'Battle Royale profesörü.', members: 1800, icon: 'https://picsum.photos/seed/mith/200/200' },
  { id: 's23', name: 'TENZ - PRO VALO', desc: 'Aim god training.', members: 4500, icon: 'https://picsum.photos/seed/tenz/200/200' },
  { id: 's24', name: 'SHROUD HUB', desc: 'Insane aim clips.', members: 6700, icon: 'https://picsum.photos/seed/shroud/200/200' },
  { id: 's25', name: 'PINTIPANDA', desc: 'Yavrularım hoşgeldiniz.', members: 2400, icon: 'https://picsum.photos/seed/panda/200/200' },
  { id: 's26', name: 'BITCOIN MINING', desc: 'Satoshi\'nin izindeyiz.', members: 12000, icon: 'https://picsum.photos/seed/btc/200/200' },
  { id: 's27', name: 'AI RESEARCH', desc: 'LLM ve Stable Diffusion.', members: 3400, icon: 'https://picsum.photos/seed/ai/200/200' },
  { id: 's28', name: 'GRAPHIC DESIGN', desc: 'Figma ve Photoshop.', members: 5600, icon: 'https://picsum.photos/seed/design/200/200' },
  { id: 's29', name: '3D MODELLING', desc: 'Blender ve Unreal Engine.', members: 2900, icon: 'https://picsum.photos/seed/3d/200/200' },
  { id: 's30', name: 'SOLANA GANG', desc: 'Degens for life.', members: 7800, icon: 'https://picsum.photos/seed/sol/200/200' },
  { id: 's31', name: 'NFT MARKET', desc: 'Bored Ape sızıntıları.', members: 1500, icon: 'https://picsum.photos/seed/nft/200/200' },
  { id: 's32', name: 'NETFLIX PARTY', desc: 'Sinema gecesi terminali.', members: 4100, icon: 'https://picsum.photos/seed/movie/200/200' },
  { id: 's33', name: 'BOOK CLUB', desc: 'Dijital kütüphane.', members: 890, icon: 'https://picsum.photos/seed/books/200/200' },
  { id: 's34', name: 'MUSIC PRODUCTION', desc: 'FL Studio ve Ableton.', members: 2300, icon: 'https://picsum.photos/seed/music/200/200' },
  { id: 's35', name: 'BEAT MAKERS', desc: 'Type beat satış.', members: 1400, icon: 'https://picsum.photos/seed/beats/200/200' },
  { id: 's36', name: 'PHOTOGRAPHY', desc: 'Raw dosya paylaşımı.', members: 3200, icon: 'https://picsum.photos/seed/photo/200/200' },
  { id: 's37', name: 'TRAVELERS', desc: 'Dijital göçebeler.', members: 1200, icon: 'https://picsum.photos/seed/travel/200/200' },
  { id: 's38', name: 'COOKING MASTER', desc: 'Siber mutfak tarifleri.', members: 950, icon: 'https://picsum.photos/seed/food/200/200' },
  { id: 's39', name: 'FITNESS LIFE', desc: 'Zyzz mirası devam ediyor.', members: 5600, icon: 'https://picsum.photos/seed/gym/200/200' },
  { id: 's40', name: 'CAR GUYS', desc: 'JDM ve Euro Tuning.', members: 4300, icon: 'https://picsum.photos/seed/cars/200/200' },
  { id: 's41', name: 'MOTORCYCLE HUB', desc: 'İki teker siber yaşam.', members: 2100, icon: 'https://picsum.photos/seed/moto/200/200' },
  { id: 's42', name: 'SPACE EXPLORATION', desc: 'Mars kolonisi sızıntıları.', members: 8900, icon: 'https://picsum.photos/seed/space/200/200' },
  { id: 's43', name: 'SCIENCE DAILY', desc: 'Kuantum fiziği sohbetleri.', members: 3400, icon: 'https://picsum.photos/seed/science/200/200' },
  { id: 's44', name: 'HISTORY HUB', desc: 'Yapay zeka ile tarih.', members: 1200, icon: 'https://picsum.photos/seed/history/200/200' },
  { id: 's45', name: 'PHILOSOPHY DEEP', desc: 'Nietzsche ve siber varlık.', members: 780, icon: 'https://picsum.photos/seed/phi/200/200' },
  { id: 's46', name: 'ZEDAXYT', desc: 'we ❤️ topluyo', members: 15, icon: 'https://picsum.photos/seed/zed/200/200' },
  { id: 's47', name: 'GMOD FUN', desc: 'Prop hunt ve sandbox.', members: 1100, icon: 'https://picsum.photos/seed/gmod/200/200' },
  { id: 's48', name: 'AMONG US TR', desc: 'Impostor kim?', members: 4500, icon: 'https://picsum.photos/seed/among/200/200' },
  { id: 's49', name: 'DISCORD TURKEY', desc: 'Discord sızıntı kanalı.', members: 89000, icon: 'https://picsum.photos/seed/dis/200/200' },
  { id: 's50', name: 'TOPLUYO HQ', desc: 'Ana terminal katmanı.', members: 1, icon: 'https://picsum.photos/seed/top/200/200' },
];

const ServerSelection: React.FC<ServerSelectionProps> = ({ user, onSelectServer, onLogout }) => {
  const [zoomingServerId, setZoomingServerId] = useState<string | null>(null);
  const [isExitingSystem, setIsExitingSystem] = useState(false);
  const [isEnteringFromHub, setIsEnteringFromHub] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde (hub'dan dönerken) zoom-out efekti uygula
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
      <header className={`flex items-center justify-between mb-16 shrink-0 max-w-[1400px] mx-auto w-full z-10 transition-all duration-300 ${zoomingServerId || isExitingSystem ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}>
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

      {/* Main Grid */}
      <div className={`flex-1 max-w-[1400px] mx-auto w-full z-10 transition-all duration-500 ${zoomingServerId || isExitingSystem ? 'blur-md pointer-events-none' : ''}`}>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {MOCK_SERVERS.map((server, idx) => (
              <div 
                key={server.id}
                onClick={() => handleSelect(server.id)}
                className={`group flex items-center gap-5 bg-white/[0.03] border-4 border-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/[0.07] hover:border-[#ff00ff]/20 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-all duration-700 ease-in-out
                  ${zoomingServerId === server.id ? 'z-[100] scale-[15] opacity-0 blur-xl' : (zoomingServerId || isExitingSystem ? 'opacity-0 scale-90' : 'hover:scale-[1.03]')}`}
                style={{ animationDelay: `${idx * 0.02}s` }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-10 bg-[#ff00ff]/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative w-20 h-20 shrink-0 bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-xl">
                   <img src={server.icon} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-110" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                
                <div className="flex-1 min-w-0 z-10">
                  <h3 className="text-lg font-[1000] text-white mb-1 uppercase italic tracking-tighter truncate group-hover:text-[#ff00ff] transition-colors">{server.name}</h3>
                  <p className="text-[10px] text-white/30 font-black mb-3 line-clamp-1 uppercase tracking-tight italic">{server.desc}</p>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.6)]" />
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">{server.members} ÇEVRİMİÇİ</span>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Floating Scroll Controls for Broken Mouse */}
      {!zoomingServerId && !isExitingSystem && (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 animate-in slide-in-from-right-8">
           <button 
             onClick={() => scrollByAmount(-400)}
             className="w-14 h-14 bg-black/80 border-2 border-[#00ffff] text-[#00ffff] flex items-center justify-center hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-90"
             title="Yukarı Kaydır"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" /></svg>
           </button>
           <button 
             onClick={() => scrollByAmount(400)}
             className="w-14 h-14 bg-black/80 border-2 border-[#ff00ff] text-[#ff00ff] flex items-center justify-center hover:bg-[#ff00ff] hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,255,0.3)] active:scale-90"
             title="Aşağı Kaydır"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg>
           </button>
        </div>
      )}

      {/* Footer Tools */}
      <footer className={`mt-20 py-10 border-t-4 border-white/5 flex items-center justify-between text-white/10 font-[1000] text-[11px] uppercase tracking-[0.5em] italic max-w-[1400px] mx-auto w-full z-10 transition-opacity duration-300 ${zoomingServerId || isExitingSystem ? 'opacity-0' : 'opacity-100'}`}>
         <div className="flex gap-12">
            <button className="hover:text-white transition-all hover:tracking-[0.6em] group flex items-center gap-3">
               <span className="w-2 h-2 bg-white/10 rounded-full group-hover:bg-[#ff00ff]" />
               YENİ SUNUCU KUR
            </button>
            <button className="hover:text-white transition-all hover:tracking-[0.6em] group flex items-center gap-3">
               <span className="w-2 h-2 bg-white/10 rounded-full group-hover:bg-[#00ffff]" />
               SUNUCU KEŞFET
            </button>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex gap-4">
               <button className="p-2 hover:bg-white/5 rounded-lg transition-colors opacity-30 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
               </button>
            </div>
            <span className="animate-pulse">V2.5.0-ALPHA // PROTOCOL_TOPLUYO</span>
         </div>
      </footer>

      {/* Entry Transition Overlay - Zoom In & Out effect layers */}
      {zoomingServerId && (
        <div className="fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center bg-black animate-in fade-in duration-1000">
           <div className="w-40 h-40 border-4 border-[#ff00ff] rounded-2xl animate-[massive-zoom_0.8s_ease-in_forwards]" />
        </div>
      )}

      {/* Sunucudan çıkıp buraya geri dönünce görünen animasyon */}
      {isEnteringFromHub && (
        <div className="fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center bg-black/60 animate-out fade-out duration-1000">
           <div className="w-full h-full border-[20vw] border-black rounded-full animate-[massive-zoom-out_0.8s_ease-out_forwards]" />
        </div>
      )}

      {/* Logout sırasında uzaklaşma animasyonu */}
      {isExitingSystem && (
        <div className="fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center bg-black animate-in fade-in duration-800">
           <div className="w-10 h-10 border-2 border-white/20 rounded-full animate-[system-exit-dot_0.8s_ease-in_forwards]" />
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
          display: block !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-left: 2px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ff00ff, #00ffff);
          border-radius: 0;
          border: 3px solid #05010a;
          box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00ffff, #ff00ff);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
        }
        
        @keyframes massive-zoom {
          0% { transform: scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(30); opacity: 0; }
        }

        @keyframes massive-zoom-out {
          0% { transform: scale(20); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }

        @keyframes initial-zoom-out {
          0% { transform: scale(1.5); filter: blur(20px); }
          100% { transform: scale(1); filter: blur(0); }
        }

        @keyframes system-exit-zoom {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.1); opacity: 0; filter: blur(10px); }
        }

        @keyframes system-exit-dot {
          0% { transform: scale(1); opacity: 0; }
          100% { transform: scale(50); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ServerSelection;
