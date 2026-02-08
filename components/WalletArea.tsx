
import React, { useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  target?: string;
}

const WalletArea: React.FC = () => {
  const [balance, setBalance] = useState(1250.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'deposit', amount: 500, date: new Date(Date.now() - 86400000), status: 'completed' },
    { id: '2', type: 'transfer', amount: -150, target: 'CyberPunk_42', date: new Date(Date.now() - 172800000), status: 'completed' },
    { id: '3', type: 'withdraw', amount: -200, date: new Date(Date.now() - 259200000), status: 'completed' },
  ]);

  const [modal, setModal] = useState<'none' | 'deposit' | 'withdraw' | 'transfer'>('none');
  const [formAmount, setFormAmount] = useState('');
  const [formTarget, setFormTarget] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: modal as any,
      amount: modal === 'deposit' ? amt : -amt,
      date: new Date(),
      status: 'completed',
      target: modal === 'transfer' ? formTarget : undefined
    };

    setBalance(prev => modal === 'deposit' ? prev + amt : prev - amt);
    setTransactions(prev => [newTx, ...prev]);
    setModal('none');
    setFormAmount('');
    setFormTarget('');

    // SFX
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden relative selection:bg-[#00ffff] selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff00ff]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00ffff]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 z-10">
        <div className="space-y-1">
          <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none animate-shiny">NOS_CÜZDAN</h2>
          <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.4em]">CENTRAL_FINANCE_NODE v2.0</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-4">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sistem Durumu: ÇEVRİMİÇİ</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar relative z-10">
         {/* Balance Card */}
         <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#110524] to-[#05010a] border-4 border-white/5 p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.97 0-1.8 1.39-3.06 3.11-3.43V4h2.67v1.93c1.43.3 2.64 1.1 3.12 2.73h-1.96c-.29-.83-1.03-1.31-2.45-1.31-1.49 0-2.22.63-2.22 1.47 0 .88.86 1.39 3.18 2.02 2.82.75 3.67 2.16 3.67 4.09 0 1.93-1.39 3.07-3.11 3.43z"/></svg>
            </div>
            <p className="text-[11px] font-black text-[#00ffff] uppercase tracking-[0.5em] mb-4">MEVCUT_BİT_VARLIĞI</p>
            <h1 className="text-8xl font-[1000] text-white tracking-tighter italic animate-shiny leading-none mb-10">
               ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </h1>
            <div className="flex flex-wrap gap-4">
               <button onClick={() => setModal('deposit')} className="bg-[#ff00ff] text-white px-10 py-5 rounded-2xl font-[1000] uppercase italic tracking-tighter text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">PARA_YÜKLE</button>
               <button onClick={() => setModal('withdraw')} className="bg-white/5 border-2 border-white/10 text-white px-10 py-5 rounded-2xl font-[1000] uppercase italic tracking-tighter text-xl hover:bg-white/10 transition-all">PARA_ÇEK</button>
               <button onClick={() => setModal('transfer')} className="bg-[#00ffff]/10 border-2 border-[#00ffff]/20 text-[#00ffff] px-10 py-5 rounded-2xl font-[1000] uppercase italic tracking-tighter text-xl hover:bg-[#00ffff]/20 transition-all">TRANSFER_YAP</button>
            </div>
         </div>

         {/* Transactions */}
         <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-xs font-[1000] text-white/20 uppercase tracking-[0.6em] italic px-2">SON_SİBER_İŞLEMLER</h3>
            <div className="space-y-3">
               {transactions.map((tx, idx) => (
                 <div key={tx.id} className="flex items-center justify-between p-6 bg-[#110524] border-2 border-white/5 rounded-3xl hover:border-white/10 transition-all reveal-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : tx.type === 'withdraw' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {tx.type === 'deposit' ? '📥' : tx.type === 'withdraw' ? '📤' : '💸'}
                       </div>
                       <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">
                            {tx.type === 'deposit' ? 'AĞA_VARLIK_GİRİŞİ' : tx.type === 'withdraw' ? 'VARLIK_TAHLİYESİ' : `TRANSFER -> ${tx.target}`}
                          </p>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{tx.date.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-2xl font-[1000] italic ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} TL
                       </p>
                       <p className="text-[9px] font-black text-green-500/40 uppercase tracking-widest">ONAYLANDI</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Action Modals */}
      {modal !== 'none' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setModal('none')} />
           <div className="relative w-full max-w-md bg-[#110524] border-4 border-white/10 p-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
              <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter mb-8 leading-none">
                {modal === 'deposit' ? 'FON_EKLE' : modal === 'withdraw' ? 'FON_ÇEK' : 'TRANSFER_EMRİ'}
              </h2>
              <form onSubmit={handleAction} className="space-y-6">
                 {modal === 'transfer' && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Hedef Kullanıcı (ID/USERNAME)</label>
                      <input 
                        required
                        value={formTarget}
                        onChange={e => setFormTarget(e.target.value)}
                        className="w-full bg-[#05010a] border-2 border-white/5 p-4 text-[#00ffff] font-black uppercase outline-none focus:border-[#00ffff] transition-all"
                        placeholder="HEDEF_BUL..."
                      />
                   </div>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Miktar (TL)</label>
                    <input 
                      required
                      type="number"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      className="w-full bg-[#05010a] border-2 border-white/5 p-4 text-[#ff00ff] font-black text-3xl uppercase outline-none focus:border-[#ff00ff] transition-all"
                      placeholder="0.00"
                    />
                 </div>
                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setModal('none')} className="flex-1 py-4 text-white/20 font-black uppercase tracking-widest text-[10px] hover:text-white">İptal</button>
                    <button type="submit" className="flex-1 bg-white text-black py-4 font-[1000] uppercase italic tracking-tighter hover:bg-[#00ffff] transition-all">ONAYLA</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletArea;
