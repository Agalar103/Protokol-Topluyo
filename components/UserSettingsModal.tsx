
import React, { useState, useRef } from 'react';
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
  
  // Voice Settings Local State
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(50);
  const [inputProfile, setInputProfile] = useState<'isolation' | 'studio' | 'custom'>('custom');
  const [sensitivity, setSensitivity] = useState(70);
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

  const menuItems = [
    { section: 'Kullanıcı Ayarları', items: [
      { id: 'hesabim', label: 'Hesabım', icon: '👤' },
      { id: 'icerik', label: 'İçerik ve Sosyal', icon: '🛡️' },
      { id: 'gizlilik', label: 'Veri ve Gizlilik', icon: '🛡️' },
      { id: 'aile', label: 'Aile Merkezi', icon: '👥' },
      { id: 'uygulamalar', label: 'Yetkili Uygulamalar', icon: '🧩' },
      { id: 'cihazlar', label: 'Cihazlar', icon: '💻' },
      { id: 'baglantilar', label: 'Bağlantılar', icon: '🔗' },
      { id: 'bildirimler', label: 'Bildirimler', icon: '🔔' },
      { id: 'warp', label: 'WARP+ (VPN)', icon: '🌐' },
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
      { id: 'erisfilebilirlik', label: 'Erişilebilirlik', icon: '♿' },
      { id: 'ses', label: 'Ses ve Görüntü', icon: '🎙️' },
      { id: 'sohbet', label: 'Sohbet', icon: '💬' },
    ]}
  ];

  return (
    <div className="fixed inset-0 z-[500] flex bg-[#05010a] animate-in slide-in-from-right-full duration-500">
      {/* Sidebar Navigation - EXACT MATCH TO SCREENSHOT */}
      <div className="w-[280px] bg-[#110524] flex flex-col border-r border-white/5 shrink-0 overflow-y-auto no-scrollbar">
         <div className="p-4 pt-12 pb-2">
            <div className="relative mb-6">
               <input 
                 type="text" 
                 placeholder="Ara" 
                 className="w-full bg-[#05010a] border border-black/20 rounded-md py-1 px-3 text-xs text-white/40 placeholder-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
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
                         <span className={`text-base transition-transform group-hover:scale-110 ${activeTab === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                            {item.icon}
                         </span>
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
      <div className="flex-1 p-12 relative overflow-y-auto no-scrollbar bg-[#0b0314]">
        <button onClick={onClose} className="absolute right-12 top-12 p-4 border-2 border-white/10 rounded-sm hover:border-[#ff00ff] transition-all group shadow-2xl z-10">
          <svg className="w-8 h-8 text-white/40 group-hover:text-[#ff00ff] group-hover:rotate-90 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-4xl mx-auto pb-20">
           {activeTab === 'hesabim' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">PROFİL_TERMİNALİ</h2>
                <div className="bg-[#110524] border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                   <input type="file" className="hidden" ref={bannerInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
                   <div onClick={() => bannerInputRef.current?.click()} className="h-60 w-full relative overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 cursor-pointer">
                      {user.banner ? <img src={user.banner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic text-4xl uppercase tracking-[0.5em]">NO_BANNER_DATA</div>}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><span className="text-xs font-black uppercase tracking-[0.4em] text-white bg-black/80 px-4 py-2 border border-white/20 shadow-2xl">BANNER_YÜKLE</span></div>
                   </div>
                   <div className="px-12 pb-12">
                      <div className="relative -mt-20 mb-8 inline-block">
                         <input type="file" className="hidden" ref={avatarInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                         <div onClick={() => avatarInputRef.current?.click()} className="relative group/avatar cursor-pointer">
                            <img src={user.avatar} className="w-40 h-40 rounded-3xl border-8 border-[#110524] bg-black shadow-2xl transition-transform group-hover/avatar:scale-105 duration-500" alt="" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all bg-black/60 rounded-3xl"><span className="text-[10px] font-black uppercase tracking-widest text-white">LOGO_YÜKLE</span></div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest italic block">Global Görünür İsim</label>
                               <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-black border-2 border-white/5 p-5 text-yellow-400 font-black uppercase text-xl italic tracking-tighter outline-none focus:border-yellow-400 transition-all" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest italic block">Hakkımda</label>
                               <textarea className="w-full h-32 bg-black border-2 border-white/5 p-5 text-white/60 font-medium outline-none focus:border-[#ff00ff] transition-all" placeholder="DİJİTAL_DÜNYADAN_NOTLAR..." />
                            </div>
                         </div>
                         <div className="space-y-8">
                            <div className="bg-black/40 p-8 border-2 border-white/5">
                               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Profil Süsleri</p>
                               <div className="flex gap-4">
                                  <div className="w-16 h-16 bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/10 font-black">+</div>
                                  <div className="w-16 h-16 bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/10 font-black text-xs">YENİ</div>
                               </div>
                            </div>
                            <button onClick={() => onUpdateUser({...user, displayName})} className="w-full bg-yellow-400 text-black py-5 font-[1000] uppercase italic tracking-tighter shadow-2xl border-4 border-white hover:bg-yellow-300 transition-all">BİLGİLERİ KAYDET</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
           
           {activeTab === 'ses' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">Ses ve Görüntü</h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Mikrofon</label>
                      <div className="relative group">
                        <select className="w-full bg-[#110524] border border-black p-3 rounded-md text-sm text-white/80 appearance-none outline-none focus:ring-1 focus:ring-blue-500 transition-all">
                          <option>Varsayılan - Mikrofon (GK50 Pro)</option>
                          <option>Harici Mikrofon (USB Audio)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Konuşmacı</label>
                      <div className="relative group">
                        <select className="w-full bg-[#110524] border border-black p-3 rounded-md text-sm text-white/80 appearance-none outline-none focus:ring-1 focus:ring-blue-500 transition-all">
                          <option>Varsayılan - BLUEFORCE (USB Audio)</option>
                          <option>Hoparlör (Realtek Audio)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Mikrofon Ses Seviyesi</label>
                      <div className="relative pt-2">
                        <input type="range" min="0" max="100" value={micVolume} onChange={(e) => setMicVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-[#1e1135] rounded-full appearance-none cursor-pointer accent-blue-500" />
                        <div className="absolute top-2 left-0 h-1.5 bg-blue-500 rounded-full pointer-events-none" style={{ width: `${micVolume}%` }} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Hoparlör Ses Seviyesi</label>
                      <div className="relative pt-2">
                        <input type="range" min="0" max="100" value={speakerVolume} onChange={(e) => setSpeakerVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-[#1e1135] rounded-full appearance-none cursor-pointer accent-blue-500" />
                        <div className="absolute top-2 left-0 h-1.5 bg-blue-500 rounded-full pointer-events-none" style={{ width: `${speakerVolume}%` }} />
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Mikrofon Testi</h3>
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setIsTestingMic(!isTestingMic)}
                        className={`px-6 py-2.5 rounded-md font-bold text-xs uppercase transition-all shadow-lg ${isTestingMic ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                      >
                        {isTestingMic ? 'Testi Durdur' : 'Kontrol Edelim'}
                      </button>
                      <div className="flex-1 h-6 bg-white/5 rounded-md flex items-center px-1 gap-0.5 overflow-hidden">
                         {Array.from({ length: 50 }).map((_, i) => (
                           <div key={i} className={`h-4 w-1 rounded-sm transition-all duration-75 ${isTestingMic && Math.random() > 0.5 ? 'bg-blue-500' : 'bg-white/10'}`} />
                         ))}
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-wide">Giriş Profili</h3>
                   <div className="space-y-4">
                      {[
                        { id: 'isolation', title: 'Ses İzolasyonu', desc: 'Topluyo gürültüyü kessin, sadece senin güzel sesin duyulsun!' },
                        { id: 'studio', title: 'Stüdyo', desc: 'Saf ses: İşlemesiz açık mikrofon' },
                        { id: 'custom', title: 'Özel', desc: 'Gelişmiş mod: Bütün ayarları ve düğmeleri kurcalamama izin ver!' }
                      ].map((profile) => (
                        <div key={profile.id} onClick={() => setInputProfile(profile.id as any)} className="flex items-start gap-4 cursor-pointer group">
                           <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${inputProfile === profile.id ? 'border-blue-500' : 'border-white/20 group-hover:border-white/40'}`}>
                              {inputProfile === profile.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                           </div>
                           <div>
                              <p className={`text-sm font-bold uppercase transition-all ${inputProfile === profile.id ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>{profile.title}</p>
                              <p className="text-[11px] text-white/30 font-medium italic">{profile.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {(activeTab !== 'hesabim' && activeTab !== 'ses') && (
             <div className="flex flex-col items-center justify-center h-[60vh] opacity-20 text-center">
                <div className="text-8xl mb-6">🚧</div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">TERMİNAL_YAPIM_AŞAMASINDA</h2>
                <p className="mt-4 font-bold text-sm tracking-widest uppercase">BU SEKMEYE ERİŞİM GEÇİCİ OLARAK PROTOKOL DIŞIDIR</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
