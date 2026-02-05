
import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-[#ff00ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.6)] border-2 border-white/20 transform -rotate-3`}>
    <svg className="w-3/4 h-3/4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#05010a] text-white selection:bg-[#ff00ff] selection:text-black scroll-smooth overflow-y-auto">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto transition-all duration-300">
        <div className="flex items-center gap-4 cursor-pointer group">
          <Logo />
          <span className="text-2xl font-[1000] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">Topluyo</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 font-black text-xs uppercase tracking-widest text-white/70">
          <a href="#" className="hover:text-[#ff00ff] transition-colors">Yükle</a>
          <a href="#" className="hover:text-[#ff00ff] transition-colors">Nitro</a>
          <a href="#" className="hover:text-[#ff00ff] transition-colors">Mağaza</a>
          <a href="#" className="hover:text-[#ff00ff] transition-colors">Hakkımızda</a>
        </div>

        <button 
          onClick={onLogin}
          className="bg-transparent border-2 border-[#00ffff] text-[#00ffff] px-8 py-3 rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] active:translate-y-1"
        >
          Sisteme Gir
        </button>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff00ff] blur-[150px] opacity-20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00ffff] blur-[150px] opacity-20 rounded-full animate-pulse delay-1000" />
        
        <div className="max-w-[1200px] w-full flex flex-col items-center z-10 text-center">
          <div className="mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-none backdrop-blur-md">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00ffff]">Protocol v2.5.0 Active</span>
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-[1000] leading-[0.8] mb-12 tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,1)] flex flex-col items-center">
            <span className="relative">
              DURMA
              <span className="absolute -top-2 -right-6 text-xl text-[#ff00ff] italic">punk</span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">KONUŞ</span>
            <span className="text-[#00ffff] italic text-4xl md:text-6xl mt-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">Sınırları Zorla</span>
          </h1>

          <p className="text-lg md:text-2xl leading-relaxed mb-16 font-medium max-w-2xl opacity-70 italic">
            Discord'u unut. Topluyo, modern topluluklar için tasarlanmış yüksek hızlı, düşük gecikmeli ve tamamen kontrol edilebilir dijital yaşam alanındır.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onLogin}
              className="group relative bg-[#ff00ff] text-black px-12 py-6 font-[1000] text-xl uppercase tracking-tighter hover:scale-105 transition-all active:scale-95"
            >
              <div className="absolute -inset-1 border-2 border-[#ff00ff] opacity-0 group-hover:opacity-100 animate-ping rounded-none" />
              Windows Terminali İndir
            </button>
            <button 
              onClick={onLogin}
              className="bg-white/5 border-2 border-white/10 text-white px-12 py-6 font-[1000] text-xl uppercase tracking-tighter hover:bg-white/10 transition-all hover:border-[#00ffff]"
            >
              Tarayıcıdan Sız
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 flex gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
          <span>fb.72 // 001</span>
          <span>ln.99 // 042</span>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-black py-40 px-6 relative overflow-hidden border-y border-[#ff00ff]/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-32">
          <div className="relative">
            <div className="absolute -inset-10 bg-[#ff00ff]/10 rounded-full blur-[100px]" />
            <img 
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
              className="relative z-10 w-full rounded-none border-4 border-[#ff00ff] shadow-[20px_20px_0px_rgba(255,0,255,0.2)] grayscale hover:grayscale-0 transition-all duration-700" 
              alt="Community" 
            />
          </div>
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-[1000] leading-none tracking-tighter uppercase italic text-[#00ffff]">
              KONTROL <br /> TAMAMEN <br /> SENDE
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-bold border-l-4 border-[#ff00ff] pl-8 italic">
              Kendi rollerini, kanallarını ve botlarını oluştur. Topluyo ile sıradan bir kullanıcı değil, dijital bir mimarsın.
            </p>
            <button className="text-[#ff00ff] font-black text-sm uppercase tracking-[0.3em] hover:underline underline-offset-8">Keşfetmeye Başla →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05010a] pt-32 pb-12 px-8 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <Logo />
              <span className="text-3xl font-[1000] tracking-tighter uppercase italic">Topluyo</span>
            </div>
            <p className="text-white/30 font-bold max-w-sm">Geleceğin dijital topluluk platformu. Punk ruhuyla kodlandı, özgürlük için tasarlandı.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[#00ffff] font-black uppercase text-xs tracking-widest">Kaynaklar</h4>
            <ul className="space-y-4 text-sm font-bold text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">Destek</li>
              <li className="hover:text-white cursor-pointer transition-colors">Güvenlik</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[#ff00ff] font-black uppercase text-xs tracking-widest">Sosyal Medya</h4>
            <ul className="space-y-4 text-sm font-bold text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors">TikTok</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto pt-12 flex items-center justify-between border-t border-white/10 text-[10px] font-black uppercase text-white/20 tracking-widest">
           <span>© 2025 TOPLUYO_CORE.ALL_RIGHTS_RESERVED</span>
           <span>Made with rage & caffeine</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
