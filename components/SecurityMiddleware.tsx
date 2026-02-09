
import React, { useState, useEffect } from 'react';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
}

const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | 'loading'>('loading');
  const [errorReason, setErrorReason] = useState<string>('');

  useEffect(() => {
    const runSecurityChecks = async () => {
      // 1. Coğrafi Engelleme Simülasyonu (Türkiye Dışı Yasak)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isTurkey = tz.includes('Istanbul') || navigator.language === 'tr-TR';
      
      if (!isTurkey) {
        setErrorReason('ERİŞİM_REDDEDİLDİ: TÜRKİYE_DIŞI_BAĞLANTI_YASAKLANMIŞTIR.');
        setIsAuthorized(false);
        return;
      }

      // 2. IP Oturum Sınırı (Aynı IP'den max 3 giriş - Simülasyon)
      const sessions = parseInt(localStorage.getItem('nos_active_sessions') || '1');
      if (sessions > 3) {
        setErrorReason('OTURUM_LIMITI_AŞILDI: AYNI_IP_ÜZERİNDEN_EN_FAZLA_3_CİHAZ_GİREBİLİR.');
        setIsAuthorized(false);
        return;
      }
      localStorage.setItem('nos_active_sessions', (sessions).toString());

      // 3. Perma Ban Check
      const checkBanStatus = () => {
        const userStr = localStorage.getItem('nebula_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const banList = JSON.parse(localStorage.getItem('topluyo_banlist') || '[]');
          if (banList.includes(user.username)) {
             localStorage.removeItem('nebula_user');
             setErrorReason('AĞDAN KALICI OLARAK UZAKLAŞTIRILDINIZ. (PERMA BAN)');
             setIsAuthorized(false);
             return true;
          }
        }
        return false;
      };

      if (checkBanStatus()) return;

      // Realtime ban monitoring
      const interval = setInterval(checkBanStatus, 5000);

      // Simüle edilen yükleme süresi
      setTimeout(() => setIsAuthorized(true), 800);

      return () => clearInterval(interval);
    };

    runSecurityChecks();
  }, []);

  if (isAuthorized === 'loading') {
    return (
      <div className="h-screen w-full bg-[#05010a] flex flex-col items-center justify-center p-10 font-black italic">
        <div className="w-32 h-1 bg-white/5 relative overflow-hidden mb-8">
           <div className="absolute inset-0 bg-[#ff00ff] animate-[marquee_2s_linear_infinite]" />
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse">SİBER_GÜVENLİK_KONTROLÜ_YAPILIYOR...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-red-950 flex flex-col items-center justify-center p-10 text-center select-none">
        <div className="text-9xl mb-10 animate-bounce">🛡️</div>
        <h1 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter mb-4 leading-none">ERİŞİM_ENGELİ</h1>
        <div className="bg-black/40 border-2 border-red-500 p-6 max-w-xl">
           <p className="text-red-500 font-black uppercase text-xs tracking-widest">{errorReason}</p>
        </div>
        <p className="mt-12 text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">SİSTEM_GÜVENLİĞİ_İÇİN_IP_ADRESİNİZ_KAYDEDİLDİ.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-10 px-10 py-4 bg-white text-black font-[1000] uppercase italic tracking-tighter hover:bg-red-500 hover:text-white transition-all"
        >
          YENİDEN_DENE
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecurityMiddleware;
