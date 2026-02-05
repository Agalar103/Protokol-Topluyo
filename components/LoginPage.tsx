
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'nana1' && password === 'nana1') {
      onSuccess({
        id: 'admin-1',
        username: 'nana1',
        displayName: 'nana1',
        avatar: 'https://picsum.photos/seed/admin/200/200',
        banner: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200',
        status: 'online',
      });
      return;
    }

    if (email && password) {
      onSuccess({
        id: Date.now().toString(),
        username: email.split('@')[0],
        displayName: email.split('@')[0].toUpperCase(),
        avatar: `https://picsum.photos/seed/${email}/200/200`,
        status: 'online',
      });
    } else {
      setError('VERİLER EKSİK: ERİŞİM REDDEDİLDİ.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#05010a] flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-yellow-400/5 blur-[200px] rounded-full animate-pulse" />
      
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 text-white/30 hover:text-yellow-400 transition-all flex items-center gap-4 font-[1000] uppercase text-sm tracking-[0.4em] italic"
      >
        <span className="p-2 border-2 border-white/10 group-hover:border-yellow-400 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </span>
        GERİ ÇEKİL
      </button>

      <div className="bg-black/90 backdrop-blur-3xl w-full max-w-[1000px] flex flex-col lg:flex-row border-[6px] border-white/5 relative group">
        <div className="flex-1 p-16">
          <div className="mb-12">
            <h2 className="text-7xl font-[1000] text-white leading-[0.85] tracking-tighter italic uppercase">TOPLUYO <br /> <span className="text-yellow-400">ERİŞİMİ</span></h2>
            <div className="w-24 h-2 bg-yellow-400 mt-6 shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">IDENTIFIER</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/5 p-4 text-yellow-400 font-black outline-none focus:border-yellow-400 transition-all"
                placeholder="EMAIL // USERNAME"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">PASS_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/5 p-4 text-[#ff00ff] font-black outline-none focus:border-[#ff00ff] transition-all"
                placeholder="********"
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase italic bg-red-600/10 p-3 border-l-4 border-red-600">{error}</p>}

            <button type="submit" className="w-full bg-yellow-400 text-black py-6 font-[1000] text-2xl uppercase italic tracking-tighter hover:brightness-110 shadow-2xl border-4 border-white transition-all">SİSTEME SIZ</button>
          </form>

          <div className="relative my-12">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
             <div className="relative flex justify-center"><span className="bg-black px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">Harici Protokoller</span></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
             <button className="bg-white/5 border border-white/10 p-4 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Google</button>
             <button className="bg-[#53fc18]/10 border border-[#53fc18]/20 p-4 text-[10px] font-black uppercase text-[#53fc18] hover:bg-[#53fc18] hover:text-black transition-all">Kick</button>
             <button className="bg-[#9146ff]/10 border border-[#9146ff]/20 p-4 text-[10px] font-black uppercase text-[#9146ff] hover:bg-[#9146ff] hover:text-black transition-all">Twitch</button>
             <button className="bg-[#ff0000]/10 border border-[#ff0000]/20 p-4 text-[10px] font-black uppercase text-[#ff0000] hover:bg-[#ff0000] hover:text-black transition-all">YouTube</button>
          </div>
        </div>

        <div className="w-[350px] bg-yellow-400/5 border-l-4 border-white/5 flex flex-col items-center justify-center p-12 text-center group">
          <div className="p-4 bg-white border-8 border-black mb-8 transform rotate-2 group-hover:rotate-0 transition-transform shadow-2xl">
             <div className="w-40 h-40 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=topluyo')] bg-contain bg-no-repeat filter contrast-125" />
          </div>
          <h3 className="text-3xl font-[1000] text-white uppercase tracking-tighter italic mb-4">MOBİL SIZMA</h3>
          <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
            Hızlı giriş için <span className="text-yellow-400">Topluyo App</span> ile tarat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
