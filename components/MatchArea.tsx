
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
  hobby: string;
}

const MOCK_PROFILES: MatchProfile[] = [
  { id: 'p1', name: 'Melis', gender: 'kadın', age: 22, bio: 'Oyun ve kahve tutkunu. Topluyo HQ favorim.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600', interests: ['Gaming', 'LoL'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049', hobby: 'E-Spor' },
  { id: 'p2', name: 'Can', gender: 'erkek', age: 24, bio: 'Kod yazmayı ve gece yürüyüşlerini severim.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600', interests: ['Coding', 'Anime'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Cyberpunk Edgerunners', hobby: 'Yazılım' },
  { id: 'p3', name: 'Selge', gender: 'kadın', age: 21, bio: 'Siber ağların kraliçesi. Beni bulamazsın.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600', interests: ['Hacking', 'Neon'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix', hobby: 'Siber Güvenlik' },
  { id: 'p4', name: 'Bora', gender: 'erkek', age: 26, bio: 'E-spor oyuncusu. Rekabet ruhumda var.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600', interests: ['Valorant', 'CS2', 'Gym'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane', hobby: 'Fitness' },
  { id: 'p5', name: 'Elif', gender: 'kadın', age: 23, bio: 'NFT sanatçısı ve dijital göçebe.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600', interests: ['Art', 'NFT'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Ghost in the Shell', hobby: 'Dijital Sanat' },
  { id: 'p6', name: 'Kerem', gender: 'erkek', age: 25, bio: 'Hardstyle ve yüksek tempo.', image: 'https://picsum.photos/seed/kerem/600/800', interests: ['Techno', 'Driving'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Interstellar', hobby: 'Hız Tutkusu' },
  { id: 'p7', name: 'Deniz', gender: 'kadın', age: 20, bio: 'Lo-fi beats to chill/study to.', image: 'https://picsum.photos/seed/deniz/600/800', interests: ['Reading', 'Piano'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Cyberpunk Edgerunners', hobby: 'Kitaplar' },
  { id: 'p8', name: 'Arda', gender: 'erkek', age: 22, bio: 'Sadece eğlenmek için buradayım.', image: 'https://picsum.photos/seed/arda/600/800', interests: ['Football', 'Pizza'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix', hobby: 'Futbol' },
  { id: 'p9', name: 'Merve', gender: 'kadın', age: 24, bio: 'Psikoloji ve yapay zeka.', image: 'https://picsum.photos/seed/merve/600/800', interests: ['AI', 'Jazz'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049', hobby: 'Yapay Zeka' },
  { id: 'p10', name: 'Pelin', gender: 'kadın', age: 26, bio: 'Kedi annesi ve illüstratör.', image: 'https://picsum.photos/seed/pelin/600/800', interests: ['Cats', 'Drawing'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane', hobby: 'Çizim' },
  { id: 'p11', name: 'Mert', gender: 'erkek', age: 23, bio: 'Gitar çalmayı severim.', image: 'https://picsum.photos/seed/mert/600/800', interests: ['Rock', 'Travel'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Interstellar', hobby: 'Müzik Prodüksiyonu' },
  { id: 'p12', name: 'Su', gender: 'kadın', age: 21, bio: 'Yakamoz tutkunu.', image: 'https://picsum.photos/seed/su/600/800', interests: ['Sea', 'Night'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Ghost in the Shell', hobby: 'Fotoğrafçılık' },
  { id: 'p13', name: 'Ege', gender: 'erkek', age: 27, bio: 'Teknoloji yazarı.', image: 'https://picsum.photos/seed/ege/600/800', interests: ['Tech', 'Gadgets'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049', hobby: 'Gadget İnceleme' },
  { id: 'p14', name: 'Ayşe', gender: 'kadın', age: 25, bio: 'Yemek yapmayı severim.', image: 'https://picsum.photos/seed/ayse/600/800', interests: ['Cooking', 'Vlog'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane', hobby: 'Gastronomi' },
  { id: 'p15', name: 'Burak', gender: 'erkek', age: 24, bio: 'Siber güvenlik öğrencisi.', image: 'https://picsum.photos/seed/burak/600/800', interests: ['Hacking', 'Linux'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix', hobby: 'Linux' },
  { id: 'p16', name: 'Zeynep', gender: 'kadın', age: 22, bio: 'Sinema aşığı.', image: 'https://picsum.photos/seed/zeynep/600/800', interests: ['Cinema', 'Coffee'], currentlyListening: 'Daft Punk - Veridis Quo', currentlyWatching: 'Blade Runner 2049', hobby: 'Sinema' },
  { id: 'p17', name: 'Kaan', gender: 'erkek', age: 26, bio: 'Crossfit ve sağlıklı yaşam.', image: 'https://picsum.photos/seed/kaan/600/800', interests: ['Sports', 'Paleo'], currentlyListening: 'The Weeknd - Blinding Lights', currentlyWatching: 'Interstellar', hobby: 'Crossfit' },
  { id: 'p18', name: 'Derya', gender: 'kadın', age: 23, bio: 'Doğa fotoğrafçısı.', image: 'https://picsum.photos/seed/derya/600/800', interests: ['Nature', 'Canon'], currentlyListening: 'Lorn - Acid Rain', currentlyWatching: 'Ghost in the Shell', hobby: 'Dağcılık' },
  { id: 'p19', name: 'Ozan', gender: 'erkek', age: 25, bio: 'DJ ve prodüktör.', image: 'https://picsum.photos/seed/ozan/600/800', interests: ['Music', 'Ableton'], currentlyListening: 'Imagine Dragons - Enemy', currentlyWatching: 'Arcane', hobby: 'Ses Mühendisliği' },
  { id: 'p20', name: 'Irmak', gender: 'kadın', age: 21, bio: 'Astroloji ve kristaller.', image: 'https://picsum.photos/seed/irmak/600/800', interests: ['Stars', 'Yoga'], currentlyListening: 'Kavinsky - Nightcall', currentlyWatching: 'The Matrix', hobby: 'Yoga' },
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
  const [isSwiping, setIsSwiping] = useState<'like' | 'dislike' | null>(null);
  
  const [simMusic, setSimMusic] = useState('Daft Punk - Veridis Quo');
  const [simMovie, setSimMovie] = useState('Blade Runner 2049');
  const [simHobby, setSimHobby] = useState('E-Spor');

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
        oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      } else if (type === 'like' || type === 'chat') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      }
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + (type === 'match' ? 0.4 : 0.1));
    } catch (e) {}
  };

  const handleAction = (type: 'like' | 'dislike') => {
    if (showMatch || !profile || isSwiping) return;

    setIsSwiping(type);
    
    setTimeout(() => {
      if (type === 'like') {
        const currentMusicTitle = userMusic?.title || simMusic;
        const musicMatches = profile.currentlyListening.toLowerCase().includes(currentMusicTitle.toLowerCase()) || currentMusicTitle.toLowerCase().includes(profile.currentlyListening.toLowerCase());
        const movieMatches = profile.currentlyWatching.toLowerCase() === simMovie.toLowerCase();
        const hobbyMatches = profile.hobby.toLowerCase() === simHobby.toLowerCase();

        if (musicMatches && movieMatches && hobbyMatches) {
          playMatchSound('match');
          setMatchedProfile(profile);
          setShowMatch(true);
          setMatchesCount(prev => prev + 1);
          if (!recentMatches.find(m => m.id === profile.id)) {
              setRecentMatches(prev => [profile, ...prev].slice(0, 10));
          }
          setIsSwiping(null);
          return;
        }
        playMatchSound('like');
      } else {
        playMatchSound('dislike');
      }
      
      goToNext();
      setIsSwiping(null);
    }, 400);
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d0d] p-12 text-center font-mono">
        <div className="text-[120px] mb-8 leading-none opacity-20 rotate-12">BOŞ</div>
        <h2 className="text-6xl font-black text-[#ffcc00] uppercase italic tracking-tighter transform -skew-x-12 mb-4">DESTE TAMAMLANDI</h2>
        <p className="mt-4 text-white/40 font-bold uppercase tracking-[0.4em] max-w-md">SEÇİLEN FİLTREDE KULLANILACAK KART KALMADI.</p>
        <button 
          onClick={() => { setCurrentIndex(0); setGenderFilter('hepsi'); }} 
          className="mt-12 bg-white text-black px-12 py-5 font-black uppercase italic tracking-tighter text-2xl hover:bg-[#ff0066] hover:text-white transition-all transform -skew-x-12 shadow-[8px_8px_0_#ff0066] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          DESTEYİ YENİLE
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden relative font-sans selection:bg-[#ff0066] selection:text-white">
      {/* Arka Plan Grafiği */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center overflow-hidden">
         <h1 className="text-[30vw] font-black text-white/5 uppercase italic tracking-tighter transform -skew-x-12 scale-150 rotate-[-15deg]">FRAGPUNK</h1>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0d0d0d_70%)]" />
      </div>

      {/* Üst Bilgi Çubuğu */}
      <div className="h-24 px-8 flex items-center justify-between shrink-0 relative z-20 bg-gradient-to-r from-[#ff0066] via-[#0d0d0d] to-[#00ffcc]/20 border-b-4 border-black">
         <div className="flex flex-col">
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none transform -skew-x-12">
               EŞLEŞTİRİYO <span className="text-black bg-white px-2 ml-2 not-italic">v3.3</span>
            </h2>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] mt-1">KART_SAVAŞI // SİNYAL_SENKRON_PROTOKOLÜ</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="bg-black text-white border-2 border-white px-4 py-2 font-black italic transform -skew-x-12 shadow-[4px_4px_0_#ff0066]">
               SENKRON_SAYISI: {matchesCount}
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SOL PANEL: AYARLAR */}
        <aside className="w-80 p-8 space-y-12 border-r-4 border-black bg-[#1a1a1a] shrink-0 hidden lg:block relative z-10 overflow-y-auto no-scrollbar">
           <div className="space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] bg-[#ff0066] inline-block px-3 py-1 transform -skew-x-12">HEDEF_FİLTRE</h3>
              <div className="flex flex-col gap-3">
                 {(['hepsi', 'erkek', 'kadın'] as const).map(g => (
                   <button 
                     key={g}
                     onClick={() => { setGenderFilter(g); setCurrentIndex(0); }}
                     className={`w-full py-4 px-6 text-left text-xl font-black uppercase italic transition-all transform -skew-x-12 border-4 ${genderFilter === g ? 'bg-white border-white text-black translate-x-2' : 'bg-transparent border-white/10 text-white/30 hover:border-white/40 hover:text-white'}`}
                   >
                     {g === 'hepsi' ? 'TÜM_MODLAR' : g === 'erkek' ? 'ERKEK_OPERATÖR' : 'KADIN_OPERATÖR'}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] bg-[#00ffcc] text-black inline-block px-3 py-1 transform -skew-x-12">SENİN_AVANTAJLARIN</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#00ffcc] uppercase tracking-widest">AKTİF_SES_SİNYALİ</p>
                  <select value={simMusic} onChange={e => setSimMusic(e.target.value)} className="w-full bg-black border-2 border-white/20 text-white text-sm font-black uppercase p-3 outline-none focus:border-[#00ffcc] transform -skew-x-6">
                     <option>Daft Punk - Veridis Quo</option>
                     <option>The Weeknd - Blinding Lights</option>
                     <option>Kavinsky - Nightcall</option>
                     <option>Imagine Dragons - Enemy</option>
                     <option>Lorn - Acid Rain</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[#ff0066] uppercase tracking-widest">GÖRSEL_GİRİŞ (FİLM)</p>
                  <select value={simMovie} onChange={e => setSimMovie(e.target.value)} className="w-full bg-black border-2 border-white/20 text-white text-sm font-black uppercase p-3 outline-none focus:border-[#ff0066] transform -skew-x-6">
                     <option>Blade Runner 2049</option>
                     <option>Cyberpunk Edgerunners</option>
                     <option>The Matrix</option>
                     <option>Arcane</option>
                     <option>Interstellar</option>
                     <option>Ghost in the Shell</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">HOBİ_FREKANSI</p>
                  <select value={simHobby} onChange={e => setSimHobby(e.target.value)} className="w-full bg-black border-2 border-white/20 text-white text-sm font-black uppercase p-3 outline-none focus:border-yellow-400 transform -skew-x-6">
                     <option>E-Spor</option>
                     <option>Yazılım</option>
                     <option>Siber Güvenlik</option>
                     <option>Fitness</option>
                     <option>Dijital Sanat</option>
                     <option>Hız Tutkusu</option>
                     <option>Fotoğrafçılık</option>
                     <option>Yoga</option>
                  </select>
                </div>
              </div>
           </div>

           <div className="p-4 border-2 border-white/10 bg-black/40 font-black text-[10px] uppercase text-white/30 leading-relaxed italic">
              *SENKRONİZASYON ŞARTI: OPERATÖRLER STABİL BİR BAĞLANTI İÇİN AYNI SES, GÖRSEL VE HOBİ SİNYALLERİ PAYLAŞMALIDIR.
           </div>
        </aside>

        {/* MERKEZ: KART SAVAŞI */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Başarılı Eşleşme Katmanı */}
          {showMatch && matchedProfile && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#ff0066] p-8 text-center animate-in fade-in duration-300">
              <div className="absolute inset-0 opacity-20 overflow-hidden">
                 {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="absolute text-9xl font-black text-white/20 whitespace-nowrap animate-pulse" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)` }}>SENKRON</div>
                 ))}
              </div>
              
              <h1 className="text-9xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter animate-bounce leading-none drop-shadow-[15px_15px_0_#000] z-10">SENKRON!</h1>
              
              <div className="mt-8 flex items-center gap-4 relative z-10">
                 <div className="w-48 h-64 bg-black p-2 transform -rotate-6 border-4 border-white shadow-2xl">
                    <img src={matchedProfile.image} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="text-7xl text-white font-black animate-pulse shadow-black drop-shadow-lg">⚡</div>
                 <div className="w-48 h-64 bg-black p-2 transform rotate-6 border-4 border-white shadow-2xl">
                    <img src="https://picsum.photos/seed/currentuser/400/600" className="w-full h-full object-cover" alt="Sen" />
                 </div>
              </div>

              <div className="mt-8 bg-black/40 p-6 border-2 border-white/20 transform -skew-x-12 z-10">
                <p className="text-[#00ffcc] font-black uppercase italic text-xl">Hobi Eşleşmesi: {matchedProfile.hobby}</p>
              </div>

              <div className="mt-12 flex flex-col gap-6 w-full max-w-xl z-10">
                 <button onClick={() => startChatWith(matchedProfile)} className="bg-white text-black py-6 font-black uppercase italic tracking-tighter text-4xl transform -skew-x-12 shadow-[12px_12px_0_#000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">İLETİŞİM_KUR</button>
                 <button onClick={() => { playMatchSound('like'); goToNext(); }} className="bg-black text-white py-4 font-black uppercase italic tracking-tighter text-xl transform -skew-x-12 border-4 border-white hover:bg-white hover:text-black transition-all">KARTI_AT</button>
              </div>
            </div>
          )}

          {/* Ana Kart */}
          <div 
            className={`relative w-full max-w-lg aspect-[3/4.5] group transition-all duration-500 ease-out transform
              ${isSwiping === 'like' ? 'translate-x-[200%] rotate-45 opacity-0' : ''}
              ${isSwiping === 'dislike' ? '-translate-x-[200%] -rotate-45 opacity-0' : ''}
            `}
          >
            {/* Kart Gölgeleri/Glow */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#ff0066]/30 to-[#00ffcc]/30 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Kart Kabı */}
            <div className="relative h-full w-full bg-white border-[12px] border-black overflow-hidden flex flex-col shadow-[20px_20px_0_rgba(0,0,0,0.5)]">
              {/* Başlık Bilgisi */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-black z-10 flex items-center px-6 justify-between">
                 <div className="flex flex-col">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none transform -skew-x-12">{profile.name}</h3>
                    <span className="text-xs font-black text-[#ffcc00] uppercase tracking-widest mt-1">SEVİYE_{profile.age} // {profile.gender.toUpperCase()}</span>
                 </div>
                 <div className="w-12 h-12 bg-[#ff0066] flex items-center justify-center font-black text-2xl text-white transform rotate-45">
                    <span className="transform -rotate-45">!</span>
                 </div>
              </div>

              {/* Portre */}
              <div className="relative flex-1 bg-zinc-800">
                 <img src={profile.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt="" />
                 
                 {/* Kart Etiketleri */}
                 <div className="absolute bottom-4 left-4 right-4 space-y-3 z-20">
                    <div className="bg-black p-3 border-l-8 border-[#00ffcc] transform -skew-x-12 shadow-lg">
                       <div className="flex items-center gap-3">
                          <div className="text-[#00ffcc]">
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                          </div>
                          <div className="min-w-0">
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">AKTİF_SES_SİNYALİ</p>
                             <p className="text-sm font-black text-white uppercase truncate italic">{profile.currentlyListening}</p>
                          </div>
                       </div>
                    </div>
                    <div className="bg-black p-3 border-l-8 border-yellow-400 transform -skew-x-12 shadow-lg">
                       <div className="flex items-center gap-3">
                          <div className="text-yellow-400 font-black text-xl italic leading-none">★</div>
                          <div className="min-w-0">
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">SİBER_HOBİ_DATA</p>
                             <p className="text-sm font-black text-white uppercase truncate italic">{profile.hobby}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Kart Alt Bilgisi */}
              <div className="h-48 bg-black p-6 border-t-8 border-white flex flex-col justify-between">
                 <p className="text-sm font-bold text-white/60 italic uppercase leading-tight line-clamp-2">"{profile.bio}"</p>
                 <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                      <span key={interest} className="bg-white text-black px-3 py-1 font-black text-[10px] uppercase italic tracking-tighter transform -skew-x-12">#{interest}</span>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* ANA BUTONLAR */}
          <div className="mt-12 flex items-center gap-12 z-20">
             <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => handleAction('dislike')} 
                  className="w-28 h-28 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-[#ff0066] hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-[10px_10px_0_#ff0066] hover:shadow-none"
                >
                   <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={5}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <span className="text-xs font-black text-white uppercase italic tracking-[0.3em]">PAS_GEÇ</span>
             </div>

             <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => handleAction('like')} 
                  className="w-36 h-36 bg-[#ff0066] border-4 border-black flex items-center justify-center text-white hover:bg-white hover:text-[#ff0066] transition-all transform hover:scale-110 active:scale-95 shadow-[15px_15px_0_#000] animate-float"
                >
                   <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                <span className="text-base font-black text-[#ff0066] uppercase italic tracking-[0.5em] animate-pulse">SENKRONU_BAŞLAT</span>
             </div>
          </div>
        </main>

        {/* SAĞ PANEL: İSTATİSTİKLER VE LİSTE */}
        <aside className="w-80 p-8 space-y-10 border-l-4 border-black bg-[#1a1a1a] shrink-0 hidden xl:block relative z-10 overflow-y-auto no-scrollbar">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] bg-white text-black inline-block px-3 py-1 transform -skew-x-12">OTURUM_VERİLERİ</h3>
              <div className="bg-black border-4 border-white p-6 transform -skew-x-6 shadow-[8px_8px_0_#ff0066]">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">STABİL_BAĞLANTILAR</p>
                 <p className="text-7xl font-black text-white italic tracking-tighter leading-none">{matchesCount}</p>
              </div>
           </div>

           <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] bg-[#ffcc00] text-black inline-block px-3 py-1 transform -skew-x-12">SON_SENKRONLAR</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
                 {recentMatches.length === 0 ? (
                   <div className="py-20 text-center opacity-20 italic text-xl font-black uppercase transform -rotate-12">SİNYAL_YOK</div>
                 ) : (
                   recentMatches.map((m) => (
                     <div key={m.id} className="bg-black border-2 border-white/10 p-3 flex items-center gap-4 group hover:border-[#ff0066] transition-all transform hover:translate-x-2">
                        <div className="w-14 h-14 shrink-0 bg-white p-0.5">
                           <img src={m.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-lg font-black text-white uppercase italic truncate leading-none">{m.name}</p>
                           <p className="text-[8px] font-black text-[#00ffcc] uppercase tracking-widest mt-1">OPERASYONEL</p>
                        </div>
                        <button 
                          onClick={() => startChatWith(m)}
                          className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-[#ff0066] hover:text-white transition-all transform rotate-45"
                        >
                          <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="pt-8 opacity-20 font-black italic text-[10px] tracking-[0.4em] text-center">
              SENKRON_AKTİF // FRAGPUNK_STİLİ
           </div>
        </aside>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MatchArea;
