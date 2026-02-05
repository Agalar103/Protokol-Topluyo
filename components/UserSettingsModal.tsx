
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
      <div className="w-80 bg-[#110524] flex flex-col items-end py-20 pr-10 border-r border-white/5">
         <div className="w-60 space-y-2">
            <p className="text-[11px] font-[1000] text-white/20 uppercase tracking-[0.4em] mb-6 italic">Sistem Konfigürasyonu</p>
            {['profile', 'voice', 'privacy'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`w-full text-left p-4 font-[1000] uppercase italic text-sm tracking-tighter transition-all border-l-4 ${activeTab === tab ? 'bg-[#ff00ff]/10 text-[#ff00ff] border-[#ff00ff]' : 'text-white/30 border-transparent hover:bg-white/5 hover:text-white'}`}
              >
                {tab === 'profile' ? 'Kimlik & Görünüm' : tab === 'voice' ? 'Ses & İletişim' : 'Güvenlik & Gizlilik'}
              </button>
            ))}
            <div className="h-px bg-white/5 my-10" />
            <button onClick={onLogout} className="w-full text-left p-4 font-[1000] uppercase italic text-sm text-red-500 hover:bg-red-500/10 transition-all border-l-4 border-red-500/0 hover:border-red-500">Sistemden Çık</button>
         </div>
      </div>

      <div className="flex-1 p-20 relative overflow-y-auto no-scrollbar bg-[#0b0314]">
        <button onClick={onClose} className="absolute right-12 top-12 p-4 border-2 border-white/10 rounded-sm hover:border-[#ff00ff] transition-all group shadow-2xl">
          <svg className="w-8 h-8 text-white/40 group-hover:text-[#ff00ff] group-hover:rotate-90 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-4xl mx-auto">
           {activeTab === 'profile' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">PROFİL_TERMİNALİ</h2>
                
                <div className="bg-[#110524] border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                   {/* Banner Area */}
                   <input 
                    type="file" 
                    className="hidden" 
                    ref={bannerInputRef} 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                   />
                   <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="h-60 w-full relative overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 cursor-pointer"
                   >
                      {user.banner ? (
                        <img src={user.banner} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic text-4xl uppercase tracking-[0.5em]">NO_BANNER_DATA</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                         <span className="text-xs font-black uppercase tracking-[0.4em] text-white bg-black/80 px-4 py-2 border border-white/20 shadow-2xl">BANNER_YÜKLE</span>
                      </div>
                   </div>
                   
                   {/* Profile Content */}
                   <div className="px-12 pb-12">
                      <div className="relative -mt-20 mb-8 inline-block">
                         <input 
                          type="file" 
                          className="hidden" 
                          ref={avatarInputRef} 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                         />
                         <div 
                          onClick={() => avatarInputRef.current?.click()}
                          className="relative group/avatar cursor-pointer"
                         >
                            <img src={user.avatar} className="w-40 h-40 rounded-3xl border-8 border-[#110524] bg-black shadow-2xl transition-transform group-hover/avatar:scale-105 duration-500" alt="" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all bg-black/60 rounded-3xl">
                               <span className="text-[10px] font-black uppercase tracking-widest text-white">LOGO_YÜKLE</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-white/30 uppercase tracking-widest italic block">Global Görünür İsim</label>
                               <input 
                                value={displayName} 
                                onChange={e => setDisplayName(e.target.value)} 
                                className="w-full bg-black border-2 border-white/5 p-5 text-yellow-400 font-black uppercase text-xl italic tracking-tighter outline-none focus:border-yellow-400 transition-all" 
                               />
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
                            <button 
                              onClick={() => onUpdateUser({...user, displayName})}
                              className="w-full bg-yellow-400 text-black py-5 font-[1000] uppercase italic tracking-tighter shadow-2xl border-4 border-white hover:bg-yellow-300 transition-all"
                            >
                              BİLGİLERİ KAYDET
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
           
           {/* Voice and Privacy tabs remain as they were for now */}
           {activeTab === 'voice' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none">SES_KONFİG</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-12">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic block">Gürültü Engelleme (Krisp)</label>
                         <button onClick={() => setVoiceState(v => ({...v, noiseSuppression: !v.noiseSuppression}))} className={`w-full p-6 font-[1000] uppercase italic text-left border-4 transition-all ${voiceState.noiseSuppression ? 'bg-[#ff00ff]/10 border-[#ff00ff] text-[#ff00ff]' : 'bg-white/5 border-white/10 text-white/30'}`}>
                            {voiceState.noiseSuppression ? 'PROTOKOL_AKTIF' : 'KAPALI'}
                         </button>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic block">Yankı Giderici</label>
                         <button onClick={() => setVoiceState(v => ({...v, echoCancellation: !v.echoCancellation}))} className={`w-full p-6 font-[1000] uppercase italic text-left border-4 transition-all ${voiceState.echoCancellation ? 'bg-[#00ffff]/10 border-[#00ffff] text-[#00ffff]' : 'bg-white/5 border-white/10 text-white/30'}`}>
                            {voiceState.echoCancellation ? 'PROTOKOL_AKTIF' : 'KAPALI'}
                         </button>
                      </div>
                   </div>
                   <div className="bg-black/40 p-10 border-4 border-white/5 space-y-10">
                      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Spektrum Analizi</h3>
                      <div className="h-20 w-full bg-black border-2 border-white/10 relative overflow-hidden flex items-center px-4">
                         <div className="h-10 transition-all duration-75" style={{ width: '40%', backgroundColor: '#ff00ff', boxShadow: '0 0 20px #ff00ff' }} />
                      </div>
                      <button className="w-full bg-white text-black py-4 font-black uppercase italic tracking-widest text-xs">MİKROFONU TEST ET</button>
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
