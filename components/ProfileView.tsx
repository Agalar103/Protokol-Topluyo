
import React from 'react';
import { User, Member } from '../types';

interface ProfileViewProps {
  user: User | Member;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {
  // Rozet verileri (Örnek/Simüle edilmiş)
  const badges = [
    { id: '1year', icon: '📅', label: '1 Yıllık Üye', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'streamer', icon: '📹', label: 'Yayıncı', color: 'bg-purple-500/20 text-purple-400' },
    { id: 'youtube', icon: '▶️', label: 'YouTuber', color: 'bg-red-500/20 text-red-400' },
    { id: 'nitro', icon: '💎', label: 'Nitro', color: 'bg-pink-500/20 text-pink-400' },
  ];

  const userStats = (user as any).stats || {
    posts: 124,
    followers: 94,
    following: 862
  };

  const joinDate = "Ağustos 2022";
  const location = "Valorant : Member";
  const link = "instagram.com/topluyo";

  return (
    <div className="fixed inset-0 z-[1000] bg-black text-white overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
      {/* Üst Navigasyon */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 py-2 flex items-center gap-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex flex-col">
          <h2 className="font-black text-lg leading-tight uppercase tracking-tight italic">{(user as any).displayName || user.username}</h2>
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">{userStats.posts} GÖNDERİ</span>
        </div>
      </div>

      {/* Banner Alanı */}
      <div className="relative h-48 md:h-64 bg-zinc-900 overflow-hidden">
        {user.banner ? (
          <img src={user.banner} className="w-full h-full object-cover" alt="banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a0b2e] to-black flex items-center justify-center opacity-50">
             <span className="text-white/5 font-black text-6xl italic tracking-tighter uppercase select-none">TOPLUYO_CORE</span>
          </div>
        )}
      </div>

      {/* Profil Detayları */}
      <div className="max-w-2xl mx-auto px-4 relative">
        {/* Avatar ve Buton */}
        <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-4">
          <div className="relative">
            <img 
              src={user.avatar} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black object-cover bg-black" 
              alt={user.username} 
            />
            {user.status === 'online' && (
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
            )}
          </div>
          <div className="pb-2">
            <button className="px-6 py-2 border border-white/30 rounded-full font-black text-sm hover:bg-white/10 transition-all">
              Profili düzenle
            </button>
          </div>
        </div>

        {/* İsim ve Rozetler */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-[1000] italic uppercase tracking-tighter">{(user as any).displayName || user.username}</h1>
              {/* Bot Rozeti Kontrolü */}
              {user.id.startsWith('bot-') && (
                <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zM7 13a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
                  BOT
                </span>
              )}
            </div>
            <p className="text-white/40 font-bold text-sm">@{user.username}</p>
          </div>

          {/* Rozet Satırı (Badges) */}
          <div className="flex flex-wrap gap-2">
             {badges.map(badge => (
               <div key={badge.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.color} border border-white/5 transition-transform hover:scale-105 cursor-help group relative`}>
                  <span className="text-sm">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{badge.label}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-[8px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-black">
                    SİSTEM_DOĞRULANDI
                  </div>
               </div>
             ))}
          </div>

          {/* Biyografi Alanı */}
          <div className="text-sm font-bold uppercase tracking-tight space-y-0.5 leading-relaxed">
            {user.bio ? (
              user.bio.split('\n').map((line, i) => <p key={i}>{line}</p>)
            ) : (
              <>
                <p>DAŞAK GEÇİLİR</p>
                <p>KÖPRÜ SATILIR</p>
                <p>FİYAT DM DEN YAZILMAZ</p>
              </>
            )}
          </div>

          {/* Meta Veriler (Konum, Link, Tarih) */}
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

          {/* İstatistikler */}
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

        {/* Sekmeler (X/Twitter stili) */}
        <div className="flex border-b border-white/10 sticky top-14 bg-black/80 backdrop-blur-md">
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter relative">
            GÖNDERİLER
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-purple-500 rounded-full" />
          </button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">YANITLAR</button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">MEDYA</button>
          <button className="flex-1 py-4 font-black text-sm uppercase italic tracking-tighter text-white/40 hover:bg-white/5 transition-all">BEĞENİLER</button>
        </div>

        {/* Gönderi Akışı (Boş Durum) */}
        <div className="py-20 text-center space-y-4">
           <div className="text-6xl grayscale opacity-20">🕳️</div>
           <p className="text-white/20 font-black uppercase tracking-[0.3em] italic text-xs">Henüz bir veri girişi saptanmadı.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
