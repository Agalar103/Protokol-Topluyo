
import React from 'react';
import { User, Member } from '../types';

interface ProfileViewProps {
  user: User | Member;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {
  // Mock posts for the Instagram look
  const posts = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/${user.id}-${i}/600/600`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100)
  }));

  const userStats = (user as any).stats || {
    posts: 124,
    followers: '2.5k',
    following: 482
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#05010a] text-white overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-[#05010a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="magnetic-btn flex items-center gap-3 text-white/40 hover:text-[#ff00ff] transition-all font-black uppercase italic text-xs tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Geri Dön
        </button>
        <span className="font-[1000] uppercase italic tracking-tighter text-[#ff00ff]">{user.username}_CORE</span>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#ff00ff] to-[#00ffff] rounded-full animate-pulse opacity-75 blur-md" />
            <img 
              src={user.avatar} 
              className="relative w-40 h-40 rounded-full border-4 border-[#05010a] object-cover group-hover:scale-105 transition-transform duration-500" 
              alt={user.username} 
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter text-white animate-shiny">{user.username}</h1>
              <div className="flex gap-2">
                <button className="bg-white text-black px-6 py-2 font-black uppercase italic text-[10px] tracking-widest hover:bg-[#ff00ff] hover:text-white transition-all">Takip Et</button>
                <button className="bg-white/5 border border-white/10 px-4 py-2 text-white hover:bg-white/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-10">
              <div className="text-center md:text-left">
                <span className="block text-2xl font-[1000] italic text-white leading-none">{userStats.posts}</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Gönderi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-[1000] italic text-[#ff00ff] leading-none">{userStats.followers}</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Takipçi</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-2xl font-[1000] italic text-white leading-none">{userStats.following}</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Takip</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-black text-sm uppercase italic text-white">{(user as any).displayName || user.username}</p>
              <p className="text-white/40 font-medium italic text-sm leading-relaxed max-w-md">
                {(user as any).bio || "Sistem kaynaklı bir biyografi henüz tanımlanmadı. Siber ağın derinliklerinde kaybolmuş bir ruh."}
              </p>
              <a href="#" className="text-[#00ffff] font-black text-[10px] uppercase tracking-widest hover:underline">nebula.core/link/{user.username}</a>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex justify-center border-t border-white/10 mb-8">
          <div className="flex gap-16">
            <button className="py-4 border-t-2 border-white text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              Gönderiler
            </button>
            <button className="py-4 text-white/20 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16" /></svg>
              Terminal
            </button>
            <button className="py-4 text-white/20 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Künyeler
            </button>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-8">
          {posts.map((post) => (
            <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#ff00ff] transition-all">
              <img 
                src={post.image} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                alt="" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#ff00ff] fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span className="font-black italic">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#00ffff] fill-current" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
                  <span className="font-black italic">{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
