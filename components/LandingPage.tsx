
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

const playGlitchSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.3;
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
      <div className="absolute inset-0 opacity-20 font-mono text-[8px] text-[#00ffff] leading-none overflow-hidden select-none whitespace-pre">
         {Array.from({ length: 40 }).map((_, i) => (
           <div key={i} className="animate-[matrix_2s_linear_infinite]" style={{ animationDelay: `${Math.random() * 2}s`, left: `${i * 2.5}%`, position: 'absolute' }}>
             {Array.from({ length: 50 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('\n')}
           </div>
         ))}
      </div>
      <div className="absolute inset-0 bg-red-500/20 mix-blend-screen animate-[glitch-rgb-1_0.1s_infinite]" />
      <div className="absolute inset-0 bg-cyan-500/20 mix-blend-multiply animate-[glitch-rgb-2_0.15s_infinite]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
         <div className="bg-black border border-[#00ffff] px-6 py-2 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
            <p className="text-[#00ffff] font-[1000] text-2xl italic uppercase tracking-[0.5em] animate-pulse">DECRYPTING_NODE...</p>
         </div>
      </div>
    </div>
  );
};

const CircularProgress = ({ value, color, label }: { value: number, color: string, label: string }) => {
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
          <circle cx="48" cy="48" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ color: color }} className="transition-all duration-1000 ease-out" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-black text-xl text-black">{value}%</span>
      </div>
      <span className="font-black text-sm uppercase tracking-widest" style={{ color: color }}>{label}</span>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [activeSection, setActiveSection] = useState<'home' | 'mobile' | 'nitro' | 'store' | 'about'>('home');
  const [isGlitching, setIsGlitching] = useState(false);

  const navigateTo = useCallback((section: typeof activeSection) => {
    if (section === activeSection) return;
    playGlitchSound();
    setIsGlitching(true);
    setTimeout(() => {
      setActiveSection(section);
      window.scrollTo(0, 0);
      setTimeout(() => setIsGlitching(false), 250);
    }, 150);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-[#05010a] text-white selection:bg-[#ff00ff] selection:text-black scroll-smooth overflow-y-auto relative no-scrollbar">
      <GlitchOverlay active={isGlitching} />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto transition-all duration-300 backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
          <Logo />
          <span className="text-2xl font-[1000] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] animate-shiny">Topluyo</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.3em] text-white/50 italic">
          <button onClick={() => navigateTo('home')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'home' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Yükle</button>
          <button onClick={() => navigateTo('mobile')} className={`transition-all hover:text-[#ff00ff] ${activeSection === 'mobile' ? 'text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1' : ''}`}>Mobil</button>
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

      <div className="animate-in fade-in duration-700">
        {activeSection === 'home' && (
          <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="max-w-[1200px] w-full flex flex-col items-center z-10 text-center">
              <div className="mb-6 bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase text-[#00ffff] italic">Protocol_v2.5.0_Link_Stable</span>
              </div>
              <h1 className="text-7xl md:text-[11rem] font-[1000] leading-[0.8] mb-12 tracking-tighter uppercase flex flex-col items-center reveal-item">
                <span className="relative">DURMA<span className="absolute -top-4 -right-10 text-2xl text-[#ff00ff] italic animate-bounce font-black">punk</span></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">KONUŞ</span>
                <span className="text-[#00ffff] italic text-4xl md:text-6xl mt-6 animate-shiny tracking-tighter">Sınırları Zorla</span>
              </h1>
              <p className="text-lg md:text-2xl leading-relaxed mb-16 font-medium max-w-2xl opacity-60 italic reveal-item uppercase tracking-tight" style={{ animationDelay: '0.2s' }}>
                Discord'u unut. Topluyo, siber topluluklar için tasarlanmış yüksek hızlı, düşük gecikmeli dijital yaşam alanındır.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 reveal-item" style={{ animationDelay: '0.4s' }}>
                <button onClick={onLogin} className="group relative bg-[#ff00ff] text-black px-12 py-6 font-[1000] text-xl uppercase italic tracking-tighter hover:scale-105 transition-all shadow-2xl">Terminali İndir</button>
                <button onClick={onLogin} className="bg-white/5 border-2 border-white/10 text-white px-12 py-6 font-[1000] text-xl uppercase italic tracking-tighter hover:bg-white/10 transition-all hover:border-[#00ffff] shadow-xl">Tarayıcıdan Sız</button>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'mobile' && (
          <section className="min-h-screen pt-40 px-8 pb-32 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
            <div className="max-w-4xl w-full flex flex-col items-center gap-20">
              
              {/* Mobile Hero Card */}
              <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-[#ff00ff] via-[#6d28d9] to-[#1e1b4b] rounded-[40px] p-12 flex flex-col justify-center relative overflow-hidden border-4 border-white/10 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
                <div className="relative z-10 max-w-lg">
                  <h2 className="text-6xl md:text-8xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-6">Topluyo Mobile</h2>
                  <p className="text-sm md:text-lg font-bold text-white/70 uppercase italic tracking-tight mb-10 leading-relaxed">
                    Düşük RAM Kullanımı ile Tercih Edilmekte. <br />
                    Yayıncılar İçin Özellikler ve Avantajlar. <br />
                    Veri Güvenliği Kullanıcıların Gözdesi.
                  </p>
                  <button onClick={onLogin} className="bg-[#ff00ff] text-white px-10 py-4 rounded-full font-[1000] uppercase italic tracking-tighter text-sm shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:scale-105 transition-all">Ücretsiz İndir</button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
              </div>

              {/* Devices Illustration */}
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 py-20 bg-gradient-to-b from-transparent to-[#ff00ff]/5 rounded-[60px]">
                <div className="relative w-64 h-[500px] bg-black border-8 border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden group hover:-rotate-3 transition-transform">
                   <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Mobile App" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <Logo className="w-20 h-20 animate-pulse" />
                   </div>
                </div>
                <div className="flex flex-col items-center gap-8">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-16 hover:scale-105 transition-all cursor-pointer" alt="Google Play" />
                  <h3 className="text-4xl md:text-6xl font-[1000] text-white text-center uppercase italic tracking-tighter leading-none">HEM MOBİL <br /> HEM BİLGİSAYARDA</h3>
                </div>
                <div className="relative w-[450px] aspect-video bg-black border-8 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden group hover:rotate-3 transition-transform hidden lg:block">
                  <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600" className="w-full h-full object-cover opacity-60" alt="Desktop App" />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                     <Logo className="w-24 h-24 shadow-[0_0_50px_rgba(255,0,255,0.3)]" />
                   </div>
                </div>
              </div>

              {/* Comparison Card */}
              <div className="w-full max-w-2xl bg-white p-12 rounded-[40px] shadow-2xl border-b-8 border-gray-200">
                <h4 className="text-center text-2xl font-[1000] italic text-black uppercase mb-12 tracking-widest">Topluluk Tercihi</h4>
                <div className="flex justify-around items-center">
                  <CircularProgress value={80} color="#ff00ff" label="Topluyo" />
                  <div className="h-20 w-px bg-gray-200" />
                  <CircularProgress value={70} color="#4361ee" label="Discord" />
                </div>
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
             </div>
          </section>
        )}
      </div>

      <footer className="bg-[#05010a] pt-40 pb-12 px-8 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 mb-40">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <Logo />
              <span className="text-4xl font-[1000] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Topluyo</span>
            </div>
            <p className="text-white/20 font-black uppercase italic tracking-widest text-xs max-w-sm leading-relaxed">Geleceğin dijital topluluk platformu. Punk ruhuyla kodlandı, özgürlük için tasarlandı. Sisteme sız ve kontrolü ele al.</p>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto pt-16 flex items-center justify-between border-t border-white/5 text-[10px] font-black uppercase text-white/10 tracking-[0.6em] italic">
           <span>© 2025 TOPLUYO_CORE.SYSTEM_LOGS_ACTIVE</span>
           <span className="animate-pulse">DECODED_WITH_RAGE</span>
        </div>
      </footer>

      <style>{`
        @keyframes glitch-rgb-1 {
          0% { transform: translate(0); clip-path: inset(10% 0 30% 0); }
          20% { transform: translate(-10px, 5px); clip-path: inset(40% 0 10% 0); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-rgb-2 {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          100% { transform: translate(0); filter: hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
