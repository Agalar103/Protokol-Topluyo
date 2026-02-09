
import React, { useEffect, useState } from 'react';

interface HackOverlayProps {
  onClose: () => void;
}

const HackOverlay: React.FC<HackOverlayProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'glitch' | 'video'>('glitch');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('video');
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Matrix Rain Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="flex justify-around w-full h-full text-[#00ff00] text-[8px] leading-none opacity-40">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="animate-[matrix-fall_3s_linear_infinite]" style={{ animationDelay: `${Math.random() * 2}s` }}>
                {Array(50).fill(0).map(() => Math.round(Math.random())).join('\n')}
             </div>
           ))}
        </div>
      </div>

      {stage === 'glitch' ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="text-red-600 text-6xl font-[1000] italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,0,0,1)]">
             HACK_DETECTED
           </div>
           <div className="text-[#00ff00] text-xs font-black uppercase tracking-[0.5em] animate-pulse">
             INITIALIZING_COUNTERMEASURES...
           </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Main Video Source */}
          <div className="relative w-full max-w-6xl aspect-video border-4 border-[#00ff00]/30 shadow-[0_0_100px_rgba(0,255,0,0.2)] bg-black overflow-hidden">
             <iframe 
               src="https://www.youtube.com/embed/k0J6MeEfFAc?autoplay=1&controls=0&mute=0&showinfo=0&rel=0&modestbranding=1&loop=1" 
               className="w-full h-full pointer-events-none scale-105"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               frameBorder="0"
             />
             
             {/* Dynamic Terminal HUD Overlay */}
             <div className="absolute top-4 left-6 text-[#00ff00] text-[10px] space-y-1 drop-shadow-md">
                <p className="font-black">WARNING: CRITICAL SYSTEM BREACH</p>
                <p className="opacity-70 animate-pulse">LOCATION: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.X.X</p>
                <p className="opacity-70">STATUS: OVERRIDING_KERNEL_PANIC</p>
             </div>

             <div className="absolute bottom-4 right-6 text-red-600 text-[10px] font-black italic tracking-widest">
                SHIELD_MODE: BYPASSED
             </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-[1000] text-[#00ff00] uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]">
               SİSTEM_YÖNETİMİ_DEVRALINDI
            </h2>
            <div className="flex gap-8">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.4em] italic">Root_Access: Enabled</span>
              <span className="text-[10px] text-red-500 uppercase tracking-[0.4em] italic animate-pulse">Firewall: 0% Stability</span>
            </div>
          </div>
        </div>
      )}

      {/* Close Prompt */}
      <button 
        onClick={onClose}
        className="absolute bottom-6 px-10 py-3 border-2 border-white/5 text-white/20 hover:text-[#00ff00] hover:border-[#00ff00] font-black uppercase italic tracking-widest text-[10px] transition-all bg-black/40 backdrop-blur-md"
      >
        BAĞLANTIYI KES (ESC)
      </button>

      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-screen bg-green-500 animate-pulse" />

      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HackOverlay;
