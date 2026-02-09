
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
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Audio Settings
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(75);
  const [inputSensitivity, setInputSensitivity] = useState(true);
  const [inputProfile, setInputProfile] = useState<'standard' | 'isolation' | 'studio'>('standard');
  
  // Test Mic State
  const [isTestingMic, setIsTestingMic] = useState(false);
  const testAudioCtxRef = useRef<AudioContext | null>(null);
  const testStreamRef = useRef<MediaStream | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // MİKROFON TEST MANTIĞI (Loopback)
  useEffect(() => {
    const toggleMicTest = async () => {
      if (!isTestingMic) {
        if (testStreamRef.current) testStreamRef.current.getTracks().forEach(t => t.stop());
        if (testAudioCtxRef.current) testAudioCtxRef.current.close();
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        testStreamRef.current = stream;
        
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        testAudioCtxRef.current = audioCtx;
        
        const source = audioCtx.createMediaStreamSource(stream);
        // Ses seviyesini kontrol etmek için gain ekliyoruz
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0; 
        
        // Loopback: Mikrofonu doğrudan hoparlöre bağla
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      } catch (err) {
        console.error("Test mikrofonu başlatılamadı:", err);
        setIsTestingMic(false);
      }
    };

    toggleMicTest();

    return () => {
      if (testStreamRef.current) testStreamRef.current.getTracks().forEach(t => t.stop());
      if (testAudioCtxRef.current) testAudioCtxRef.current.close();
    };
  }, [isTestingMic]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'avatar') onUpdateUser({ ...user, avatar: base64String });
      else onUpdateUser({ ...user, banner: base64String });
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
    if (gradientClass.includes('green')) { root.style.setProperty('--bg-primary', '#064e3b'); root.style.setProperty('--bg-secondary', '#022c22'); }
    else if (gradientClass.includes('blue')) { root.style.setProperty('--bg-primary', '#1e3a8a'); root.style.setProperty('--bg-secondary', '#172554'); }
    else if (gradientClass.includes('rose') || gradientClass.includes('red')) { root.style.setProperty('--bg-primary', '#4c0519'); root.style.setProperty('--bg-secondary', '#270006'); }
    else if (gradientClass.includes('purple')) { root.style.setProperty('--bg-primary', '#3b0764'); root.style.setProperty('--bg-secondary', '#1e0136'); }
    else { root.style.setProperty('--bg-primary', '#111827'); root.style.setProperty('--bg-secondary', '#030712'); }
    root.style.setProperty('--text-main', '#ffffff');
  };

  const colorThemes = [
    'bg-gradient-to-br from-green-200 to-green-100', 'bg-gradient-to-br from-orange-200 to-orange-100', 'bg-gradient-to-br from-blue-200 to-blue-300',
    'bg-gradient-to-br from-yellow-100 to-yellow-200', 'bg-gradient-to-br from-rose-200 to-rose-300', 'bg-gradient-to-br from-purple-100 to-purple-200',
    'bg-gradient-to-br from-teal-100 to-teal-200', 'bg-gradient-to-br from-amber-100 to-amber-200', 'bg-gradient-to-br from-orange-500 to-orange-400',
    'bg-gradient-to-br from-blue-600 to-purple-600', 'bg-gradient-to-br from-green-900 to-yellow-700', 'bg-gradient-to-br from-red-900 to-black',
    'bg-gradient-to-br from-blue-950 to-indigo-900', 'bg-gradient-to-br from-rose-900 to-rose-700', 'bg-gradient-to-br from-gray-700 to-gray-900',
    'bg-gradient-to-br from-emerald-900 to-emerald-700', 'bg-gradient-to-br from-indigo-900 to-indigo-700', 'bg-gradient-to-br from-cyan-600 to-purple-800',
    'bg-gradient-to-br from-pink-600 to-orange-600', 'bg-gradient-to-br from-teal-700 to-blue-900', 'bg-gradient-to-br from-stone-700 to-stone-900',
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
    { id: 'az', label: 'Azerbaycan dili', desc: 'Qardaş ölkə dərstəyi.' },
    { id: 'ru', label: 'Pусский', desc: 'Rus dili desteği.' },
    { id: 'es', label: 'Español', desc: 'İspanyolca desteği.' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex bg-[var(--bg-secondary)] animate-in slide-in-from-right-full duration-500 overflow-hidden">
      <div className="w-[280px] bg-[var(--bg-primary)] flex flex-col border-r border-white/5 shrink-0 overflow-y-auto no-scrollbar">
         <div className="p-4 pt-12 pb-2">
            <nav className="space-y-0.5">
               {menuItems.map(section => (
                 <div key={section.section} className="pb-4">
                    <p className="px-3 text-[11px] font-bold text-white/30 uppercase tracking-wide mb-2 mt-4">{section.section}</p>
                    {section.items.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-3 transition-all duration-150 group
                          ${activeTab === item.id ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}
                      >
                         <span className="text-base">{item.icon}</span>
                         <span className="text-[13px] tracking-tight">{item.label}</span>
                      </button>
                    ))}
                 </div>
               ))}
               <div className="h-px bg-white/5 my-4 mx-3" />
               <button onClick={onLogout} className="w-full text-left px-3 py-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-md flex items-center gap-3 transition-all text-[13px] font-bold">🚪 Sistemi Terk Et</button>
            </nav>
         </div>
      </div>

      <div className="flex-1 p-12 relative overflow-y-auto no-scrollbar bg-[var(--bg-secondary)]">
        <button onClick={onClose} className="absolute right-12 top-12 p-3 border border-white/10 rounded-full hover:border-white/40 transition-all z-10 text-white/40 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-3xl mx-auto pb-20">
           {activeTab === 'hesabim' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">PROFİL_TERMİNALİ</h2>
                <div className="bg-[var(--bg-primary)] border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                   <div onClick={() => bannerInputRef.current?.click()} className="h-60 w-full relative overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 cursor-pointer">
                      {user.banner ? <img src={user.banner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic text-4xl uppercase tracking-[0.5em]">NO_BANNER_DATA</div>}
                   </div>
                   <div className="px-12 pb-12">
                      <div className="relative -mt-20 mb-8 inline-block">
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
           
           {activeTab === 'ses' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">SES_VE_GÖRÜNTÜ_TERMİNALİ</h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

                <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">MİKROFON_TEST_PROTOKOLÜ</h3>
                      <p className="text-[10px] text-white/30 italic">Kendi sesini ağ üzerinden dinleyerek kaliteyi kontrol et. (Loopback)</p>
                   </div>
                   <button 
                     onClick={() => setIsTestingMic(!isTestingMic)}
                     className={`px-10 py-3 rounded-md font-[1000] uppercase italic tracking-tighter transition-all shadow-2xl ${isTestingMic ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                   >
                     {isTestingMic ? 'TEST_DURDUR' : 'BAĞLANTIYI_TEST_ET'}
                   </button>
                </div>
                {isTestingMic && (
                    <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest italic animate-pulse">UYARI: ŞU AN KENDİ SESİNİ DUYUYORSUN. YANKI OLUŞABİLİR.</p>
                    </div>
                )}
             </div>
           )}

           {(activeTab !== 'hesabim' && activeTab !== 'ses' && activeTab !== 'gorunum') && (
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
