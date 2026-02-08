
import React, { useState } from 'react';

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  image: string;
  interests: string[];
}

const MOCK_PROFILES: MatchProfile[] = [
  { id: 'p1', name: 'Melis', age: 22, bio: 'Oyun ve kahve tutkunu. Topluyo HQ favorim.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', interests: ['Gaming', 'LoL', 'Cyberpunk'] },
  { id: 'p2', name: 'Can', age: 24, bio: 'Kod yazmayı ve gece yürüyüşlerini severim.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop', interests: ['Coding', 'Hardstyle', 'Anime'] },
  { id: 'p3', name: 'Selge', age: 21, bio: 'Siber ağların kraliçesi. Beni bulamazsın.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop', interests: ['Hacking', 'Neon', 'Techno'] },
  { id: 'p4', name: 'Bora', age: 26, bio: 'E-spor oyuncusu. Rekabet ruhumda var.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', interests: ['Valorant', 'CS2', 'Gym'] },
  { id: 'p5', name: 'Elif', age: 23, bio: 'NFT sanatçısı ve dijital göçebe.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop', interests: ['Art', 'NFT', 'Travel'] },
];

const MatchArea: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matches, setMatches] = useState<MatchProfile[]>([]);

  const playMatchSound = (type: 'like' | 'dislike') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'like') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      } else {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      }
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const profile = MOCK_PROFILES[currentIndex];

  const handleAction = (type: 'like' | 'dislike') => {
    playMatchSound(type);
    
    if (type === 'like' && Math.random() > 0.5) {
      setMatches(prev => [...prev, profile]);
      setShowMatch(true);
      setTimeout(() => setShowMatch(false), 2000);
    }
    
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(-1); // Liste bitti
    }
  };

  if (currentIndex === -1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0314] p-8 text-center">
        <div className="text-8xl mb-6">🏜️</div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">PROTOKOL SONU</h2>
        <p className="mt-4 text-white/40 font-bold uppercase tracking-widest">Çevrendeki tüm siber varlıkları taradın.</p>
        <button 
          onClick={() => setCurrentIndex(0)} 
          className="mt-8 bg-[#ff00ff] text-white px-8 py-3 font-black uppercase italic tracking-tighter shadow-2xl hover:scale-105 transition-all"
        >
          YENİDEN TARA
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent animate-shiny" />
      
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none animate-shiny">Eşleştiriyo</h2>
          <p className="text-[10px] font-black text-[#00ffff] uppercase tracking-[0.4em]">SİBER_AŞK_ALGORİTMASI v1.0</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/10">
          <span className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest">EŞLEŞMELER: {matches.length}</span>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {showMatch && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
            <h1 className="text-8xl font-[1000] text-[#ff00ff] uppercase italic tracking-tighter animate-bounce drop-shadow-[0_0_20px_rgba(255,0,255,1)]">EŞLEŞTİN!</h1>
            <p className="text-white font-black uppercase tracking-[0.5em] mt-4">BAĞLANTI_KURULUYOR...</p>
          </div>
        )}

        <div className="relative w-full max-w-md aspect-[3/4] group reveal-item">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff00ff]/20 to-[#00ffff]/20 blur-3xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative h-full w-full bg-[#110524] border-4 border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <img src={profile.image} className="flex-1 w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={profile.name} />
            
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-end gap-3 mb-2">
                <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none">{profile.name}</h3>
                <span className="text-xl font-black text-[#00ffff] mb-1">{profile.age}</span>
              </div>
              <p className="text-sm text-white/60 font-medium italic mb-4 line-clamp-2">{profile.bio}</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(interest => (
                  <span key={interest} className="text-[9px] font-black uppercase bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1 border border-[#ff00ff]/20 tracking-widest">
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="h-32 bg-[#05010a] border-t-4 border-[#ff00ff]/10 flex items-center justify-center gap-12 relative px-8 shrink-0">
        <button 
          onClick={() => handleAction('dislike')}
          className="magnetic-btn w-20 h-20 rounded-full border-4 border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-white transition-all shadow-2xl"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={() => handleAction('like')}
          className="magnetic-btn w-24 h-24 rounded-full border-4 border-[#ff00ff]/30 bg-[#ff00ff]/10 flex items-center justify-center text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white hover:border-white transition-all shadow-[0_0_30px_rgba(255,0,255,0.3)] animate-pulse"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MatchArea;
