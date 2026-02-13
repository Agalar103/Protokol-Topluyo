
import React, { useState, useEffect, useMemo } from 'react';
import { Member, User } from '../types';

interface MatchProfile {
  id: string;
  name: string;
  gender: 'erkek' | 'kadın';
  age: number;
  bio: string;
  image: string;
  interests: string[];
  currentlyListening: string;
  currentlyWatching: string;
}

const MOCK_PROFILES: MatchProfile[] = [
  { id: 'p1', name: 'Melis', gender: 'kadın', age: 22, bio: 'Oyun ve kahve tutkunu. Topluyo HQ favorim.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600', interests: ['Gaming', 'LoL'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p2', name: 'Can', gender: 'erkek', age: 24, bio: 'Kod yazmayı ve gece yürüyüşlerini severim.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600', interests: ['Coding', 'Anime'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Cyberpunk Edgerunners' },
  { id: 'p3', name: 'Selge', gender: 'kadın', age: 21, bio: 'Siber ağların kraliçesi. Beni bulamazsın.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600', interests: ['Hacking', 'Neon'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
  { id: 'p4', name: 'Bora', gender: 'erkek', age: 26, bio: 'E-spor oyuncusu. Rekabet ruhumda var.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600', interests: ['Valorant', 'CS2', 'Gym'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p5', name: 'Elif', gender: 'kadın', age: 23, bio: 'NFT sanatçısı ve dijital göçebe.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600', interests: ['Art', 'NFT'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Ghost in the Shell' },
  { id: 'p6', name: 'Kerem', gender: 'erkek', age: 25, bio: 'Hardstyle ve yüksek tempo.', image: 'https://picsum.photos/seed/kerem/600/800', interests: ['Techno', 'Driving'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Interstellar' },
  { id: 'p7', name: 'Deniz', gender: 'kadın', age: 20, bio: 'Lo-fi beats to chill/study to.', image: 'https://picsum.photos/seed/deniz/600/800', interests: ['Reading', 'Piano'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Cyberpunk Edgerunners' },
  { id: 'p8', name: 'Arda', gender: 'erkek', age: 22, bio: 'Sadece eğlenmek için buradayım.', image: 'https://picsum.photos/seed/arda/600/800', interests: ['Football', 'Pizza'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
  { id: 'p9', name: 'Merve', gender: 'kadın', age: 24, bio: 'Psikoloji ve yapay zeka.', image: 'https://picsum.photos/seed/merve/600/800', interests: ['AI', 'Jazz'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p10', name: 'Pelin', gender: 'kadın', age: 26, bio: 'Kedi annesi ve illüstratör.', image: 'https://picsum.photos/seed/pelin/600/800', interests: ['Cats', 'Drawing'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p11', name: 'Mert', gender: 'erkek', age: 23, bio: 'Gitar çalmayı severim.', image: 'https://picsum.photos/seed/mert/600/800', interests: ['Rock', 'Travel'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Interstellar' },
  { id: 'p12', name: 'Su', gender: 'kadın', age: 21, bio: 'Yakamoz tutkunu.', image: 'https://picsum.photos/seed/su/600/800', interests: ['Sea', 'Night'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Ghost in the Shell' },
  { id: 'p13', name: 'Ege', gender: 'erkek', age: 27, bio: 'Teknoloji yazarı.', image: 'https://picsum.photos/seed/ege/600/800', interests: ['Tech', 'Gadgets'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p14', name: 'Ayşe', gender: 'kadın', age: 25, bio: 'Yemek yapmayı severim.', image: 'https://picsum.photos/seed/ayse/600/800', interests: ['Cooking', 'Vlog'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p15', name: 'Burak', gender: 'erkek', age: 24, bio: 'Siber güvenlik öğrencisi.', image: 'https://picsum.photos/seed/burak/600/800', interests: ['Hacking', 'Linux'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
  { id: 'p16', name: 'Zeynep', gender: 'kadın', age: 22, bio: 'Sinema aşığı.', image: 'https://picsum.photos/seed/zeynep/600/800', interests: ['Cinema', 'Coffee'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p17', name: 'Kaan', gender: 'erkek', age: 26, bio: 'Crossfit ve sağlıklı yaşam.', image: 'https://picsum.photos/seed/kaan/600/800', interests: ['Sports', 'Paleo'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Interstellar' },
  { id: 'p18', name: 'Derya', gender: 'kadın', age: 23, bio: 'Doğa fotoğrafçısı.', image: 'https://picsum.photos/seed/derya/600/800', interests: ['Nature', 'Canon'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Ghost in the Shell' },
  { id: 'p19', name: 'Ozan', gender: 'erkek', age: 25, bio: 'DJ ve prodüktör.', image: 'https://picsum.photos/seed/ozan/600/800', interests: ['Music', 'Ableton'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p20', name: 'Irmak', gender: 'kadın', age: 21, bio: 'Astroloji ve kristaller.', image: 'https://picsum.photos/seed/irmak/600/800', interests: ['Stars', 'Yoga'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
  { id: 'p21', name: 'Yiğit', gender: 'erkek', age: 24, bio: 'Motosiklet tutkunu.', image: 'https://picsum.photos/seed/yigit/600/800', interests: ['Bikes', 'Road'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Cyberpunk Edgerunners' },
  { id: 'p22', name: 'Beren', gender: 'kadın', age: 22, bio: 'Tiyatro oyuncusu.', image: 'https://picsum.photos/seed/beren/600/800', interests: ['Acting', 'Stage'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p23', name: 'Tolga', gender: 'erkek', age: 28, bio: 'Yazılım mimarı.', image: 'https://picsum.photos/seed/tolga/600/800', interests: ['DevOps', 'Go'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Interstellar' },
  { id: 'p24', name: 'Simge', gender: 'kadın', age: 24, bio: 'Vintage giyim.', image: 'https://picsum.photos/seed/simge/600/800', interests: ['Fashion', 'Oldies'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
  { id: 'p25', name: 'Emir', gender: 'erkek', age: 22, bio: 'Startup kurucusu.', image: 'https://picsum.photos/seed/emir/600/800', interests: ['Business', 'AI'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p26', name: 'Naz', gender: 'kadın', age: 20, bio: 'Modellik yapıyorum.', image: 'https://picsum.photos/seed/naz/600/800', interests: ['Style', 'Travel'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Ghost in the Shell' },
  { id: 'p27', name: 'Volkan', gender: 'erkek', age: 30, bio: 'Yatırım ve borsa.', image: 'https://picsum.photos/seed/volkan/600/800', interests: ['Stock', 'Crypto'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049' },
  { id: 'p28', name: 'Derin', gender: 'kadın', age: 23, bio: 'Deniz biyoloğu.', image: 'https://picsum.photos/seed/derin/600/800', interests: ['Oceans', 'Diving'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Interstellar' },
  { id: 'p29', name: 'Serkan', gender: 'erkek', age: 27, bio: 'Koleksiyoncu.', image: 'https://picsum.photos/seed/serkan/600/800', interests: ['Cards', 'Vinyl'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane' },
  { id: 'p30', name: 'Azra', gender: 'kadın', age: 21, bio: 'Diksiyon eğitmeni.', image: 'https://picsum.photos/seed/azra/600/800', interests: ['Speech', 'Voice'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix' },
];

interface MatchAreaProps {
  userMusic?: { title: string } | null;
  onStartChat: (member: Member | User) => void;
}

const MatchArea: React.FC<MatchAreaProps> = ({ userMusic, onStartChat }) => {
  const [genderFilter, setGenderFilter] = useState<'hepsi' | 'erkek' | 'kadın'>('hepsi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MatchProfile | null>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [recentMatches, setRecentMatches] = useState<MatchProfile[]>([]);
  
  const [simMusic, setSimMusic] = useState('Daft Punk - Veridis Quo');
  const [simMovie, setSimMovie] = useState('Blade Runner 2049');

  const filteredProfiles = useMemo(() => {
    return genderFilter === 'hepsi' 
      ? MOCK_PROFILES 
      : MOCK_PROFILES.filter(p => p.gender === genderFilter);
  }, [genderFilter]);

  const profile = filteredProfiles[currentIndex] || null;

  const playMatchSound = (type: 'like' | 'dislike' | 'match' | 'chat') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      if (type === 'match') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      } else if (type === 'like' || type === 'chat') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      } else {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      }
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + (type === 'match' ? 0.3 : 0.1));
    } catch (e) {}
  };

  const handleAction = (type: 'like' | 'dislike') => {
    if (showMatch || !profile) return;

    if (type === 'like') {
      const currentMusicTitle = userMusic?.title || simMusic;
      const musicMatches = profile.currentlyListening.toLowerCase().includes(currentMusicTitle.toLowerCase()) || currentMusicTitle.toLowerCase().includes(profile.currentlyListening.toLowerCase());
      const movieMatches = profile.currentlyWatching.toLowerCase() === simMovie.toLowerCase();

      // DEBUG: console.log(`Comparing: ${profile.currentlyListening} with ${currentMusicTitle}`);
      // DEBUG: console.log(`Comparing: ${profile.currentlyWatching} with ${simMovie}`);

      if (musicMatches && movieMatches) {
        playMatchSound('match');
        setMatchedProfile(profile);
        setShowMatch(true);
        setMatchesCount(prev => prev + 1);
        if (!recentMatches.find(m => m.id === profile.id)) {
            setRecentMatches(prev => [profile, ...prev].slice(0, 8));
        }
        return;
      }
      playMatchSound('like');
    } else {
      playMatchSound('dislike');
    }
    
    goToNext();
  };

  const goToNext = () => {
    setShowMatch(false);
    setMatchedProfile(null);
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(-1); 
    }
  };

  const startChatWith = (p: MatchProfile | Member | User) => {
    playMatchSound('chat');
    onStartChat({
      id: p.id,
      username: (p as any).name || (p as any).username,
      avatar: (p as any).image || (p as any).avatar,
      status: 'online',
      roleId: 'r3'
    } as Member);
  };

  if (currentIndex === -1 || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0314] p-8 text-center">
        <div className="text-8xl mb-6">🏜️</div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">PROTOKOL SONU</h2>
        <p className="mt-4 text-white/40 font-bold uppercase tracking-widest">Seçtiğin filtrede başka siber varlık kalmadı.</p>
        <button 
          onClick={() => { setCurrentIndex(0); setGenderFilter('hepsi'); }} 
          className="mt-8 bg-[#ff00ff] text-white px-8 py-3 font-black uppercase italic tracking-tighter shadow-2xl hover:scale-105 transition-all"
        >
          TÜMÜNÜ TARA
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent animate-shiny" />
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20 z-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none animate-shiny">Eşleştiriyo</h2>
          <p className="text-[8px] font-black text-[#00ffff] uppercase tracking-[0.4em]">SYNC_SIGNAL_V3.2 // MÜZİK + FİLM</p>
        </div>
        <div className="bg-white/5 px-4 py-1.5 border border-white/10 rounded-lg">
          <span className="text-[9px] font-black text-[#ff00ff] uppercase tracking-widest">EŞLEŞMELER: {matchesCount}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: FILTERS & SIGNAL SETTINGS */}
        <aside className="w-64 border-r border-white/5 bg-[#05010a]/50 p-6 space-y-8 overflow-y-auto no-scrollbar hidden lg:block">
           <div className="space-y-4">
              <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] border-l-2 border-[#ff00ff] pl-3">Hedef Filtre</h3>
              <div className="grid grid-cols-1 gap-2">
                 {(['hepsi', 'erkek', 'kadın'] as const).map(g => (
                   <button 
                     key={g}
                     onClick={() => { setGenderFilter(g); setCurrentIndex(0); }}
                     className={`w-full py-2.5 px-4 text-left text-[9px] font-black uppercase italic transition-all border-2 ${genderFilter === g ? 'bg-[#ff00ff] border-[#ff00ff] text-white' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
                   >
                     {g === 'hepsi' ? '🌍 TÜMÜ' : g === 'erkek' ? '♂️ ERKEK' : '♀️ KADIN'}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] border-l-2 border-[#00ffff] pl-3">Senin Sinyalin</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[7px] font-black text-[#00ffff] uppercase tracking-widest">Müzik Frekansı</p>
                  <select value={simMusic} onChange={e => setSimMusic(e.target.value)} className="w-full bg-[#110524] border border-white/10 text-white text-[9px] font-black uppercase p-2.5 outline-none focus:border-[#00ffff]">
                     <option>Daft Punk - Veridis Quo</option>
                     <option>The Weeknd - Blinding Lights</option>
                     <option>Kavinsky - Nightcall</option>
                     <option>Imagine Dragons - Enemy</option>
                     <option>Lorn - Acid Rain</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] font-black text-[#ff00ff] uppercase tracking-widest">Görsel Veri (Film)</p>
                  <select value={simMovie} onChange={e => setSimMovie(e.target.value)} className="w-full bg-[#110524] border border-white/10 text-white text-[9px] font-black uppercase p-2.5 outline-none focus:border-[#ff00ff]">
                     <option>Blade Runner 2049</option>
                     <option>Cyberpunk Edgerunners</option>
                     <option>The Matrix</option>
                     <option>Arcane</option>
                     <option>Interstellar</option>
                     <option>Ghost in the Shell</option>
                  </select>
                </div>
              </div>
           </div>

           <div className="p-4 bg-[#ff00ff]/5 border border-[#ff00ff]/10 rounded-xl">
              <p className="text-[8px] text-[#ff00ff]/60 font-bold uppercase leading-relaxed italic">Eşleşmek için aynı müzik ve film sinyaline sahip birini beğenmelisin!</p>
           </div>
        </aside>

        {/* CENTER AREA: MAIN CARD & ACTIONS */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
          {showMatch && matchedProfile && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in zoom-in duration-500 p-8 text-center">
              <h1 className="text-6xl md:text-8xl font-[1000] text-[#ff00ff] uppercase italic tracking-tighter animate-bounce drop-shadow-[0_0_30px_rgba(255,0,255,0.8)]">SİBER EŞLEŞME!</h1>
              <div className="mt-8 flex items-center gap-12 relative">
                 <div className="w-40 h-40 rounded-full border-4 border-[#00ffff] overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.4)]">
                    <img src={matchedProfile.image} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="text-5xl text-white font-black animate-pulse">⚡</div>
                 <div className="w-40 h-40 rounded-full border-4 border-[#ff00ff] overflow-hidden shadow-[0_0_40px_rgba(255,0,255,0.4)]">
                    <img src="https://picsum.photos/seed/currentuser/200/200" className="w-full h-full object-cover" alt="You" />
                 </div>
              </div>
              <div className="mt-12 bg-white/5 border border-white/10 p-8 rounded-[30px] max-w-xl space-y-4">
                 <p className="text-white font-black uppercase tracking-[0.3em] italic">Aynı siber frekanstasınız!</p>
                 <div className="flex justify-center gap-6">
                   <div className="text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase mb-1">MÜZİK</p>
                      <p className="text-[#00ffff] font-[1000] text-xs uppercase italic">🎵 {matchedProfile.currentlyListening}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[8px] font-black text-white/40 uppercase mb-1">FİLM</p>
                      <p className="text-[#ff00ff] font-[1000] text-xs uppercase italic">🎬 {matchedProfile.currentlyWatching}</p>
                   </div>
                 </div>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                 <button onClick={() => startChatWith(matchedProfile)} className="flex-1 bg-[#ff00ff] text-white py-6 rounded-2xl font-[1000] uppercase italic tracking-tighter text-2xl shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:scale-105 transition-all">SOHBETİ BAŞLAT</button>
                 <button onClick={() => { playMatchSound('like'); goToNext(); }} className="flex-1 bg-white/5 border-2 border-white/20 text-white py-6 rounded-2xl font-[1000] uppercase italic tracking-tighter text-2xl hover:bg-white/10 transition-all">GEÇ</button>
              </div>
            </div>
          )}

          <div className="relative w-full max-w-sm aspect-[3/4] group reveal-item mb-8">
            <div className="absolute -inset-6 bg-gradient-to-tr from-[#ff00ff]/20 to-[#00ffff]/20 blur-[60px] rounded-[50px] opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full w-full bg-[#110524] border-8 border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
              <div className="relative flex-1 overflow-hidden">
                 <img src={profile.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={profile.name} />
                 <div className="absolute top-6 left-6 right-6 space-y-3">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                       <div className="w-8 h-8 bg-[#ff00ff] rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                       </div>
                       <div className="min-w-0">
                          <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">DİNLİYOR</p>
                          <p className="text-[9px] font-black text-[#00ffff] uppercase truncate italic">{profile.currentlyListening}</p>
                       </div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                       <div className="w-8 h-8 bg-[#00ffff] rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
                       </div>
                       <div className="min-w-0">
                          <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">İZLİYOR</p>
                          <p className="text-[9px] font-black text-[#ff00ff] uppercase truncate italic">{profile.currentlyWatching}</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-gradient-to-t from-[#05010a] via-[#05010a]/90 to-transparent shrink-0">
                <div className="flex items-end gap-3 mb-2">
                  <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-none">{profile.name}</h3>
                  <span className="text-lg font-black text-[#00ffff] mb-0.5">{profile.age}</span>
                </div>
                <p className="text-xs text-white/60 font-medium italic mb-6 line-clamp-2">{profile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span key={interest} className="text-[8px] font-black uppercase bg-white/5 text-white/40 px-2 py-1 border border-white/5 tracking-widest rounded-full">#{interest.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN ACTIONS - MOVED AND STYLED FOR VISIBILITY */}
          <div className="flex items-center gap-12 shrink-0 z-20">
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleAction('dislike')} 
                className="w-20 h-20 rounded-full border-4 border-white/5 bg-black/60 flex items-center justify-center text-red-500/40 hover:bg-red-600/20 hover:text-red-500 hover:border-red-500/50 transition-all shadow-2xl active:scale-90 group"
              >
                <svg className="w-10 h-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">GEÇ_❌</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleAction('like')} 
                className="w-24 h-24 rounded-full border-4 border-[#ff00ff]/30 bg-[#ff00ff]/5 flex items-center justify-center text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white hover:border-white transition-all shadow-[0_0_40px_rgba(255,0,255,0.2)] animate-pulse active:scale-90 group"
              >
                <svg className="w-12 h-12 group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <span className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.4em] italic animate-pulse">BEĞEN_💖</span>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: STATS & RECENT MATCHES */}
        <aside className="w-64 border-l border-white/5 bg-[#05010a]/50 p-6 space-y-8 overflow-y-auto no-scrollbar hidden xl:block">
           <div className="space-y-4">
              <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] border-r-2 border-[#00ffff] pr-3 text-right">Eşleşme Verisi</h3>
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center shadow-inner">
                 <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Toplam Eşleşme</p>
                 <p className="text-4xl font-[1000] text-white italic tracking-tighter animate-shiny">{matchesCount}</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between border-r-2 border-[#ff00ff] pr-3">
                 <span className="text-white/10 text-[8px] font-black uppercase">V3.2</span>
                 <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] text-right">Son Sinyaller</h3>
              </div>
              <div className="space-y-3">
                 {recentMatches.length === 0 ? (
                   <div className="py-8 text-center opacity-20 italic text-[9px] uppercase font-black">Sinyal bekleniyor...</div>
                 ) : (
                   recentMatches.map((m) => (
                     <div key={m.id} className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5 rounded-xl hover:border-[#ff00ff]/30 transition-all group relative overflow-hidden">
                        <img src={m.image} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                        <div className="min-w-0 flex-1">
                           <p className="text-[10px] font-black text-white uppercase italic truncate">{m.name}</p>
                           <p className="text-[8px] font-bold text-[#00ffff]/60 uppercase truncate italic">MATCHED!</p>
                        </div>
                        {/* CHAT BUTTON IN SIDEBAR */}
                        <button 
                          onClick={() => startChatWith(m)}
                          className="p-2 bg-[#ff00ff]/10 text-[#ff00ff] rounded-lg hover:bg-[#ff00ff] hover:text-white transition-all shadow-lg"
                          title="Hızlı Sohbet"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="pt-6 space-y-4">
              <div className="flex flex-col items-center gap-2 opacity-20">
                 <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ffff] animate-[data-stream_2s_linear_infinite]" />
                 </div>
                 <p className="text-[7px] font-black uppercase tracking-[0.4em]">SYNC_READY</p>
              </div>
           </div>
        </aside>
      </div>

      <style>{`
        @keyframes data-stream {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MatchArea;
