
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
  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'privacy'>('profile');
  const [displayName, setDisplayName] = useState(user.displayName || user.username);
  
  // Voice Settings Local State (Simulated for UI)
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

  return (
    <div className="fixed inset-0 z-[500] flex bg-[#05010a] animate-in slide-in-from-right-full duration-500">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-[#110524] flex flex-col items-end py-20 pr-10 border-r border-white/5 shrink-0">
         <div className="w-60 space-y-2">
            <p className="text-[11px] font-[1000] text-white/20 uppercase tracking-[0.4em] mb-6 italic">Sistem Konfigürasyonu</p>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-4 font-[1000] uppercase italic text-sm tracking-tighter transition-all border-l-4 ${activeTab === 'profile' ? 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              Kimlik & Görünüm
            </button>
            <button 
              onClick={() => setActiveTab('voice')}
              className={`w-full text-left p-4 font-[1000] uppercase italic text-sm tracking-tighter transition-all border-l-4 ${activeTab === 'voice' ? 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              Ses & Görüntü
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left p-4 font-[1000] uppercase italic text-sm tracking-tighter transition-all border-l-4 ${activeTab === 'privacy' ? 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}
            >
              Güvenlik & Gizlilik
            </button>
            <div className="h-px bg-white/5 my-10" />
            <button onClick={onLogout} className="w-full text-left p-4 font-[1000] uppercase italic text-sm text-red-500 hover:bg-red-500/10 transition-all border-l-4 border-red-500/0 hover:border-red-500">Sistemden Çık</button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-12 relative overflow-y-auto no-scrollbar bg-[#0b0314]">
        <button onClick={onClose} className="absolute right-12 top-12 p-4 border-2 border-white/10 rounded-sm hover:border-[#ff00ff] transition-all group shadow-2xl z-10">
          <svg className="w-8 h-8 text-white/40 group-hover:text-[#ff00ff] group-hover:rotate-90 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-4xl mx-auto pb-20">
           {activeTab === 'profile' && (
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
           
           {/* VOICE SETTINGS - MATCHING THE PHOTO */}
           {activeTab === 'voice' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">Ses ve Görüntü</h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {/* Input Device */}
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

                   {/* Output Device */}
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

                   {/* Mic Volume */}
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Mikrofon Ses Seviyesi</label>
                      <div className="relative pt-2">
                        <input type="range" min="0" max="100" value={micVolume} onChange={(e) => setMicVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-[#1e1135] rounded-full appearance-none cursor-pointer accent-blue-500" />
                        <div className="absolute top-2 left-0 h-1.5 bg-blue-500 rounded-full pointer-events-none" style={{ width: `${micVolume}%` }} />
                      </div>
                   </div>

                   {/* Output Volume */}
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-white/50 uppercase tracking-widest">Hoparlör Ses Seviyesi</label>
                      <div className="relative pt-2">
                        <input type="range" min="0" max="100" value={speakerVolume} onChange={(e) => setSpeakerVolume(parseInt(e.target.value))} className="w-full h-1.5 bg-[#1e1135] rounded-full appearance-none cursor-pointer accent-blue-500" />
                        <div className="absolute top-2 left-0 h-1.5 bg-blue-500 rounded-full pointer-events-none" style={{ width: `${speakerVolume}%` }} />
                      </div>
                   </div>
                </div>

                {/* Mic Test Section */}
                <div className="pt-8 border-t border-white/5">
                   <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Mikrofon Testi</h3>
                   <p className="text-xs text-white/40 mb-4 font-medium italic">Mikrofonunda sorun mu var? Bir test yap ve komik bir şey söyle, sonra sesini sana dinleteceğiz.</p>
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
                   <p className="mt-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Ses veya görüntüyle ilgili yardıma mı ihtiyacın var? <span className="text-blue-400 cursor-pointer hover:underline">Sorun giderme rehberimize</span> göz at.</p>
                </div>

                {/* Input Profiles */}
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

                {/* Input Sensitivity */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                   <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Giriş Duyarlılığı</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Otomatik</span>
                        <div className="w-10 h-5 bg-white/5 rounded-full relative cursor-pointer border border-white/10">
                           <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" />
                        </div>
                      </div>
                   </div>
                   <p className="text-[11px] text-white/30 font-medium italic">Topluyo'nun mikrofonundan ne kadar ses ilettiğini ayarlar.</p>
                   <div className="relative pt-6">
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 opacity-80" />
                      <input type="range" min="0" max="100" value={sensitivity} onChange={(e) => setSensitivity(parseInt(e.target.value))} className="absolute top-4 w-full h-6 bg-transparent appearance-none cursor-pointer accent-white z-10" />
                      <div className="absolute top-5 bg-white w-1 h-4 shadow-[0_0_10px_white]" style={{ left: `${sensitivity}%` }} />
                   </div>
                </div>

                {/* Noise Suppression (Krisp) */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Gürültü Azaltma</h3>
                      <p className="text-[11px] text-white/30 font-medium italic">Mikrofonundaki arka plan seslerini azaltır. <span className="text-blue-400">Krisp</span> ile güçlendirildi.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-black text-white italic tracking-tighter">krisp</span>
                      </div>
                   </div>
                   <div className="relative w-48">
                      <select className="w-full bg-[#110524] border border-black p-2.5 rounded text-xs text-white/80 font-bold appearance-none outline-none focus:ring-1 focus:ring-blue-500">
                         <option>Krisp</option>
                         <option>Standart</option>
                         <option>Kapalı</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                   </div>
                </div>

                {/* Echo Cancellation */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between group">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Yankı Engelleme</h3>
                      <p className="text-[11px] text-white/30 font-medium italic">Karşı tarafa giden yankıları minimize eder.</p>
                   </div>
                   <div 
                    onClick={() => setVoiceState(v => ({...v, echoCancellation: !v.echoCancellation}))}
                    className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${voiceState.echoCancellation ? 'bg-blue-600' : 'bg-white/10 border border-white/5'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${voiceState.echoCancellation ? 'left-7' : 'left-1 bg-white/40'}`} />
                   </div>
                </div>

                {/* Push to Talk */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between group">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Bas-Konuş (Sınırlı)</h3>
                      <p className="text-[11px] text-white/30 font-medium italic">Sadece tuşa bastığında konuşmanı iletir.</p>
                   </div>
                   <div className={`w-12 h-6 rounded-full relative bg-white/10 border border-white/5 cursor-not-allowed`}>
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white/40 rounded-full" />
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'privacy' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none">GÜVENLİK_KATI</h2>
                <div className="bg-[#110524] p-12 border-4 border-white/5 space-y-12">
                   <div className="flex items-center justify-between p-8 bg-black/40 border-2 border-white/5 group hover:border-yellow-400 transition-all">
                      <div>
                         <h4 className="text-xl font-[1000] text-white uppercase italic tracking-tighter mb-2">2FA_ZORUNLULUĞU</h4>
                         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Oturum güvenliğini maksimum seviyeye çıkar.</p>
                      </div>
                      <button className="bg-yellow-400 text-black px-8 py-3 font-black uppercase italic tracking-widest text-[10px] border-4 border-white">AKTİF ET</button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
