
import React, { useState, useRef } from 'react';
import { ChannelType, Server, Role } from '../types';

interface CreateServerModalProps {
  onClose: () => void;
  onCreate: (serverData: Partial<Server> & { isPremium: boolean, customUrl?: string }) => void;
}

const CreateServerModal: React.FC<CreateServerModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [tier, setTier] = useState<'free' | 'premium'>('free');
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    
    // Play sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}

    onCreate({
      name: name,
      icon: iconPreview || icon,
      isPremium: tier === 'premium',
      customUrl: tier === 'premium' ? customUrl : undefined
    } as any);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#110524] border-[6px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-white/5">
           <h2 className="text-5xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-2">SUNUCU_KUR</h2>
           <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.4em]">YENİ_DİJİTAL_YAŞAM_ALANI_BAŞLAT</p>
        </div>

        <div className="p-10 space-y-10">
           {/* Icon & Name */}
           <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="shrink-0">
                 <input type="file" ref={fileInputRef} onChange={handleIconUpload} className="hidden" accept="image/*" />
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-32 h-32 bg-[#05010a] border-4 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00ffff] transition-all group overflow-hidden"
                 >
                    {iconPreview ? (
                      <img src={iconPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">GÖRSEL_YÜKLE</span>
                      </>
                    )}
                 </div>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                 <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sunucu Kimliği (Adı)</label>
                 <input 
                   value={name}
                   onChange={e => setName(e.target.value)}
                   className="w-full bg-[#05010a] border-4 border-white/5 p-5 text-white font-black text-2xl uppercase italic tracking-tighter outline-none focus:border-[#00ffff] transition-all"
                   placeholder="MİMAR_BİR_AD_SEÇ..."
                 />
              </div>
           </div>

           {/* Tier Selection */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setTier('free')}
                className={`p-6 border-4 text-left transition-all ${tier === 'free' ? 'border-[#00ffff] bg-[#00ffff]/5' : 'border-white/5 hover:border-white/20'}`}
              >
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl font-black text-white uppercase italic tracking-tighter">ÜCRETSİZ</span>
                    <span className="text-[10px] font-black text-[#00ffff]">v1.0</span>
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">Standart özellikler, hazır kanal şablonları.</p>
              </button>

              <button 
                onClick={() => setTier('premium')}
                className={`p-6 border-4 text-left transition-all relative overflow-hidden ${tier === 'premium' ? 'border-[#ff00ff] bg-[#ff00ff]/5 shadow-[0_0_30px_rgba(255,0,255,0.2)]' : 'border-white/5 hover:border-white/20'}`}
              >
                 <div className="absolute top-0 right-0 bg-[#ff00ff] text-white px-3 py-1 text-[8px] font-[1000] uppercase tracking-tighter italic">POPÜLER</div>
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl font-black text-white uppercase italic tracking-tighter">PREMIUM</span>
                    <span className="text-[10px] font-black text-[#ff00ff]">799 TL</span>
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">Özel URL, rozetler ve sınırsız bant genişliği.</p>
              </button>
           </div>

           {tier === 'premium' && (
             <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                <label className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest">Özel Node URL (URL_CUSTOM_VANITY)</label>
                <div className="flex items-center bg-[#05010a] border-4 border-[#ff00ff]/20 p-5">
                   <span className="text-white/20 font-black mr-2">topluyo.com/</span>
                   <input 
                     value={customUrl}
                     onChange={e => setCustomUrl(e.target.value)}
                     className="bg-transparent text-[#ff00ff] font-black uppercase outline-none flex-1"
                     placeholder="URL_ADINIZ"
                   />
                </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-10 bg-[#05010a] border-t border-white/5 flex items-center justify-between">
           <button onClick={onClose} className="text-white/30 font-black uppercase italic tracking-widest text-[10px] hover:text-white transition-all">İptal Et</button>
           <button 
             onClick={handleCreate}
             disabled={!name.trim() || (tier === 'premium' && !customUrl)}
             className={`px-10 py-5 font-[1000] uppercase italic tracking-tighter text-xl transition-all shadow-2xl border-4 ${name.trim() ? 'bg-white text-black border-white hover:bg-[#00ffff] hover:border-[#00ffff]' : 'bg-white/5 text-white/10 border-white/5 cursor-not-allowed'}`}
           >
             SİSTEMİ BAŞLAT
           </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServerModal;
