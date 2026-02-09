
import React, { useState, useRef, useEffect } from 'react';
import { User, VoiceState } from '../types';

interface UserSettingsModalProps {
  user: User;
  voiceState: VoiceState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceState>>;
  onUpdateUser: (user: User) => void;
  onClose: () => void;
  onLogout: () => void;
}

const LANGUAGES = [
  { code: 'tr', name: 'TÜRKÇE', flag: '🇹🇷' },
  { code: 'en', name: 'ENGLISH', flag: '🇺🇸' },
  { code: 'de', name: 'DEUTSCH', flag: '🇩🇪' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
];

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ user, voiceState, setVoiceState, onUpdateUser, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('ses');
  const [displayName, setDisplayName] = useState(user.displayName || user.username);
  const [bio, setBio] = useState(user.bio || '');
  
  // App Settings State
  const [theme, setTheme] = useState<'light' | 'dark' | 'black'>('dark');
  const [language, setLanguage] = useState('tr');
  const [fontSize, setFontSize] = useState(16);

  // Audio Settings (From Image)
  const [micVolume, setMicVolume] = useState(85);
  const [speakerVolume, setSpeakerVolume] = useState(70);
  const [inputProfile, setInputProfile] = useState<'isolation' | 'studio' | 'custom'>('custom');
  const [sensitivity, setSensitivity] = useState(40);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [pushToTalk, setPushToTalk] = useState(false);
  
  // Test Mic State
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [isClosingTest, setIsClosingTest] = useState(false);
  const [testVolume, setTestVolume] = useState(0);
  
  const testAudioCtxRef = useRef<AudioContext | null>(null);
  const testStreamRef = useRef<MediaStream | null>(null);
  const testAnalyserRef = useRef<AnalyserNode | null>(null);
  const testRafRef = useRef<number | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const stopMicTest = () => {
    setIsClosingTest(true);
    setTimeout(() => {
      setIsTestingMic(false);
      setIsClosingTest(false);
      if (testRafRef.current) cancelAnimationFrame(testRafRef.current);
      if (testStreamRef.current) testStreamRef.current.getTracks().forEach(t => t.stop());
      if (testAudioCtxRef.current && testAudioCtxRef.current.state !== 'closed') testAudioCtxRef.current.close();
      setTestVolume(0);
    }, 400);
  };

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      testStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      testAudioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      testAnalyserRef.current = analyser;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setTestVolume((sum / dataArray.length) / 128);
        testRafRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
      setIsTestingMic(true);
    } catch (err) { console.error(err); }
  };

  const menuItems = [
    { section: 'Kullanıcı Ayarları', items: [
      { id: 'hesabim', label: 'Hesabım', icon: '👤' },
      { id: 'profil-duzenle', label: 'Profil Düzenleme', icon: '📝' },
      { id: 'guvenlik', label: 'Güvenlik', icon: '🛡️' },
      { id: 'gizlilik', label: 'Veri ve Gizlilik', icon: '🔒' },
    ]},
    { section: 'Uygulama Ayarları', items: [
      { id: 'gorunum', label: 'Görünüm', icon: '🎨' },
      { id: 'dil', label: 'Dil Seçeneği', icon: '🌍' },
      { id: 'ses', label: 'Ses ve Görüntü', icon: '🎙️' },
      { id: 'bildirimler', label: 'Bildirimler', icon: '🔔' },
    ]}
  ];

  return (
    <div className="fixed inset-0 z-[500] flex bg-[#0f0a19] animate-in slide-in-from-right-full duration-500 overflow-hidden font-sans select-none text-[#dbdee1]">
      {/* Sidebar */}
      <div className="w-[280px] bg-[#110524] flex flex-col border-r border-white/5 shrink-0 overflow-y-auto no-scrollbar">
         <div className="p-4 pt-12">
            <nav className="space-y-0.5">
               {menuItems.map(section => (
                 <div key={section.section} className="pb-4">
                    <p className="px-3 text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 mt-4">{section.section}</p>
                    {section.items.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-all
                          ${activeTab === item.id ? 'bg-white/10 text-white font-black italic' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
                      >
                         <span className="text-base">{item.icon}</span>
                         <span className="text-[12px] uppercase tracking-tight">{item.label}</span>
                      </button>
                    ))}
                 </div>
               ))}
               <div className="h-px bg-white/5 my-4 mx-3" />
               <button onClick={onLogout} className="w-full text-left px-3 py-2 text-red-500 font-black uppercase italic tracking-widest text-[12px] hover:bg-red-500/10 transition-all">🚪 Sistemi Terk Et</button>
            </nav>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-12 relative overflow-y-auto no-scrollbar bg-[#160a29]">
        <button onClick={onClose} className="absolute right-12 top-12 p-3 border-4 border-white/10 rounded-full hover:border-[#ff00ff] transition-all z-10 text-white/40 hover:text-[#ff00ff] shadow-2xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-3xl mx-auto pb-20">
           {activeTab === 'ses' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-[1000] text-white/50 uppercase tracking-[0.3em] italic">Mikrofon</label>
                    <select className="w-full bg-[#0b0314] border-4 border-white/5 p-3 rounded-none text-sm text-white font-black uppercase italic outline-none cursor-pointer">
                        <option>Varsayılan - Mikrofon (GK50 Pro)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-[1000] text-white/50 uppercase tracking-[0.3em] italic">Konuşmacı</label>
                    <select className="w-full bg-[#0b0314] border-4 border-white/5 p-3 rounded-none text-sm text-white font-black uppercase italic outline-none cursor-pointer">
                        <option>Varsayılan - BLUEFORCE (USB Audio)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <label className="text-[11px] font-[1000] text-white/50 uppercase tracking-[0.3em] italic">Mikrofon Ses Seviyesi</label>
                      <div className="h-1 w-full bg-white/10 rounded-full relative">
                         <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${micVolume}%` }} />
                         <input type="range" value={micVolume} onChange={e => setMicVolume(parseInt(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                         <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl" style={{ left: `calc(${micVolume}% - 8px)` }} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-[1000] text-white/50 uppercase tracking-[0.3em] italic">Hoparlör Ses Seviyesi</label>
                      <div className="h-1 w-full bg-white/10 rounded-full relative">
                         <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${speakerVolume}%` }} />
                         <input type="range" value={speakerVolume} onChange={e => setSpeakerVolume(parseInt(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                         <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl" style={{ left: `calc(${speakerVolume}% - 8px)` }} />
                      </div>
                   </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                   <h3 className="text-sm font-[1000] text-white uppercase italic tracking-tight">Mikrofon Testi</h3>
                   <div className="flex items-center gap-4">
                      <button onClick={isTestingMic ? stopMicTest : startMicTest} className={`px-8 py-3 rounded-none font-[1000] uppercase italic tracking-tighter text-sm transition-all shadow-2xl ${isTestingMic ? 'bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                        {isTestingMic ? 'Testi Durdur' : 'Kontrol Edelim'}
                      </button>
                      <div className="flex-1 flex gap-0.5 h-8 items-end px-3 bg-black/40 border-2 border-white/5">
                         {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className={`flex-1 transition-all duration-100 ${testVolume > (i / 40) ? 'bg-[#ff00ff]' : 'bg-white/5'}`} style={{ height: `${20 + Math.random() * 80}%` }} />
                         ))}
                      </div>
                   </div>
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic leading-relaxed">Ses veya görüntüyle ilgili yardıma mı ihtiyacın var? <span className="text-indigo-400 cursor-help">Sorun giderme rehberimize</span> göz at.</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                   <h3 className="text-[11px] font-[1000] text-white/30 uppercase tracking-[0.4em] italic">Giriş Profili</h3>
                   <div className="space-y-3">
                      {[ {id:'isolation', t:'Ses İzolasyonu', d:'Gürültüyü kessin, sadece senin güzel sesin duyulsun!'},
                         {id:'studio', t:'Stüdyo', d:'Saf ses: İşlemesiz açık mikrofon.'},
                         {id:'custom', t:'Özel', d:'Gelişmiş mod: Bütün ayarları ve düğmeleri kurcalamama izin ver!'}
                      ].map(p => (
                        <label key={p.id} className={`flex items-start gap-4 p-5 border-4 transition-all cursor-pointer ${inputProfile === p.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:bg-white/5'}`}>
                           <input type="radio" checked={inputProfile === p.id} onChange={() => setInputProfile(p.id as any)} className="mt-1" />
                           <div>
                              <p className="text-sm font-black text-white uppercase italic">{p.t}</p>
                              <p className="text-[10px] text-white/30 uppercase font-black">{p.d}</p>
                           </div>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <h3 className="text-sm font-[1000] text-white uppercase italic tracking-tighter">Giriş Duyarlılığı</h3>
                   <div className="h-2 w-full rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500 relative mt-4 shadow-inner">
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full shadow-2xl" style={{ left: `${sensitivity}%` }} />
                      <input type="range" value={sensitivity} onChange={e => setSensitivity(parseInt(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-sm font-black text-white uppercase italic">Gürültü Azaltma</p>
                         <p className="text-[10px] text-white/30 font-black uppercase italic tracking-widest">Mikrofonundaki arka plan seslerini azaltır. <span className="text-indigo-400">Krisp</span> ile güçlendirildi.</p>
                      </div>
                      <div onClick={() => setNoiseReduction(!noiseReduction)} className={`w-14 h-7 rounded-full relative transition-all cursor-pointer ${noiseReduction ? 'bg-indigo-500' : 'bg-white/10'}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${noiseReduction ? 'left-8' : 'left-1'}`} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between py-4 border-t border-white/5">
                      <p className="text-sm font-black text-white uppercase italic">Yankı Engelleme</p>
                      <div onClick={() => setEchoCancellation(!echoCancellation)} className={`w-14 h-7 rounded-full relative transition-all cursor-pointer ${echoCancellation ? 'bg-indigo-500' : 'bg-white/10'}`}>
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${echoCancellation ? 'left-8' : 'left-1'}`} />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'gorunum' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Görünüm_Protokolü</h2>
                <div className="space-y-8">
                   <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">TEMA SEÇİMİ</h3>
                   <div className="grid grid-cols-3 gap-6">
                      {[ {id:'light', l:'AÇIK', i:'☀️', c:'bg-white text-black'},
                         {id:'dark', l:'KOYU', i:'🌙', c:'bg-[#313338] text-white border-indigo-500 shadow-2xl shadow-indigo-500/20'},
                         {id:'black', l:'SİYAH', i:'🌑', c:'bg-black text-white border-[#ff00ff] shadow-2xl shadow-[#ff00ff]/20'}
                      ].map(t => (
                        <div key={t.id} onClick={() => setTheme(t.id as any)} className={`p-8 border-4 transition-all cursor-pointer flex flex-col items-center gap-4 ${theme === t.id ? t.c : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}>
                           <span className="text-4xl">{t.i}</span>
                           <span className="font-[1000] italic text-xs uppercase tracking-widest">{t.l}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="space-y-6 pt-6 border-t border-white/5">
                   <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">YAZI_ÖLÇEĞİ</h3>
                   <div className="h-1.5 w-full bg-white/5 rounded-full relative">
                      <div className="h-full bg-[#ff00ff] rounded-full" style={{ width: `${((fontSize - 12) / 12) * 100}%` }} />
                      <input type="range" min="12" max="24" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                   </div>
                   <div className="p-6 bg-black/40 border-2 border-white/5 rounded-xl">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-indigo-500 shrink-0 shadow-lg" />
                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">MESAJ_ÖNİZLEME</p>
                            <p style={{ fontSize: `${fontSize}px` }} className="text-white font-bold italic leading-relaxed">Topluyo siber ağında mesajlar bu ölçekte görünecek. Görsel konforuna göre ayarla.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'dil' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Dil_Arayüzü</h2>
                <div className="grid grid-cols-2 gap-4">
                   {LANGUAGES.map(lang => (
                     <div 
                       key={lang.code} 
                       onClick={() => setLanguage(lang.code)}
                       className={`p-6 border-4 flex items-center justify-between transition-all cursor-pointer group ${language === lang.code ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:bg-white/5'}`}
                     >
                        <div className="flex items-center gap-4">
                           <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                           <span className="font-black italic text-sm tracking-widest">{lang.name}</span>
                        </div>
                        {language === lang.code && <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Hesabım & Profil placeholders */}
           {(activeTab === 'hesabim' || activeTab === 'profil-duzenle') && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">{activeTab === 'hesabim' ? 'Hesap_Terminali' : 'Profil_Editörü'}</h2>
                <div className="p-10 bg-black/40 border-4 border-white/5 space-y-8">
                   <div className="flex items-center gap-8">
                      <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-[#ff00ff]/20 shadow-2xl" />
                      <div>
                         <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">{user.username}</h3>
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">AUTH_LEVEL: ROOT_USER</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Görünen İsim</label>
                      <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-black/60 p-4 text-white font-black italic border-2 border-white/5 outline-none focus:border-[#ff00ff] uppercase" />
                      <button onClick={() => onUpdateUser({...user, displayName})} className="w-full bg-indigo-600 text-white py-4 font-black uppercase italic tracking-widest hover:bg-indigo-500 transition-all shadow-xl">Veriyi Güncelle</button>
                   </div>
                </div>
             </div>
           )}

           {![ 'ses', 'hesabim', 'profil-duzenle', 'gorunum', 'dil' ].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl animate-pulse">🚧</div>
                <div>
                   <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">TERMİNAL_MODÜLÜ_YÜKLENİYOR</h2>
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mt-2 italic">Ağ yöneticileri bu alanı henüz yetkilendirmedi.</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Test Visualization Pop-up */}
      {isTestingMic && (
        <div className={`fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none transition-all duration-300 ${isClosingTest ? 'opacity-0 scale-150 blur-3xl' : 'opacity-100'}`}>
           <div className={`bg-black/80 backdrop-blur-3xl border-4 border-indigo-500/40 p-12 rounded-[50px] shadow-[0_0_100px_rgba(99,102,241,0.3)] relative overflow-hidden flex flex-col items-center ${isClosingTest ? 'animate-glitch-out' : 'animate-popup-in'}`}>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
              <h2 className="text-3xl font-[1000] text-indigo-400 uppercase italic tracking-tighter mb-8 z-10 animate-pulse">SİBER_SES_ANALİZİ</h2>
              <div className="w-[500px] h-[150px] flex items-center justify-center gap-1 z-10">
                 {Array.from({ length: 60 }).map((_, i) => (
                   <div key={i} className="w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full transition-all duration-75" style={{ height: `${10 + (testVolume * (30 + Math.random() * 100))}%`, opacity: 0.3 + (testVolume * 0.7) }} />
                 ))}
              </div>
              <div className="mt-10 flex flex-col items-center z-10">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-2 italic">Signal Integrity: {(testVolume * 100).toFixed(1)}%</p>
                 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${testVolume * 100}%` }} />
                 </div>
              </div>
              {isClosingTest && <div className="absolute inset-0 bg-red-500/20 mix-blend-screen animate-pulse" />}
           </div>
        </div>
      )}

      <style>{`
        @keyframes popup-in {
          0% { transform: scale(0.8) translateY(50px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes glitch-out {
          0% { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 1; }
          20% { clip-path: inset(10% 0 30% 0); transform: translateX(-10px); }
          40% { clip-path: inset(40% 0 10% 0); transform: translateX(10px); }
          60% { clip-path: inset(70% 0 5% 0); transform: translateX(-5px); filter: hue-rotate(90deg); }
          80% { clip-path: inset(20% 0 60% 0); transform: scale(1.1); filter: brightness(2); }
          100% { transform: scale(1.5); opacity: 0; filter: blur(50px); }
        }
        .animate-glitch-out { animation: glitch-out 0.4s forwards; }
        .animate-popup-in { animation: popup-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default UserSettingsModal;
