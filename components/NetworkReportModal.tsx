
import React, { useState, useEffect } from 'react';

interface NetworkReportModalProps {
  onClose: () => void;
}

interface ConnectionPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'normal' | 'vpn' | 'ddos';
  label: string;
}

const NetworkReportModal: React.FC<NetworkReportModalProps> = ({ onClose }) => {
  const [points, setPoints] = useState<ConnectionPoint[]>([]);
  const [showDdosAlert, setShowDdosAlert] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Generate nodes on relative map coordinates (0-100)
    const initialPoints: ConnectionPoint[] = [
      { id: '1', lat: 35, lng: 55, type: 'normal', label: 'Istanbul_Mainframe' },
      { id: '2', lat: 25, lng: 48, type: 'vpn', label: 'London_Relay' },
      { id: '3', lat: 38, lng: 85, type: 'normal', label: 'Tokyo_Core' },
      { id: '4', lat: 42, lng: 25, type: 'vpn', label: 'NY_Exit_Node' },
      { id: '5', lat: 28, lng: 52, type: 'normal', label: 'Berlin_Proxy' },
      { id: '6', lat: 22, lng: 60, type: 'vpn', label: 'Moscow_Vault' },
      { id: '7', lat: 75, lng: 88, type: 'normal', label: 'Sydney_Link' },
      { id: '8', lat: 32, lng: 45, type: 'normal', label: 'Paris_Datalink' },
    ];
    setPoints(initialPoints);

    const interval = setInterval(() => {
      setScanProgress(p => (p >= 100 ? 100 : p + 2));
    }, 50);

    const attackTimer = setTimeout(() => {
      const ddosPoint: ConnectionPoint = { id: 'attack-1', lat: 40, lng: 30, type: 'ddos', label: 'MALICIOUS_BOTNET_SOURCE' };
      setPoints(prev => [...prev, ddosPoint]);
      
      setTimeout(() => {
        setShowDdosAlert(true);
        setTimeout(() => {
          setPoints(prev => prev.filter(p => p.type !== 'ddos'));
          setShowDdosAlert(false);
        }, 4000);
      }, 1500);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(attackTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      {showDdosAlert && (
        <div className="absolute inset-0 z-[1300] flex items-center justify-center pointer-events-none animate-in zoom-in fade-in duration-300">
          <div className="bg-red-600/90 text-white border-4 border-white px-12 py-6 shadow-[0_0_50px_rgba(255,0,0,1)] flex flex-col items-center gap-4">
             <div className="text-8xl animate-bounce">🛡️</div>
             <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-center">DDOS BAŞARIYLA ENGELLENDİ</h2>
             <p className="text-sm font-black uppercase tracking-[0.5em] opacity-80 italic">SHIELD_PROTOCOL: LEVEL_5_PROTECTION_ENABLED</p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-[#05010a] border-4 border-[#ff00ff]/30 shadow-[0_0_50px_rgba(255,0,255,0.2)] overflow-hidden h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#110524]/50">
          <div>
            <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-1 animate-shiny">AĞ_HARİTASI_LOGLARI</h2>
            <p className="text-[10px] font-black text-[#00ffff] uppercase tracking-[0.4em]">GEOGRAPHIC_SENTINEL_SCANNER v5.2.0</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="flex flex-col items-end mr-6">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Tarama Durumu</span>
                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                   <div className="h-full bg-[#00ffff] transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
             </div>
             <button onClick={onClose} className="p-3 border-2 border-white/10 rounded hover:bg-[#ff00ff] hover:text-white transition-all text-white/40">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-8 py-4 bg-black/40 border-b border-white/5 flex gap-8 shrink-0">
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Normal Bağlantı</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">VPN / Proxy</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,1)]" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Tehdit Algılandı</span>
           </div>
        </div>

        {/* Map Area with D3 Jason Davies Style Geographic Projection Aesthetic */}
        <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-hidden">
           {/* Graticule Background (Enlem/Boylam Çizgileri) */}
           <div className="absolute inset-0 pointer-events-none opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 1000 500" className="stroke-white/20 fill-none stroke-[0.5]">
                 {[...Array(20)].map((_, i) => (
                    <line key={`lat-${i}`} x1="0" y1={i * 25} x2="1000" y2={i * 25} />
                 ))}
                 {[...Array(40)].map((_, i) => (
                    <line key={`lng-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="500" />
                 ))}
                 <circle cx="500" cy="250" r="245" className="stroke-[#00ffff]/20 stroke-1" />
                 <circle cx="500" cy="250" r="150" className="stroke-[#00ffff]/10 stroke-1" />
              </svg>
           </div>
           
           {/* Scan Line Animation */}
           <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-[1px] bg-[#00ffff]/20 shadow-[0_0_10px_#00ffff] animate-[scan_6s_linear_infinite]" />
           </div>

           {/* Detailed Geographic World Map SVG (Simplified but accurate looking) */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <svg viewBox="0 0 1000 500" className="w-full h-full text-white/20" fill="currentColor">
                 {/* North America */}
                 <path d="M150,80 L250,80 L300,150 L250,250 L100,230 L80,150 Z" />
                 {/* South America */}
                 <path d="M250,260 L320,260 L340,350 L280,480 L230,350 Z" />
                 {/* Eurasia */}
                 <path d="M450,50 L850,50 L950,150 L850,300 L700,320 L550,300 L420,150 Z" />
                 {/* Africa */}
                 <path d="M450,170 L580,170 L620,250 L580,400 L480,420 L420,280 Z" />
                 {/* Australia */}
                 <path d="M800,350 L900,350 L920,430 L820,450 Z" />
              </svg>
           </div>

           {/* Nodes with Geographic Labels */}
           {points.map(point => (
             <div 
               key={point.id} 
               className="absolute group z-10"
               style={{ top: `${point.lat}%`, left: `${point.lng}%` }}
             >
                <div className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-150 cursor-help ${
                  point.type === 'normal' ? 'bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]' :
                  point.type === 'vpn' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                  'bg-red-500 animate-ping shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                }`} />
                
                {/* Tooltip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black border border-[#00ffff]/30 px-3 py-1.5 rounded-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                   <p className="text-[10px] font-black text-[#00ffff] uppercase italic tracking-tighter">{point.label}</p>
                   <div className="flex justify-between gap-4 mt-1">
                      <p className="text-[7px] text-white/30 uppercase tracking-widest">{point.type === 'normal' ? 'SECURE_CHANNEL' : 'PROXY_ID'}</p>
                      <p className="text-[7px] text-white/50 font-mono italic">[{point.lat}, {point.lng}]</p>
                   </div>
                </div>

                {/* Simulated Data Connection Lines */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none opacity-5">
                   <circle cx="100" cy="100" r="80" stroke="#00ffff" strokeWidth="0.5" strokeDasharray="5,5" className="animate-spin duration-[10s]" />
                </svg>
             </div>
           ))}

           {/* Global Data Stream Animation */}
           <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-[#ff00ff]/20 w-[1px] h-32 animate-[fall_4s_linear_infinite] shadow-[0_0_5px_#ff00ff]"
                  style={{ left: `${Math.random() * 100}%`, top: '-20%', animationDelay: `${i * 0.7}s` }}
                />
              ))}
           </div>
        </div>

        {/* Data Footer */}
        <div className="p-6 bg-black border-t border-white/5 grid grid-cols-4 gap-4 shrink-0">
           <div className="bg-white/5 p-4 rounded-none border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full opacity-50" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Küresel Trafik</p>
              <p className="text-xl font-[1000] text-[#00ffff] italic tracking-tighter">1.542.102 PKT/S</p>
           </div>
           <div className="bg-white/5 p-4 rounded-none border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500 w-full opacity-50" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Sızma Girişimi</p>
              <p className="text-xl font-[1000] text-orange-500 italic tracking-tighter">0.002% CRIT</p>
           </div>
           <div className="bg-white/5 p-4 rounded-none border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-0.5 bg-[#ff00ff] w-full opacity-50" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Ağ Gecikmesi</p>
              <p className="text-xl font-[1000] text-[#ff00ff] italic tracking-tighter">4.2 MS (AVG)</p>
           </div>
           <div className="bg-white/5 p-4 rounded-none border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500 w-full opacity-50" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Shield Protokolü</p>
              <p className="text-xl font-[1000] text-green-500 italic tracking-tighter">SIRA_DIŞI</p>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fall {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NetworkReportModal;
