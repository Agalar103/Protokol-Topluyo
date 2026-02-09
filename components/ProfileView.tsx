
import React, { useState, useRef, useEffect } from 'react';
import { User, Member } from '../types';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dimensions = type === 'avatar' ? { w: 400, h: 400 } : { w: 1200, h: 400 };
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

  const userStats = (user as any).stats || { posts: 124, followers: 94, following: 862 };
  const joinDate = "Ağustos 2022";
  const location = "Valorant : Member";
  const link = "instagram.com/topluyo";

  return (
    <div className="fixed inset-0 z-[1000] bg-black text-white overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />

      {/* Başarı Uyarısı */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1100] animate-in zoom-in slide-in-from-top-4 duration-300">
          <div className="bg-[#00ffff] text-black px-8 py-3 border-4 border-white shadow-[0_0_50px_rgba(0,255,255,0.5)] flex items-center gap-4">
            <span className="text-2xl">✅</span>
            <div className="flex flex-col">
              <span className="font-[1000] uppercase italic tracking-tighter text-lg leading-none">BİLGİLER GÜNCELLENDİ</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">SİSTEM_DOĞRULAMASI_BAŞARILI</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 py-2 flex items-center gap-8">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex flex-col">
          <h2 className="font-black text-lg leading-tight uppercase tracking-tight italic">{editedUser.displayName || editedUser.username}</h2>
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">{userStats.posts} GÖNDERİ</span>
        </div>
      </div>

      {/* Banner */}
      <div 
        onClick={() => isEditing && bannerInputRef.current?.click()}
        className={`relative h-48 md:h-64 bg-zinc-900 overflow-hidden ${isEditing ? 'cursor-pointer group/banner' : ''} ${isSaving ? 'animate-[glitch-flicker_0.2s_infinite]' : ''}`}
      >
        <img 
          src={isEditing ? editedUser.banner : user.banner || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200'} 
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isSaving ? 'opacity-50' : 'opacity-100'}`} 
          alt="banner" 
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity">
            <div className="bg-black/60 p-4 rounded-full border border-white/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
        )}
        {isSaving && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />}
      </div>

      {/* Profile Details */}
      <div className="max-w-2xl mx-auto px-4 relative">
        <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4">
          <div className="relative">
            <div 
              onClick={() => isEditing && avatarInputRef.current?.click()}
              className={`relative rounded-full border-4 border-black overflow-hidden bg-black ${isEditing ? 'cursor-pointer group/avatar' : ''} ${isSaving ? 'animate-[glitch-jitter_0.1s_infinite]' : ''}`}
            >
              <img 
                src={isEditing ? editedUser.avatar : user.avatar} 
                className={`w-32 h-32 md:w-40 md:h-40 object-cover transition-all duration-700 ${isSaving ? 'scale-125 blur-sm grayscale' : 'scale-100 grayscale-0'}`} 
                alt={user.username} 
              />
              {isEditing && !isSaving && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              )}
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-full h-1 bg-[#00ffff] animate-[scan-line_0.5s_linear_infinite]" />
                </div>
              )}
            </div>
            {!isEditing && user.status === 'online' && (
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
            )}
          </div>
          <div className="pb-2 flex gap-2">
            {isEditing ? (
              <>
                <button disabled={isSaving} onClick={() => { setIsEditing(false); setEditedUser(user as User); }} className="px-6 py-2 border border-white/10 rounded-full font-black text-sm hover:bg-white/5 transition-all text-white/40 disabled:opacity-50">İptal</button>
                <button disabled={isSaving} onClick={handleSave} className="px-6 py-2 bg-white text-black rounded-full font-black text-sm hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50">
                   {isSaving ? (
                     <>
                       <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                       KAYDEDİLİYOR
                     </>
                   ) : 'Değişiklikleri kaydet'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 border border-white/30 rounded-full font-black text-sm hover:bg-white/10 transition-all">Profili düzenle</button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="space-y-1">
            {isEditing ? (
              <input 
                disabled={isSaving}
                value={editedUser.displayName || ''} 
                onChange={e => setEditedUser(p => ({ ...p, displayName: e.target.value }))}
                placeholder="Görünen İsim"
                className="bg-zinc-900 border border-white/10 p-2 text-xl font-[1000] italic uppercase tracking-tighter w-full outline-none focus:border-[#ff00ff] disabled:opacity-50"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-[1000] italic uppercase tracking-tighter">{user.displayName || user.username}</h1>
                {user.id.startsWith('bot-') && (
                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-1">BOT</span>
                )}
              </div>
            )}
            <p className="text-white/40 font-bold text-sm">@{user.username}</p>
          </div>

          <div className="flex flex-wrap gap-2">
             {badges.map(badge => (
               <div key={badge.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.color} border border-white/5`}>
                  <span className="text-sm">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{badge.label}</span>
               </div>
             ))}
          </div>

          <div className="text-sm font-bold uppercase tracking-tight space-y-1 leading-relaxed">
            {isEditing ? (
              <textarea 
                disabled={isSaving}
                value={editedUser.bio || ''} 
                onChange={e => setEditedUser(p => ({ ...p, bio: e.target.value }))}
                placeholder="Biyografin..."
                className="bg-zinc-900 border border-white/10 p-2 text-sm font-bold uppercase w-full outline-none focus:border-[#ff00ff] h-24 no-scrollbar resize-none disabled:opacity-50"
              />
            ) : (
              (user.bio || "DAŞAK GEÇİLİR\nKÖPRÜ SATILIR\nFİYAT DM DEN YAZILMAZ").split('\n').map((line, i) => <p key={i}>{line}</p>)
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/40 text-[13px] font-bold">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400 hover:underline cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              <span>{link}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{joinDate} tarihinde katıldı</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-2 pb-6">
            <div className="flex gap-1 hover:underline cursor-pointer">
              <span className="font-black text-white">{userStats.following}</span>
              <span className="text-white/40 font-bold">Takip edilen</span>
            </div>
            <div className="flex gap-1 hover:underline cursor-pointer">
              <span className="font-black text-white">{userStats.followers}</span>
              <span className="text-white/40 font-bold">Takipçi</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 sticky top-14 bg-black/80 backdrop-blur-md">
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter relative">GÖNDERİLER<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-purple-500 rounded-full" /></button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">YANITLAR</button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">MEDYA</button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">BEĞENİLER</button>
        </div>

        <div className="py-20 text-center space-y-4">
           <div className="text-6xl grayscale opacity-20">🕳️</div>
           <p className="text-white/20 font-black uppercase tracking-[0.3em] italic text-xs">Henüz bir veri girişi saptanmadı.</p>
        </div>
      </div>

      <style>{`
        @keyframes glitch-jitter {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-3px, 1px); filter: hue-rotate(90deg); }
          50% { transform: translate(3px, -1px); filter: hue-rotate(180deg); }
          75% { transform: translate(-1px, 2px); filter: hue-rotate(270deg); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
        @keyframes glitch-flicker {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.005); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ProfileView;
