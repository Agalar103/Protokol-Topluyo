
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

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ user, voiceState, setVoiceState, onUpdateUser, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('hesabim');
  const [displayName, setDisplayName] = useState(user.displayName || user.username);
  const [selectedLanguage, setSelectedLanguage] = useState('ai');
  
  // Theme State
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Expanded Audio Settings
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(75);
  const [inputSensitivity, setInputSensitivity] = useState(true);
  const [inputProfile, setInputProfile] = useState<'standard' | 'isolation' | 'studio'>('standard');
  const [isTestingMic, setIsTestingMic] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'avatar') {
        onUpdateUser({ ...user, avatar: base64String });
      } else {
        onUpdateUser({ ...user, banner: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    setSelectedColor(null);
    const root = document.documentElement;
    
    switch(themeId) {
      case 'white':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f2f3f5');
        root.style.setProperty('--text-main', '#060607');
        break;
      case 'gray':
        root.style.setProperty('--bg-primary', '#313338');
        root.style.setProperty('--bg-secondary', '#2b2d31');
        root.style.setProperty('--text-main', '#dbdee1');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', '#110524');
        root.style.setProperty('--bg-secondary', '#0b0314');
        root.style.setProperty('--text-main', '#e9d5ff');
        break;
      case 'black':
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-secondary', '#050505');
        root.style.setProperty('--text-main', '#ffffff');
        break;
    }
  };

  const applyGradientTheme = (gradientClass: string) => {
    setSelectedColor(gradientClass);
    setSelectedTheme('custom');
    
    const root = document.documentElement;
    if (gradientClass.includes('green')) {
        root.style.setProperty('--bg-primary', '#064e3b');
        root.style.setProperty('--bg-secondary', '#022c22');
    } else if (gradientClass.includes('blue')) {
        root.style.setProperty('--bg-primary', '#1e3a8a');
        root.style.setProperty('--bg-secondary', '#172554');
    } else if (gradientClass.includes('rose') || gradientClass.includes('red')) {
        root.style.setProperty('--bg-primary', '#4c0519');
        root.style.setProperty('--bg-secondary', '#270006');
    } else if (gradientClass.includes('purple')) {
        root.style.setProperty('--bg-primary', '#3b0764');
        root.style.setProperty('--bg-secondary', '#1e0136');
    } else {
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#030712');
    }
    root.style.setProperty('--text-main', '#ffffff');
  };

  const colorThemes = [
    'bg-gradient-to-br from-green-200 to-green-100',
    'bg-gradient-to-br from-orange-200 to-orange-100',
    'bg-gradient-to-br from-blue-200 to-blue-300',
    'bg-gradient-to-br from-yellow-100 to-yellow-200',
    'bg-gradient-to-br from-rose-200 to-rose-300',
    'bg-gradient-to-br from-purple-100 to-purple-200',
    'bg-gradient-to-br from-teal-100 to-teal-200',
    'bg-gradient-to-br from-amber-100 to-amber-200',
    'bg-gradient-to-br from-orange-500 to-orange-400',
    'bg-gradient-to-br from-blue-600 to-purple-600',
    'bg-gradient-to-br from-green-900 to-yellow-700',
    'bg-gradient-to-br from-red-900 to-black',
    'bg-gradient-to-br from-blue-950 to-indigo-900',
    'bg-gradient-to-br from-rose-900 to-rose-700',
    'bg-gradient-to-br from-gray-700 to-gray-900',
    'bg-gradient-to-br from-emerald-900 to-emerald-700',
    'bg-gradient-to-br from-indigo-900 to-indigo-700',
    'bg-gradient-to-br from-cyan-600 to-purple-800',
    'bg-gradient-to-br from-pink-600 to-orange-600',
    'bg-gradient-to-br from-teal-700 to-blue-900',
    'bg-gradient-to-br from-stone-700 to-stone-900',
    'bg-gradient-to-br from-blue-800 to-blue-950'
  ];

  const menuItems = [
    { section: 'Kullanıcı Ayarları', items: [
      { id: 'hesabim', label: 'Hesabım', icon: '👤' },
      { id: 'profil-duzenle', label: 'Profil Düzenleme', icon: '📝' },
      { id: 'guvenlik', label: 'Güvenlik', icon: '🛡️' },
      { id: 'gizlilik', label: 'Veri ve Gizlilik', icon: '🔒' },
      { id: 'aile', label: 'Aile Merkezi', icon: '👥' },
      { id: 'uygulamalar', label: 'Yetkili Uygulamalar', icon: '🧩' },
      { id: 'cihazlar', label: 'Cihazlar', icon: '💻' },
      { id: 'baglantilar', label: 'Bağlantılar', icon: '🔗' },
      { id: 'bildirimler', label: 'Bildirimler', icon: '🔔' },
    ]},
    { section: 'Faturalandırma Ayarları', items: [
      { id: 'nitro', label: 'Nitro', icon: '🚀' },
      { id: 'takviye', label: 'Sunucu Takviyesi', icon: '💎' },
      { id: 'abonelikler', label: 'Abonelikler', icon: '🔄' },
      { id: 'hediye', label: 'Hediye Envanteri', icon: '🎁' },
      { id: 'faturalandirma', label: 'Faturalandırma', icon: '💳' },
    ]},
    { section: 'Uygulama Ayarları', items: [
      { id: 'gorunum', label: 'Görünüm', icon: '🎨' },
      { id: 'dil', label: 'Dil Seçeneği', icon: '🌍' },
      { id: 'ses', label: 'Ses ve Görüntü', icon: '🎙️' },
      { id: 'hiz-testi', label: 'İnternet Hızı', icon: '⚡' },
      { id: 'sohbet', label: 'Sohbet', icon: '💬' },
    ]}
  ];

  const languages = [
    { id: 'ai', label: 'Yapay Zeka (Core)', desc: 'Sistemin kendi siber dili.' },
    { id: 'tr', label: 'Türkçe', desc: 'Anadil desteği.' },
    { id: 'az', label: 'Azerbaycan dili', desc: 'Qardaş ölkə dəstəyi.' },
    { id: 'ru', label: 'Pусский', desc: 'Rus dili desteği.' },
    { id: 'es', label: 'Español', desc: 'İspanyolca desteği.' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex bg-[var(--bg-secondary)] animate-in slide-in-from-right-full duration-500 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-[280px] bg-[var(--bg-primary)] flex flex-col border-r border-white/5 shrink-0 overflow-y-auto no-scrollbar">
         <div className="p-4 pt-12 pb-2">
            <div className="relative mb-6">
               <input 
                 type="text" 
                 placeholder="Ara" 
                 className="w-full bg-black/40 border border-white/5 rounded-md py-1.5 px-3 text-[13px] text-white/40 placeholder-white/20 outline-none"
               />
            </div>

            <nav className="space-y-0.5">
               {menuItems.map(section => (
                 <div key={section.section} className="pb-4">
                    <p className="px-3 text-[11px] font-bold text-white/30 uppercase tracking-wide mb-2 mt-4">{section.section}</p>
                    {section.items.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-3 transition-all duration-150 group
                          ${activeTab === item.id 
                            ? 'bg-white/10 text-white font-bold' 
                            : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
                      >
                         <span className="text-base">{item.icon}</span>
                         <span className="text-[13px] tracking-tight">{item.label}</span>
                      </button>
                    ))}
                 </div>
               ))}
               <div className="h-px bg-white/5 my-4 mx-3" />
               <button 
                 onClick={onLogout}
                 className="w-full text-left px-3 py-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-md flex items-center gap-3 transition-all text-[13px] font-bold"
               >
                  🚪 Sistemi Terk Et
               </button>
            </nav>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-12 relative overflow-y-auto no-scrollbar bg-[var(--bg-secondary)]">
        <button onClick={onClose} className="absolute right-12 top-12 p-3 border border-white/10 rounded-full hover:border-white/40 transition-all z-10 text-white/40 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-3xl mx-auto pb-20">
           {activeTab === 'hesabim' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">PROFİL_TERMİNALİ</h2>
                <div className="bg-[var(--bg-primary)] border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                   <input type="file" className="hidden" ref={bannerInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
                   <div onClick={() => bannerInputRef.current?.click()} className="h-60 w-full relative overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 cursor-pointer">
                      {user.banner ? <img src={user.banner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic text-4xl uppercase tracking-[0.5em]">NO_BANNER_DATA</div>}
                   </div>
                   <div className="px-12 pb-12">
                      <div className="relative -mt-20 mb-8 inline-block">
                         <input type="file" className="hidden" ref={avatarInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                         <img src={user.avatar} onClick={() => avatarInputRef.current?.click()} className="w-40 h-40 rounded-3xl border-8 border-[var(--bg-primary)] bg-black shadow-2xl transition-transform hover:scale-105 cursor-pointer" alt="" />
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest italic block">Global Görünür İsim</label>
                            <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-black border-2 border-white/5 p-5 text-yellow-400 font-black uppercase text-xl italic tracking-tighter outline-none" />
                        </div>
                        <button onClick={() => onUpdateUser({...user, displayName})} className="w-full bg-yellow-400 text-black py-5 font-[1000] uppercase italic tracking-tighter shadow-2xl border-4 border-white hover:bg-yellow-300 transition-all">BİLGİLERİ KAYDET</button>
                      </div>
                   </div>
                </div>
             </div>
           )}
           
           {activeTab === 'gorunum' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <section className="space-y-2">
                   <h2 className="text-xl font-bold text-white tracking-tight">Tema</h2>
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white/90">Varsayılan Temalar</h3>
                      <p className="text-xs text-white/40">Arayüzün rengini daha iyi görünürlük için ayarla.</p>
                   </div>
                   
                   <div className="flex gap-4 pt-4">
                      <button onClick={() => applyTheme('white')} className={`relative w-16 h-16 rounded-lg bg-white border-2 transition-all ${selectedTheme === 'white' ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-white/10'}`}>
                         {selectedTheme === 'white' && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✓</div>}
                      </button>
                      <button onClick={() => applyTheme('gray')} className={`relative w-16 h-16 rounded-lg bg-[#313338] border-2 transition-all ${selectedTheme === 'gray' ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-white/10'}`}>
                         {selectedTheme === 'gray' && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✓</div>}
                      </button>
                      <button onClick={() => applyTheme('dark')} className={`relative w-16 h-16 rounded-lg bg-[#110524] border-2 transition-all ${selectedTheme === 'dark' ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-white/10'}`}>
                         {selectedTheme === 'dark' && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✓</div>}
                      </button>
                      <button onClick={() => applyTheme('black')} className={`relative w-16 h-16 rounded-lg bg-black border-2 transition-all ${selectedTheme === 'black' ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-white/10'}`}>
                         {selectedTheme === 'black' && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">✓</div>}
                      </button>
                      <button onClick={() => applyTheme('dark')} className="w-16 h-16 rounded-lg border-2 border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                   </div>
                </section>

                <div className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border border-white/10 p-6 flex items-center justify-between shadow-2xl">
                   <div className="relative z-10 flex gap-4 items-center">
                      <div className="w-16 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
                         <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded shadow-lg"></div>
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-white font-black text-sm uppercase tracking-tight">TOPLUYO'NU TAM İSTEDİĞİN GİBİ YAP</h4>
                         <p className="text-xs text-white/40 font-medium italic">Renk temalarının tamamı siber protokolümüzce herkese açılmıştır.</p>
                      </div>
                   </div>
                   <button className="relative z-10 bg-white text-black px-5 py-2 rounded font-black text-xs transition-all shadow-xl hover:scale-105">HEMEN DENE</button>
                </div>

                <section className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <h3 className="text-sm font-bold text-white uppercase tracking-widest">RENK TEMALARI</h3>
                         <span className="text-[10px] font-black text-[#00ffff] border border-[#00ffff]/20 px-2 py-0.5 italic">AÇIK_ERİŞİM</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-5 md:grid-cols-9 lg:grid-cols-11 gap-3 pt-2">
                      <div className="group relative w-12 h-12 rounded-lg border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-all">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 animate-spin duration-[3s]"></div>
                         <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-[7px] font-black px-1 rounded-sm uppercase tracking-tighter italic">YENİ</div>
                      </div>

                      {colorThemes.map((color, i) => (
                        <div 
                          key={i} 
                          onClick={() => applyGradientTheme(color)}
                          className={`relative w-12 h-12 rounded-lg cursor-pointer transition-all hover:scale-110 border-2 ${color} ${selectedColor === color ? 'border-white scale-110 shadow-xl' : 'border-white/5'}`}
                        >
                           {selectedColor === color && <div className="absolute inset-0 flex items-center justify-center text-white/80"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                        </div>
                      ))}
                   </div>
                </section>
             </div>
           )}

           {activeTab === 'dil' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">DİL_SEÇENEĞİ</h2>
                <div className="space-y-4">
                  {languages.map(lang => (
                    <div 
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`p-6 border-4 cursor-pointer transition-all flex items-center justify-between ${selectedLanguage === lang.id ? 'border-[#ff00ff] bg-[#ff00ff]/5' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-white uppercase italic">{lang.label}</h4>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{lang.desc}</p>
                      </div>
                      {selectedLanguage === lang.id && <div className="w-4 h-4 rounded-full bg-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]" />}
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-[#ff00ff]/10 border border-[#ff00ff]/20 rounded-xl mt-12">
                   <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic">NOT: SİBER_PUNK TEMASI TÜM DİLLERDE KORUNUR. TERMİNAL TERİMLERİ DEĞİŞMEZ.</p>
                </div>
             </div>
           )}

           {activeTab === 'hiz-testi' && (
             <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">SİBER_HIZ_TESTİ</h2>
                <div className="flex-1 min-h-[500px] border-4 border-white/5 rounded-2xl overflow-hidden bg-black relative">
                   <iframe 
                      src="https://openspeedtest.com/Get-widget.php" 
                      className="w-full h-full border-none"
                      title="Speed Test"
                   />
                   <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-1 font-black text-[10px] uppercase tracking-widest shadow-lg">CANLI_VERİ</div>
                </div>
                <div className="flex gap-4">
                   <a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group">
                      <h4 className="text-white font-black uppercase text-sm mb-1 group-hover:text-yellow-400">Harici Speedtest.net</h4>
                      <p className="text-[10px] text-white/30 uppercase font-bold italic">Tarayıcıda yeni sekmede aç</p>
                   </a>
                   <a href="https://fast.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all group">
                      <h4 className="text-white font-black uppercase text-sm mb-1 group-hover:text-[#00ffff]">Fast.com (Netflix)</h4>
                      <p className="text-[10px] text-white/30 uppercase font-bold italic">Hızlı bakiye kontrolü</p>
                   </a>
                </div>
             </div>
           )}
           
           {activeTab === 'ses' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">SES_VE_GÖRÜNTÜ_TERMİNALİ</h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {/* Input Device */}
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Giriş Cihazı</label>
                         <select className="w-full bg-black/40 border border-black p-3 rounded-md text-sm text-white/80 outline-none">
                           <option>Varsayılan - Mikrofon (GK50 Pro)</option>
                           <option>Harici Mikrofon (USB Audio)</option>
                           <option>Yapay Zeka Sanal Mikrofon</option>
                         </select>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Mikrofon Ses Seviyesi: %{micVolume}</label>
                         <input type="range" min="0" max="100" value={micVolume} onChange={(e) => setMicVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </div>
                   </div>

                   {/* Output Device */}
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Çıkış Cihazı</label>
                         <select className="w-full bg-black/40 border border-black p-3 rounded-md text-sm text-white/80 outline-none">
                           <option>Varsayılan - Hoparlör (Realtek High Definition)</option>
                           <option>Kulaklık (USB Wireless)</option>
                         </select>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Çıkış Ses Seviyesi: %{speakerVolume}</label>
                         <input type="range" min="0" max="100" value={speakerVolume} onChange={(e) => setSpeakerVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#ff00ff]" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Giriş Hassasiyeti</label>
                         <button onClick={() => setInputSensitivity(!inputSensitivity)} className={`w-12 h-6 rounded-full transition-all relative ${inputSensitivity ? 'bg-green-500' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${inputSensitivity ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>
                      <p className="text-[10px] text-white/30 font-bold italic uppercase tracking-widest">Otomatik hassasiyet kontrolü aktif.</p>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Giriş Modu</label>
                      <div className="flex gap-2">
                        {['standard', 'isolation', 'studio'].map(mode => (
                          <button 
                            key={mode}
                            onClick={() => setInputProfile(mode as any)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${inputProfile === mode ? 'border-[#ff00ff] bg-[#ff00ff]/10 text-white' : 'border-white/5 text-white/20 hover:border-white/20'}`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MİKROFON_TEST_PROTOKOLÜ</h3>
                      <p className="text-[10px] text-white/30 italic">Kendi sesini ağ üzerinden dinleyerek kaliteyi kontrol et.</p>
                   </div>
                   <button 
                     onClick={() => setIsTestingMic(!isTestingMic)}
                     className={`px-10 py-3 rounded-md font-[1000] uppercase italic tracking-tighter transition-all shadow-2xl ${isTestingMic ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                   >
                     {isTestingMic ? 'TEST_DURDUR' : 'BAĞLANTIYI_TEST_ET'}
                   </button>
                </div>
             </div>
           )}

           {(!['hesabim', 'gorunum', 'ses', 'dil', 'hiz-testi', 'profil-duzenle', 'guvenlik', 'gizlilik', 'aile', 'uygulamalar', 'cihazlar', 'baglantilar', 'bildirimler', 'sohbet'].includes(activeTab)) && (
             <div className="flex flex-col items-center justify-center h-[60vh] opacity-20 text-center">
                <div className="text-8xl mb-6">🚧</div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">TERMİNAL_YAPIM_AŞAMASINDA</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-4 italic">Siber ekip bu modül üzerinde çalışıyor.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
