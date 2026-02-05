
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('SİSTEM HATASI: PAROLALAR EŞLEŞMİYOR.');
      return;
    }

    // Admin & Demo Credentials Check
    const isAdmin = email === 'nana1' && password === 'nana1';
    const isDemo = email === 'anan' && password === 'anan';

    if (mode === 'login' && (isAdmin || isDemo)) {
      onSuccess({
        id: isAdmin ? 'admin-1' : 'demo-1',
        username: isAdmin ? 'nana1' : 'anan',
        displayName: isAdmin ? 'nana1' : 'ANAN_DEMO',
        avatar: `https://picsum.photos/seed/${isAdmin ? 'admin' : 'anan'}/200/200`,
        banner: isAdmin ? 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200' : undefined,
        status: 'online',
      });
      return;
    }

    if (email && password && (mode === 'login' || (mode === 'register' && username))) {
      // For any other login or a new registration
      onSuccess({
        id: Date.now().toString(),
        username: username || email.split('@')[0],
        displayName: (username || email.split('@')[0]).toUpperCase(),
        avatar: `https://picsum.photos/seed/${email}/200/200`,
        status: 'online',
      });
    } else {
      setError('ERİŞİM REDDEDİLDİ: TÜM ALANLARI DOLDURUN.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#05010a] flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-yellow-400/5 blur-[200px] rounded-full animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 text-white/30 hover:text-yellow-400 transition-all flex items-center gap-4 font-[1000] uppercase text-sm tracking-[0.4em] italic group"
      >
        <span className="p-2 border-2 border-white/10 group-hover:border-yellow-400 transition-all">
          <svg className="w-6 h-6 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </span>
        ANA TERMİNAL
      </button>

      <div className="bg-black/90 backdrop-blur-3xl w-full max-w-[1000px] flex flex-col md:flex-row border-[6px] border-white/5 relative group shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="absolute top-4 right-6 p-2 text-[10px] font-black text-yellow-400/20 italic tracking-[0.5em] animate-pulse">
          {mode === 'login' ? 'AUTHORIZATION_REQUIRED_v4.2' : 'NEW_NODE_REGISTRATION_v1.0'}
        </div>
        
        {/* Left Side: Form */}
        <div className="flex-1 p-16 relative">
          <div className="mb-12">
            <h2 className="text-7xl font-[1000] text-white leading-[0.85] tracking-tighter italic uppercase">
              {mode === 'login' ? 'SİSTEME' : 'AĞA'} <br /> 
              <span className="text-yellow-400">{mode === 'login' ? 'SIZ' : 'KATIL'}</span>
            </h2>
            <div className="w-24 h-2 bg-yellow-400 mt-6 shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">
                {mode === 'login' ? 'IDENTIFIER // EMAIL' : 'EMAIL_ADDRESS'}
              </label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border-4 border-white/5 p-4 text-yellow-400 font-black outline-none focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.1)] transition-all uppercase placeholder-white/5"
                placeholder={mode === 'login' ? "ID // EMAIL (anan)" : "USER@NEBULA.CORE"}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">NEBULA_NAME</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border-4 border-white/5 p-4 text-[#00ffff] font-black outline-none focus:border-[#00ffff] focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all uppercase placeholder-white/5"
                  placeholder="CHOOSE_UNIQUE_ID"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">PASS_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border-4 border-white/5 p-4 text-[#ff00ff] font-black outline-none focus:border-[#ff00ff] focus:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all uppercase placeholder-white/5"
                placeholder="********"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">VERIFY_KEY</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border-4 border-white/5 p-4 text-[#ff00ff] font-black outline-none focus:border-[#ff00ff] transition-all uppercase placeholder-white/5"
                  placeholder="********"
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-[10px] font-black uppercase italic bg-red-600/10 p-3 border-l-4 border-red-600 animate-bounce">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-yellow-400 text-black py-6 font-[1000] text-3xl uppercase italic tracking-tighter hover:brightness-110 shadow-[0_0_30px_rgba(250,204,21,0.3)] border-4 border-white transition-all active:scale-95"
            >
              {mode === 'login' ? 'OTURUMU AÇ' : 'KAYIT PROTOKOLÜNÜ BAŞLAT'}
            </button>
          </form>

          <div className="mt-8 flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] italic">
            <span className="text-white/20">
              {mode === 'login' ? 'Sistemde kayıtlı değil misin?' : 'Zaten bir kimliğin var mı?'}
            </span>
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-yellow-400 hover:underline decoration-2 underline-offset-4"
            >
              {mode === 'login' ? 'AĞA KATIL' : 'SİZ_GİRİŞ YAP'}
            </button>
          </div>

          <div className="relative my-12">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-white/5"></div></div>
             <div className="relative flex justify-center"><span className="bg-black/80 px-4 text-[9px] font-black text-white/10 uppercase tracking-[0.4em] italic">Alternatif Kanallar</span></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
             <button className="bg-white/5 border-2 border-white/10 p-4 text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">Google</button>
             <button className="bg-[#53fc18]/10 border-2 border-[#53fc18]/20 p-4 text-[9px] font-black uppercase text-[#53fc18] hover:bg-[#53fc18] hover:text-black transition-all">Kick</button>
             <button className="bg-[#9146ff]/10 border-2 border-[#9146ff]/20 p-4 text-[9px] font-black uppercase text-[#9146ff] hover:bg-[#9146ff] hover:text-black transition-all">Twitch</button>
             <button className="bg-[#ff0000]/10 border-2 border-[#ff0000]/20 p-4 text-[9px] font-black uppercase text-[#ff0000] hover:bg-[#ff0000] hover:text-black transition-all">YouTube</button>
          </div>
        </div>

        {/* Right Side: Industrial Visuals */}
        <div className="hidden md:flex flex-col items-center justify-center bg-yellow-400/5 border-l-8 border-white/5 p-16 text-center w-[400px] relative overflow-hidden group">
          <div className="absolute -inset-10 bg-gradient-to-br from-yellow-400/10 via-transparent to-[#ff00ff]/10 blur-[60px]" />
          
          <div className="relative p-8 bg-white border-8 border-black mb-12 transform rotate-1 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=topluyo-punk-login')] bg-contain bg-no-repeat grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-black flex items-center justify-center">
               <span className="text-white font-[1000] text-xl">!</span>
            </div>
          </div>
          
          <h3 className="text-4xl font-[1000] text-white mb-4 uppercase tracking-tighter italic leading-none">MOBİL <br /> SENKRON</h3>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-relaxed px-4">
            Ağa hızlı sızmak için cihazını tarat. <br /> <strong className="text-yellow-400">Topluyo Mobile v4.0</strong> gereklidir.
          </p>
          
          <div className="absolute bottom-8 left-0 w-full overflow-hidden whitespace-nowrap opacity-5 select-none">
             <div className="text-[120px] font-black uppercase italic tracking-tighter animate-[marquee_20s_linear_infinite]">PUNK_CORE_PUNK_CORE_PUNK_CORE</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
