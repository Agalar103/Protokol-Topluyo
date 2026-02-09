
import React, { useState, useEffect, useCallback } from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} bg-[#ff00ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.6)] border-2 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300`}>
    <svg className="w-3/4 h-3/4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

// Siber Ses Sentezleyici
const playGlitchSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.3;
    
    // 1. Statik Gürültü (Crunch)
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1500;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    // 2. High-pitch Blip
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + duration);
    
    oscGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    noise.start();
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
};

const GlitchOverlay = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden pointer-events-none">
      {/* Background Matrix/Code Rain Effect (Subtle) */}
      <div className="absolute inset-0 opacity-20 font-mono text-[8px] text-[#00ffff] leading-none overflow-hidden select-none whitespace-pre">
         {Array.from({ length: 40 }).map((_, i) => (
           <div key={i} className="animate-[matrix_2s_linear_infinite]" style={{ animationDelay: `${Math.random() * 2}s`, left: `${i * 2.5}%`, position: 'absolute' }}>
             {Array.from({ length: 50 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('\n')}
           </div>
         ))}
      </div>

      {/* Main Glitch Layers */}
      <div className="absolute inset-0 bg-red-500/20 mix-blend-screen animate-[glitch-rgb-1_0.1s_infinite]" />
      <div className="absolute inset-0 bg-cyan-500/20 mix-blend-multiply animate-[glitch-rgb-2_0.15s_infinite]" />
      
      {/* Scanline & Jitter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />
      
      {/* Hacker Terminal Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
         <div className="bg-black border border-[#00ffff] px-6 py-2 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
            <p className="text-[#00ffff] font-[1000] text-2xl italic uppercase tracking-[0.5em] animate-pulse">
               {Math.random() > 0.5 ? 'DECRYPTING_NODE...' : 'BYPASSING_SEC_V4'}
            </p>
         </div>
         <div className="mt-4 text-[8px] font-black text-white/20 uppercase tracking-[1em]">
            Packet_Loss: {(Math.random() * 5).toFixed(2)}% // Latency: {Math.floor(Math.random() * 20)}ms
         </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [activeSection, setActiveSection] = useState<'home' | 'nitro' | 'store' | 'about'>('home');
  const [isGlitching, setIsGlitching] = useState(false);

  const navigateTo = useCallback((section: typeof activeSection) => {
    if (section === activeSection) return;
    playGlitchSound();
    setIsGlitching(true);
    // Glitch süresini siber estetik için biraz daha kısalttım (hızlı-agresif geçiş)
    setTimeout(() => {
      setActiveSection(section);
      window.scrollTo(0, 0);
      setTimeout(() => setIsGlitching(false), 250);
    }, 150);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-[#05010a] text-white selection:bg-[#ff00ff] selection:text-black scroll-smooth overflow-y-auto relative no-scrollbar">
      <GlitchOverlay active={isGlitching} />

      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto transition-all duration-300 backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
          <Logo />
          <span className="text-2xl font-[1000] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] animate-shiny">Topluyo</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.3em] text-white/50 italic">
          <button onClick={() => navigateTo('home')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'home' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Yükle</button>
          <button onClick={() => navigateTo('nitro')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'nitro' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Nitro</button>
          <button onClick={() => navigateTo('store')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'store' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Mağaza</button>
          <button onClick={() => navigateTo('about')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'about' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Hakkımızda</button>
        </div>

        <button 
          onClick={() => { playGlitchSound(); onLogin(); }}
          className="bg-transparent border-2 border-[#00ffff] text-[#00ffff] px-8 py-2.5 font-[1000] text-[10px] uppercase italic tracking-[0.3em] hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-95"
        >
          Sisteme Gir
        </button>
      </nav>

      {/* Content Renderer */}
      <div className="animate-in fade-in duration-700">
        {activeSection === 'home' && (
          <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#ff00ff]/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#00ffff]/10 blur-[150px] rounded-full animate-pulse delay-1000" />
            
            <div className="max-w-[1200px] w-full flex flex-col items-center z-10 text-center">
              <div className="mb-6 bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase text-[#00ffff] italic">Protocol_v2.5.0_Link_Stable</span>
              </div>
              
              <h1 className="text-7xl md:text-[11rem] font-[1000] leading-[0.8] mb-12 tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,1)] flex flex-col items-center reveal-item">
                <span className="relative">
                  DURMA
                  <span className="absolute -top-4 -right-10 text-2xl text-[#ff00ff] italic animate-bounce font-black">punk</span>
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">KONUŞ</span>
                <span className="text-[#00ffff] italic text-4xl md:text-6xl mt-6 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] animate-shiny tracking-tighter">Sınırları Zorla</span>
              </h1>

              <p className="text-lg md:text-2xl leading-relaxed mb-16 font-medium max-w-2xl opacity-60 italic reveal-item uppercase tracking-tight" style={{ animationDelay: '0.2s' }}>
                Discord'u unut. Topluyo, siber topluluklar için tasarlanmış yüksek hızlı, düşük gecikmeli dijital yaşam alanındır.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 reveal-item" style={{ animationDelay: '0.4s' }}>
                <button 
                  onClick={onLogin}
                  className="group relative bg-[#ff00ff] text-black px-12 py-6 font-[1000] text-xl uppercase italic tracking-tighter hover:scale-105 transition-all shadow-2xl"
                >
                  <div className="absolute -inset-1 border-2 border-[#ff00ff] opacity-0 group-hover:opacity-100 animate-ping" />
                  Terminali İndir
                </button>
                <button 
                  onClick={onLogin}
                  className="bg-white/5 border-2 border-white/10 text-white px-12 py-6 font-[1000] text-xl uppercase italic tracking-tighter hover:bg-white/10 transition-all hover:border-[#00ffff] shadow-xl"
                >
                  Tarayıcıdan Sız
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'nitro' && (
          <section className="min-h-screen pt-40 px-8 pb-20 max-w-[1200px] mx-auto animate-in slide-in-from-bottom-8 duration-500">
             <div className="text-center mb-24">
                <h2 className="text-8xl font-[1000] italic uppercase tracking-tighter animate-shiny leading-none">NITRO_UPGRADE</h2>
                <p className="text-[#00ffff] font-black uppercase tracking-[0.6em] mt-6 italic text-xs">Siber Gücünü İkiye Katla // Root_Access: Pending</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { name: 'Basic', price: '₺29', perks: ['Özel Emojiler', '100MB Yükleme'], color: 'border-white/10' },
                  { name: 'Topluyo Pro', price: '₺79', perks: ['4K Yayın', 'Holografik Profil', '500MB Yükleme'], color: 'border-[#ff00ff] shadow-[0_0_40px_rgba(255,0,255,0.2)]' },
                  { name: 'Elite', price: '₺149', perks: ['Tüm Özellikler', 'Root Rozeti', 'VIP Destek'], color: 'border-[#00ffff] shadow-[0_0_40px_rgba(0,255,255,0.2)]' }
                ].map((plan, i) => (
                  <div key={i} className={`bg-black/60 backdrop-blur-xl p-12 border-4 ${plan.color} transform hover:-translate-y-4 transition-all duration-500 group relative overflow-hidden`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#ff00ff]/10 transition-all" />
                    <h3 className="text-4xl font-[1000] italic uppercase mb-2 tracking-tighter">{plan.name}</h3>
                    <p className="text-6xl font-black mb-10 text-white/90">{plan.price}<span className="text-xs opacity-40">/ay</span></p>
                    <ul className="space-y-4 mb-12 text-xs font-black text-white/40 uppercase italic tracking-widest">
                      {plan.perks.map(p => <li key={p} className="flex items-center gap-3"><span className="text-[#ff00ff]">></span> {p}</li>)}
                    </ul>
                    <button onClick={onLogin} className="w-full py-5 bg-white text-black font-[1000] uppercase italic tracking-tighter hover:bg-[#ff00ff] hover:text-white transition-all shadow-xl">Sistemi Yükselt</button>
                  </div>
                ))}
             </div>
          </section>
        )}

        {activeSection === 'store' && (
          <section className="min-h-screen pt-40 px-8 pb-20 max-w-[1400px] mx-auto animate-in slide-in-from-bottom-8 duration-500">
             <div className="text-center mb-24">
                <h2 className="text-8xl font-[1000] italic uppercase tracking-tighter text-[#00ffff] leading-none">NOS_MARKET</h2>
                <p className="text-white/20 font-black uppercase tracking-[0.6em] mt-6 italic text-xs">Dijital Varlık Ticareti // Encrypted_Marketplace</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { name: 'Steam 100TL', price: '₺95', img: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400' },
                  { name: 'Valorant 1200VP', price: '₺145', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400' },
                  { name: 'Nitro 1 Ay', price: '₺60', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400' },
                  { name: 'Cyber Gift', price: '₺25', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border-2 border-white/5 group hover:border-[#ff00ff] transition-all relative">
                    <div className="aspect-square bg-zinc-900 overflow-hidden relative">
                       <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-50 group-hover:brightness-100" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-6">
                       <h4 className="font-black text-xs uppercase italic mb-2 tracking-widest text-white/70">{item.name}</h4>
                       <p className="text-2xl font-black text-[#ff00ff] mb-6 italic">{item.price}</p>
                       <button onClick={onLogin} className="w-full py-3 bg-white/5 hover:bg-white hover:text-black font-black text-[10px] uppercase tracking-[0.3em] italic transition-all border border-white/10 hover:border-white">Satın Al</button>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="min-h-screen pt-40 px-8 pb-20 max-w-[900px] mx-auto animate-in slide-in-from-bottom-8 duration-500">
             <div className="space-y-16">
                <h2 className="text-9xl font-[1000] italic uppercase tracking-tighter leading-[0.8]">BİZ <br /> <span className="text-[#ff00ff]">KİMİZ?</span></h2>
                <div className="space-y-10 text-2xl font-medium text-white/50 italic leading-relaxed border-l-8 border-[#00ffff] pl-10 uppercase tracking-tighter">
                   <p>Topluyo, sadece bir uygulama değildir. Burası, dijital özgürlüğün son kalesidir. Punk ruhunu kodla birleştirdik ve tamamen kontrol edilebilir topluluklar oluşturman için sistemi sıfırdan yazdık.</p>
                   <p>Algoritmaların seni yönettiği platformları unut. Topluyo'da mimar sensin. Roller, kanallar, ekonomi ve siber güvenlik senin elinde.</p>
                   <p className="text-[#ff00ff] font-black uppercase tracking-[0.4em] text-xs animate-shiny">// PROTOCOL_CORE: FREEDOM_OVER_DATA_MINING</p>
                </div>
                <div className="pt-16 grid grid-cols-2 gap-10">
                   <div className="bg-white/5 p-10 border border-white/10 group hover:border-[#00ffff] transition-all">
                      <h4 className="text-6xl font-[1000] text-white italic mb-2 tracking-tighter group-hover:text-[#00ffff]">99.9%</h4>
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 italic">Uptime_Stability_Ratio</p>
                   </div>
                   <div className="bg-white/5 p-10 border border-white/10 group hover:border-[#ff00ff] transition-all">
                      <h4 className="text-6xl font-[1000] text-white italic mb-2 tracking-tighter group-hover:text-[#ff00ff]">0 MS</h4>
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 italic">Perceived_Latency_Delay</p>
                   </div>
                </div>
             </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#05010a] pt-40 pb-12 px-8 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 mb-40">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <Logo />
              <span className="text-4xl font-[1000] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Topluyo</span>
            </div>
            <p className="text-white/20 font-black uppercase italic tracking-widest text-xs max-w-sm leading-relaxed">Geleceğin dijital topluluk platformu. Punk ruhuyla kodlandı, özgürlük için tasarlandı. Sisteme sız ve kontrolü ele al.</p>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#00ffff] font-black uppercase text-xs tracking-[0.5em] italic">Kaynaklar</h4>
            <ul className="space-y-6 text-[10px] font-black text-white/30 uppercase italic tracking-widest">
              <li onClick={() => navigateTo('about')} className="hover:text-[#ff00ff] hover:translate-x-3 cursor-pointer transition-all">Destek_Merkezi</li>
              <li className="hover:text-[#ff00ff] hover:translate-x-3 cursor-pointer transition-all">Güvenlik_Protokolü</li>
              <li onClick={() => navigateTo('home')} className="hover:text-[#ff00ff] hover:translate-x-3 cursor-pointer transition-all">Siber_Blog</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[#ff00ff] font-black uppercase text-xs tracking-[0.5em] italic">Terminal</h4>
            <ul className="space-y-6 text-[10px] font-black text-white/30 uppercase italic tracking-widest">
              <li className="hover:text-[#00ffff] hover:translate-x-3 cursor-pointer transition-all">X_Twitter</li>
              <li className="hover:text-[#00ffff] hover:translate-x-3 cursor-pointer transition-all">Instagram_Feed</li>
              <li className="hover:text-[#00ffff] hover:translate-x-3 cursor-pointer transition-all">TikTok_Node</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto pt-16 flex items-center justify-between border-t border-white/5 text-[10px] font-black uppercase text-white/10 tracking-[0.6em] italic">
           <span>© 2025 TOPLUYO_CORE.SYSTEM_LOGS_ACTIVE</span>
           <span className="animate-pulse">DECODED_WITH_RAGE</span>
        </div>
      </footer>

      <style>{`
        @keyframes matrix {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes glitch-rgb-1 {
          0% { transform: translate(0); clip-path: inset(10% 0 30% 0); }
          20% { transform: translate(-10px, 5px); clip-path: inset(40% 0 10% 0); }
          40% { transform: translate(10px, -5px); clip-path: inset(70% 0 5% 0); }
          60% { transform: translate(-5px, 10px); clip-path: inset(20% 0 60% 0); }
          80% { transform: translate(5px, -10px); clip-path: inset(50% 0 20% 0); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-rgb-2 {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          50% { transform: translate(15px, 0px); filter: hue-rotate(180deg); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
