
import React, { useState, useEffect, useRef } from 'react';
import { MarketItem } from '../types';

const MARKET_ITEMS: MarketItem[] = [
  { id: '1', name: '100 TL Steam Cüzdan Kodu', price: '100 TL', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600', category: 'Steam' },
  { id: '2', name: '250 TL Steam Cüzdan Kodu', price: '250 TL', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600', category: 'Steam' },
  { id: '3', name: '1200 Valorant Points (VP)', price: '145 TL', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600', category: 'Valorant' },
  { id: '4', name: 'Topluyo Hoodie - V1', price: '850 TL', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600', category: 'Merch' },
  { id: '5', name: 'Siber T-Shirt "Root"', price: '450 TL', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600', category: 'Merch' },
  { id: '6', name: 'Neon Şapka "Topluyo"', price: '250 TL', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600', category: 'Merch' },
  { id: '7', name: 'Topluyo Nitro (1 Ay)', price: '60 TL', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=600', category: 'Diğer' },
];

type OrderStatus = 'none' | 'magazada' | 'kargoda' | 'yolda' | 'ulasti';

// Full Emoji Kamyon Tasarımı
const EmojiTruck: React.FC<{ isMoving: boolean }> = ({ isMoving }) => (
  <div className={`relative flex items-end ${isMoving ? 'animate-[truck-vibration_0.2s_infinite]' : ''}`}>
    <div className="text-7xl relative select-none">
      <span className="inline-block" style={{ transform: 'scaleX(-1)' }}>🚚</span>
      {isMoving && (
        <div className="absolute -left-4 top-1/2 text-xl opacity-60 animate-[exhaust-smoke_0.5s_infinite]">
          💨
        </div>
      )}
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-20 h-10 bg-gradient-to-r from-yellow-400/20 to-transparent blur-xl pointer-events-none" />
    </div>
  </div>
);

// Geçen Nesneler (Emoji tabanlı)
const PassingObject: React.FC<{ emoji: string, delay: number, size?: string, bottom?: string }> = ({ emoji, delay, size = 'text-5xl', bottom = 'bottom-4' }) => (
  <div 
    className={`absolute ${bottom} ${size} animate-[scenery-move_3s_linear_infinite] select-none z-0`} 
    style={{ animationDelay: `${delay}s`, right: '-100px' }}
  >
    {emoji}
  </div>
);

const StoreArea: React.FC = () => {
  const [filter, setFilter] = useState<'Hepsi' | 'Steam' | 'Valorant' | 'Merch' | 'Diğer'>('Hepsi');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('none');
  const [orderedItem, setOrderedItem] = useState<MarketItem | null>(null);

  const filteredItems = filter === 'Hepsi' 
    ? MARKET_ITEMS 
    : MARKET_ITEMS.filter(i => i.category === filter);

  // Sesli okuma fonksiyonu - Kadın sesi tercihiyle
  const speakStatus = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Mevcut sesleri durdur
      const msg = new SpeechSynthesisUtterance();
      msg.text = text;
      msg.lang = 'tr-TR';
      
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.includes('tr-TR') && (
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('google') || 
        v.name.toLowerCase().includes('yelda') ||
        v.name.toLowerCase().includes('zeynep')
      ));
      
      if (trVoice) {
        msg.voice = trVoice;
      }

      msg.rate = 0.9;
      msg.pitch = 1.1; 
      window.speechSynthesis.speak(msg);
    }
  };

  useEffect(() => {
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  }, []);

  const startOrderSequence = (item: MarketItem) => {
    setOrderedItem(item);
    setOrderStatus('magazada');
    
    // Toplam süreyi 10 saniye uzattık (Eski: ~8.5s, Yeni: ~18.5s)
    setTimeout(() => setOrderStatus('kargoda'), 4000);
    setTimeout(() => setOrderStatus('yolda'), 9000);
    setTimeout(() => {
        setOrderStatus('ulasti');
        speakStatus("Siparişiniz teslim edildi");
    }, 17000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden animate-in fade-in duration-500 transition-all relative">
      {/* Store Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-b from-[#ff66b2]/5 to-transparent relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Nos Market</h1>
            <p className="text-white/40 font-bold text-sm uppercase italic tracking-widest">Siber Donanım ve Dijital Varlık Terminali</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Hepsi', 'Steam', 'Valorant', 'Merch', 'Diğer'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all border-2 ${filter === cat ? 'bg-[#ff00ff] border-[#ff00ff] text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-[#110524] rounded-2xl border-4 border-white/5 overflow-hidden hover:border-[#ff00ff]/30 transition-all hover:translate-y-[-4px] shadow-2xl relative">
              <div className="aspect-[4/3] overflow-hidden relative">
                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-110" alt={item.name} />
                 <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-[#00ffff] uppercase tracking-widest border border-[#00ffff]/20">
                    {item.category}
                 </div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <h3 className="font-[1000] text-white text-sm leading-tight min-h-[40px] uppercase italic tracking-tighter">{item.name}</h3>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl font-black text-[#ff00ff] italic">₺{item.price.replace(' TL', '')}</span>
                  <button 
                    onClick={() => startOrderSequence(item)}
                    className="bg-white/5 hover:bg-[#ff00ff] text-white px-4 py-2 border-2 border-white/10 hover:border-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-90"
                  >
                    {item.category === 'Merch' ? 'Sipariş Et' : 'Satın Al'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kargo Takip Overlay */}
      {orderStatus !== 'none' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" />
           
           <div className="relative w-full max-w-4xl bg-[#05010a] border-[8px] border-white/10 p-12 shadow-[0_0_100px_rgba(255,0,255,0.1)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
              
              <div className="flex justify-between items-start mb-16">
                 <div className="z-10">
                    <h2 className="text-5xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-2 drop-shadow-lg">LOJİSTİK_PROTOKOLÜ</h2>
                    <p className="text-sm font-black text-[#ff00ff] uppercase tracking-[0.4em] italic drop-shadow-md">Takip No: #NOS-{Math.floor(Math.random()*900000+100000)}</p>
                 </div>
                 <div className="text-right z-10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Teslimat Adresi</p>
                    <p className="text-xs font-bold text-white uppercase italic">SİBER_AĞ_TERMİNALİ_042</p>
                 </div>
              </div>

              {/* Kamyon Yolu & Animasyon Alanı */}
              <div className="relative h-64 mb-20 bg-black/60 border-y-2 border-white/20 overflow-hidden rounded-xl">
                 {/* Arka Plan Nesneleri (Ağaçlar ve Binalar) */}
                 {orderStatus === 'yolda' && (
                   <>
                     <PassingObject emoji="🏢" delay={0} size="text-7xl" bottom="bottom-12" />
                     <PassingObject emoji="🌲" delay={0.5} size="text-5xl" bottom="bottom-4" />
                     <PassingObject emoji="🏬" delay={1.2} size="text-6xl" bottom="bottom-10" />
                     <PassingObject emoji="🌲" delay={1.8} size="text-5xl" bottom="bottom-4" />
                     <PassingObject emoji="🏙️" delay={2.4} size="text-8xl" bottom="bottom-16" />
                   </>
                 )}

                 {/* Yol Çizgileri */}
                 <div className="absolute top-[80%] left-0 w-full h-2 bg-white/10 overflow-hidden">
                    <div className={`flex w-[200%] ${orderStatus === 'yolda' ? 'animate-[road-lines_0.15s_linear_infinite]' : ''}`}>
                       {Array.from({ length: 30 }).map((_, i) => (
                         <div key={i} className="w-12 h-1.5 bg-white/60 mr-12 shrink-0 rounded-full" />
                       ))}
                    </div>
                 </div>
                 
                 {/* Kamyon Taşıyıcısı */}
                 <div className="absolute top-[65%] left-0 w-full h-full -translate-y-1/2 z-20">
                    <div 
                      className="absolute transition-all duration-[4000ms] ease-in-out flex items-center justify-center h-full" 
                      style={{ 
                        left: orderStatus === 'magazada' ? '10%' : orderStatus === 'kargoda' ? '30%' : orderStatus === 'yolda' ? '60%' : '90%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                       <EmojiTruck isMoving={orderStatus === 'yolda'} />
                    </div>
                 </div>

                 {/* Duraklar */}
                 <div className="absolute bottom-6 left-0 w-full flex justify-between items-center px-12 z-30">
                    {[
                      { id: 'magazada', label: 'Mağzada' },
                      { id: 'kargoda', label: 'Kargoda' },
                      { id: 'yolda', label: 'Yolda' },
                      { id: 'ulasti', label: 'Ulaştı' }
                    ].map((step) => {
                       const active = orderStatus === step.id;
                       const past = ['magazada', 'kargoda', 'yolda', 'ulasti'].indexOf(orderStatus) >= ['magazada', 'kargoda', 'yolda', 'ulasti'].indexOf(step.id);
                       
                       return (
                         <div key={step.id} className="relative flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full border-4 transition-all duration-500 z-10 ${past ? 'bg-[#ff00ff] border-white shadow-[0_0_20px_#ff00ff]' : 'bg-black border-white/40'}`} />
                            <span className={`absolute top-8 text-[11px] font-[1000] uppercase tracking-widest italic whitespace-nowrap transition-all drop-shadow-md ${active ? 'text-white scale-110' : 'text-white/40'}`}>
                               {step.label}
                            </span>
                         </div>
                       )
                    })}
                 </div>
              </div>

              {/* Detaylar */}
              <div className="grid grid-cols-2 gap-8 bg-white/5 p-8 border border-white/20 rounded-lg z-10 relative">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Ürün Bilgisi</p>
                    <div className="flex items-center gap-4">
                       <img src={orderedItem?.image} className="w-16 h-16 object-cover border-2 border-white/30 rounded-lg shadow-lg" alt="" />
                       <div>
                          <p className="text-sm font-[1000] text-white uppercase italic leading-tight">{orderedItem?.name}</p>
                          <p className="text-[10px] text-[#ff00ff] font-black uppercase tracking-widest italic mt-1">{orderedItem?.price}</p>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col justify-center border-l border-white/20 pl-8">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Canlı Durum</p>
                    <p className="text-xl font-[1000] text-[#00ffff] uppercase italic tracking-tighter animate-pulse drop-shadow-[0_0_10px_#00ffff44]">
                       {orderStatus === 'magazada' && 'SİPARİŞ_ALINDI_HAZIRLANIYOR'}
                       {orderStatus === 'kargoda' && 'MERKEZDEN_AYRILIYOR'}
                       {orderStatus === 'yolda' && 'SİBER_OTOBANDA_İLERLİYOR'}
                       {orderStatus === 'ulasti' && 'TESLİMAT_BAŞARILI_BİTTİ'}
                    </p>
                 </div>
              </div>
              
              {orderStatus === 'ulasti' && (
                 <div className="mt-12 text-center animate-in zoom-in duration-500 z-10 relative">
                    <button 
                      onClick={() => {
                        setOrderStatus('none');
                        setOrderedItem(null);
                        window.speechSynthesis.cancel();
                      }}
                      className="px-16 py-5 bg-[#00ff00] text-black font-[1000] uppercase italic tracking-tighter text-2xl shadow-[0_0_40px_rgba(0,255,0,0.5)] hover:scale-105 active:scale-95 transition-all"
                    >
                      TERMİNALİ KAPAT
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* CSS Animasyonları */}
      <style>{`
        @keyframes road-lines {
          from { transform: translateX(0); }
          to { transform: translateX(-96px); }
        }
        @keyframes scenery-move {
          from { right: -100px; }
          to { right: 120%; }
        }
        @keyframes truck-vibration {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(1deg); }
          75% { transform: translateY(1px) rotate(-1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes exhaust-smoke {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5) translate(-20px, -10px); opacity: 0; }
        }
      `}</style>

      {/* Footer Tools */}
      <footer className="mt-20 py-10 border-t-4 border-white/5 flex items-center justify-between text-white/10 font-[1000] text-[11px] uppercase tracking-[0.5em] italic max-w-[1400px] mx-auto w-full z-10 transition-opacity duration-300">
         <div className="flex gap-12">
            <button className="hover:text-white transition-all hover:tracking-[0.6em] group flex items-center gap-3">
               <span className="w-2 h-2 bg-white/10 rounded-full group-hover:bg-[#ff00ff]" />
               KOD_BOZDUR
            </button>
            <button className="hover:text-white transition-all hover:tracking-[0.6em] group flex items-center gap-3">
               <span className="w-2 h-2 bg-white/10 rounded-full group-hover:bg-[#00ffff]" />
               GÜVENLİ_TİCARET
            </button>
         </div>
         <div className="animate-pulse">NOS_WALLET_SYNC: SUCCESSFUL</div>
      </footer>
    </div>
  );
};

export default StoreArea;
