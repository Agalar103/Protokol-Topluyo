
import React, { useState, useRef, useEffect } from 'react';
import { User, Member } from '../types';
import Particles from './Particles';

interface ProfileViewProps {
  user: User | Member;
  onUpdateUser?: (user: User) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user as User);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);

  // Helper to crop and resize image via Canvas
  const processImage = (file: File, targetWidth: number, targetHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas error');

          // Center-crop logic
          const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
          const x = (targetWidth - img.width * scale) / 2;
          const y = (targetHeight - img.height * scale) / 2;
          
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner' | 'profileBackground' | 'featuredImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let dimensions = { w: 400, h: 400 };
      if (type === 'banner') dimensions = { w: 1200, h: 400 };
      if (type === 'profileBackground') dimensions = { w: 1920, h: 1080 };
      if (type === 'featuredImage') dimensions = { w: 800, h: 800 };

      const processed = await processImage(file, dimensions.w, dimensions.h);
      setEditedUser(prev => ({ ...prev, [type]: processed }));
    } catch (err) {
      console.error("Image processing failed", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simüle edilmiş havalı bir gecikme (Animasyon için)
    await new Promise(r => setTimeout(r, 1200));

    if (onUpdateUser) {
      onUpdateUser(editedUser);
    }
    
    setIsSaving(false);
    setIsEditing(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Badges data
  const badges = [
    { id: '1year', icon: '📅', label: '1 Yıllık Üye', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'streamer', icon: '📹', label: 'Yayıncı', color: 'bg-purple-500/20 text-purple-400' },
    { id: 'youtube', icon: '▶️', label: 'YouTuber', color: 'bg-red-500/20 text-red-400' },
    { id: 'nitro', icon: '💎', label: 'Nitro', color: 'bg-pink-500/20 text-pink-400' },
  ];

  const top8 = [
    { name: 'SYMBXL', avatar: 'https://picsum.photos/seed/s1/100/100' },
    { name: 'novagloss', avatar: 'https://picsum.photos/seed/s2/100/100' },
    { name: 'LileeKuma', avatar: 'https://picsum.photos/seed/s3/100/100' },
    { name: 'Ciri', avatar: 'https://picsum.photos/seed/s4/100/100' },
    { name: 'puppybat', avatar: 'https://picsum.photos/seed/s5/100/100' },
    { name: 'Kureepy', avatar: 'https://picsum.photos/seed/s6/100/100' },
    { name: 'Samara', avatar: 'https://picsum.photos/seed/s7/100/100' },
    { name: 'sinuuki', avatar: 'https://picsum.photos/seed/s8/100/100' },
  ];

  const userStats = (user as any).stats || { posts: 124, followers: 94, following: 862 };
  const joinDate = "Ağustos 2022";
  const location = "Valorant : Member";
  const link = "instagram.com/topluyo";

  const defaultGames = [
    { name: 'CS:GO', rank: 'Global Elite', rankIcon: 'https://raw.githubusercontent.com/p-f-m/csgo-ranks/master/ranks/rank18.png' },
    { name: 'Valorant', rank: 'Radiant', rankIcon: 'https://static.wikia.nocookie.net/valorant/images/1/13/TX_CompetitiveTier_Large_24.png' },
    { name: 'Warzone', rank: 'Iridescent', rankIcon: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw3/common/ranked-play/ranks/rank-iridescent.png' },
  ];

  const games = user.favoriteGames || defaultGames;

  return (
    <div className={`fixed inset-0 z-[1000] bg-[#050510] text-white overflow-y-auto no-scrollbar animate-in fade-in duration-700 font-serif ${isSaving ? 'animate-[glitch-jitter_0.1s_infinite]' : ''}`}>
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {user.profileBackground ? (
          <img 
            src={isEditing ? editedUser.profileBackground : user.profileBackground} 
            className="w-full h-full object-cover opacity-40 blur-[2px]" 
            alt="bg" 
          />
        ) : (
          <div className="absolute inset-0">
            <Particles
              particleColors={["#ffffff", "#4444ff", "#ff44ff"]}
              particleCount={200}
              particleSpread={15}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>
        )}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
      <input type="file" ref={backgroundInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profileBackground')} />
      <input type="file" ref={featuredInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'featuredImage')} />

      {/* Success Alert */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1100] animate-in zoom-in slide-in-from-top-4 duration-300">
          <div className="bg-blue-900/80 backdrop-blur-xl text-blue-200 px-8 py-3 border border-blue-400/30 shadow-[0_0_50px_rgba(30,58,138,0.5)] flex items-center gap-4 rounded-lg">
            <span className="text-xl">✨</span>
            <span className="font-bold uppercase tracking-widest text-sm">PROFIL GÜNCELLENDİ</span>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-12 min-h-screen flex flex-col gap-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="group flex items-center gap-2 text-white/50 hover:text-white transition-all">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold">Geri Dön</span>
            </button>
            {isEditing && (
              <button 
                onClick={() => backgroundInputRef.current?.click()}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all font-bold"
              >
                Arka Planı Değiştir
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button disabled={isSaving} onClick={() => { setIsEditing(false); setEditedUser(user as User); }} className="px-6 py-2 border border-white/10 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all text-white/40">İptal</button>
                <button disabled={isSaving} onClick={handleSave} className="px-6 py-2 bg-blue-600/80 backdrop-blur-md text-white border border-blue-400/30 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all">
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Profili Düzenle</button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center text-center gap-4">
              <div 
                onClick={() => isEditing && avatarInputRef.current?.click()}
                className={`relative w-40 h-40 rounded-2xl border-2 border-white/20 overflow-hidden group ${isEditing ? 'cursor-pointer' : ''}`}
              >
                <img src={isEditing ? editedUser.avatar : user.avatar} className="w-full h-full object-cover" alt="" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                  </div>
                )}
              </div>

              <div className="space-y-1 w-full">
                {isEditing ? (
                  <input 
                    value={editedUser.displayName || ''} 
                    onChange={e => setEditedUser(p => ({ ...p, displayName: e.target.value }))}
                    className="bg-white/5 border border-white/10 p-2 text-xl font-bold italic text-center w-full outline-none focus:border-blue-400 rounded-lg"
                    placeholder="Görünen İsim"
                  />
                ) : (
                  <h1 className="text-3xl font-bold italic tracking-tight text-blue-100">{user.displayName || user.username}</h1>
                )}
                <p className="text-white/30 text-xs tracking-widest uppercase">@{user.username}</p>
              </div>

              <div className="py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs italic">"not a fish"</p>
              </div>

              <div className="flex gap-4 text-2xl">
                <span>🐟</span>
                <span>👽</span>
              </div>

              <div className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                ⭐ 40 boops received
              </div>

              <div className="w-full py-2 bg-blue-600/20 border border-blue-400/20 rounded-lg text-[10px] text-blue-300 font-bold uppercase tracking-widest">
                {link}
              </div>
            </div>

            {/* Top 8 Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 italic">. ' {user.username}'s Top 8</h3>
                <button className="text-[8px] uppercase tracking-widest text-white/30 hover:text-white">View All</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {top8.map((friend, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-full aspect-square rounded-lg border border-white/10 overflow-hidden group-hover:border-blue-400/50 transition-all">
                      <img src={friend.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                    </div>
                    <span className="text-[7px] uppercase tracking-tighter text-white/40 group-hover:text-white truncate w-full text-center">{friend.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 italic">. ' {user.username}'s Photos</h3>
                <button className="text-[8px] uppercase tracking-widest text-white/30 hover:text-white">View All</button>
              </div>
              <div className="py-8 text-center">
                <p className="text-[9px] uppercase tracking-widest text-white/20 italic">No photos yet</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Featured Content */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel p-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col">
              <div className="p-4 flex justify-center">
                <p className="text-[10px] italic text-white/40">. ' reaching the stars . '</p>
              </div>
              <div 
                onClick={() => isEditing && featuredInputRef.current?.click()}
                className={`relative w-full aspect-square rounded-xl overflow-hidden border border-white/10 ${isEditing ? 'cursor-pointer group' : ''}`}
              >
                <img 
                  src={isEditing ? (editedUser.featuredImage || editedUser.banner) : (user.featuredImage || user.banner || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200')} 
                  className="w-full h-full object-cover" 
                  alt="featured" 
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/60 p-6 rounded-full border border-white/20">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] font-bold text-blue-300/60">
                <button className="hover:text-blue-300 transition-colors">View Journals</button>
                <button className="hover:text-blue-300 transition-colors">View Photos</button>
                <button className="hover:text-blue-300 transition-colors">View Groups</button>
                <button className="hover:text-blue-300 transition-colors">View Places</button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
               <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200 italic mb-6">About Me</h3>
                  <div className="text-sm text-white/70 leading-relaxed italic">
                    {isEditing ? (
                      <textarea 
                        value={editedUser.bio || ''} 
                        onChange={e => setEditedUser(p => ({ ...p, bio: e.target.value }))}
                        className="bg-white/5 border border-white/10 p-4 text-sm w-full outline-none focus:border-blue-400 h-32 resize-none rounded-lg"
                      />
                    ) : (
                      (user.bio || "DAŞAK GEÇİLİR\nKÖPRÜ SATILIR\nFİYAT DM DEN YAZILMAZ").split('\n').map((line, i) => <p key={i}>{line}</p>)
                    )}
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Music & Extra */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 italic">{user.username}'s Profile Song</h3>
              </div>
              
              <div className={`bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col gap-4 ${isEditing ? 'border-blue-400/50' : ''}`}>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest text-white/40">Şarkı Adı</label>
                      <input 
                        value={editedUser.profileSong?.title || ''} 
                        onChange={e => setEditedUser(p => ({ ...p, profileSong: { ...(p.profileSong || { artist: '', albumArt: '' }), title: e.target.value } }))}
                        className="bg-white/5 border border-white/10 p-2 text-[10px] w-full outline-none focus:border-blue-400 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest text-white/40">Sanatçı</label>
                      <input 
                        value={editedUser.profileSong?.artist || ''} 
                        onChange={e => setEditedUser(p => ({ ...p, profileSong: { ...(p.profileSong || { title: '', albumArt: '' }), artist: e.target.value } }))}
                        className="bg-white/5 border border-white/10 p-2 text-[10px] w-full outline-none focus:border-blue-400 rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest text-white/40">Spotify Linki (Opsiyonel)</label>
                      <input 
                        value={editedUser.profileSong?.spotifyUrl || ''} 
                        onChange={e => setEditedUser(p => ({ ...p, profileSong: { ...(p.profileSong || { title: '', artist: '', albumArt: '' }), spotifyUrl: e.target.value } }))}
                        className="bg-white/5 border border-white/10 p-2 text-[10px] w-full outline-none focus:border-blue-400 rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                        <img src={user.profileSong?.albumArt || "https://picsum.photos/seed/music/200/200"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{user.profileSong?.title || "It feels like I've forgotten something"}</p>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">{user.profileSong?.artist || "reidenshi"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-blue-400" />
                      </div>
                      <span className="text-[8px] text-white/30">1:24</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <a href={user.profileSong?.spotifyUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-[8px] uppercase tracking-widest text-blue-400 hover:underline">Save on Spotify</a>
                      <div className="flex gap-2">
                        <button className="text-white/20 hover:text-white transition-colors">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 italic">. ' {user.username}'s Groups</h3>
                <button className="text-[8px] uppercase tracking-widest text-white/30 hover:text-white">View All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden hover:border-blue-400/30 transition-all cursor-pointer">
                    <img src={`https://picsum.photos/seed/g${i}/100/100`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Games Section */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 italic">. ' Favorite Games</h3>
              </div>
              
              <div className="space-y-4">
                {(isEditing ? (editedUser.favoriteGames || defaultGames) : games).map((game, i) => (
                  <div key={i} className="bg-black/40 rounded-xl p-3 border border-white/10 flex items-center justify-between group hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        <img src={game.rankIcon} className="w-8 h-8 object-contain" alt={game.rank} />
                      </div>
                      <div className="flex flex-col">
                        {isEditing ? (
                          <input 
                            value={game.name} 
                            onChange={e => {
                              const newGames = [...(editedUser.favoriteGames || defaultGames)];
                              newGames[i].name = e.target.value;
                              setEditedUser(p => ({ ...p, favoriteGames: newGames }));
                            }}
                            className="bg-transparent border-none text-[11px] font-bold text-white outline-none w-24"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">{game.name}</span>
                        )}
                        {isEditing ? (
                          <input 
                            value={game.rank} 
                            onChange={e => {
                              const newGames = [...(editedUser.favoriteGames || defaultGames)];
                              newGames[i].rank = e.target.value;
                              setEditedUser(p => ({ ...p, favoriteGames: newGames }));
                            }}
                            className="bg-transparent border-none text-[9px] text-white/40 outline-none w-24"
                          />
                        ) : (
                          <span className="text-[9px] text-white/40 uppercase tracking-widest">{game.rank}</span>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newGames = (editedUser.favoriteGames || defaultGames).filter((_, idx) => idx !== i);
                          setEditedUser(p => ({ ...p, favoriteGames: newGames }));
                        }}
                        className="text-red-400/50 hover:text-red-400 p-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newGames = [...(editedUser.favoriteGames || defaultGames), { name: 'New Game', rank: 'Rank', rankIcon: 'https://picsum.photos/seed/game/100/100' }];
                      setEditedUser(p => ({ ...p, favoriteGames: newGames }));
                    }}
                    className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[8px] uppercase tracking-[0.2em] text-white/20 hover:text-white hover:border-white/30 transition-all"
                  >
                    + Add Game
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes glitch-jitter {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-3px, 1px); filter: hue-rotate(90deg); }
          50% { transform: translate(3px, -1px); filter: hue-rotate(180deg); }
          75% { transform: translate(-1px, 2px); filter: hue-rotate(270deg); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileView;
