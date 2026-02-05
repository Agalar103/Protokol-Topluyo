
import React, { useState } from 'react';
import { MarketItem } from '../types';

const MARKET_ITEMS: MarketItem[] = [
  { id: '1', name: '100 TL Steam Cüzdan Kodu', price: '100 TL', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop', category: 'Steam' },
  { id: '2', name: '250 TL Steam Cüzdan Kodu', price: '250 TL', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop', category: 'Steam' },
  { id: '3', name: '1200 Valorant Points (VP)', price: '145 TL', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', category: 'Valorant' },
  { id: '4', name: '2850 Valorant Points (VP)', price: '320 TL', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', category: 'Valorant' },
  { id: '5', name: '5000 Valorant Points (VP)', price: '550 TL', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', category: 'Valorant' },
  { id: '6', name: 'Topluyo Nitro (1 Ay)', price: '60 TL', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop', category: 'Diğer' },
];

const StoreArea: React.FC = () => {
  const [filter, setFilter] = useState<'Hepsi' | 'Steam' | 'Valorant' | 'Diğer'>('Hepsi');

  const filteredItems = filter === 'Hepsi' 
    ? MARKET_ITEMS 
    : MARKET_ITEMS.filter(i => i.category === filter);

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden animate-in fade-in duration-500 transition-all">
      {/* Store Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-b from-[#ff66b2]/5 to-transparent">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Nos Market</h1>
            <p className="text-white/40 font-bold text-sm">Topluyo güvencesiyle en ucuz dijital kodlar.</p>
          </div>
          <div className="flex gap-2">
            {['Hepsi', 'Steam', 'Valorant', 'Diğer'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-[#ff66b2] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-[#110524] rounded-2xl border border-white/5 overflow-hidden hover:border-[#ff66b2]/30 transition-all hover:translate-y-[-4px] shadow-2xl relative">
              <div className="aspect-[4/3] overflow-hidden relative">
                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" alt={item.name} />
                 <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white/60 uppercase tracking-widest">
                    {item.category}
                 </div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <h3 className="font-black text-white text-sm leading-tight min-h-[40px]">{item.name}</h3>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl font-black text-[#ff66b2]">{item.price}</span>
                  <button className="bg-white/5 hover:bg-[#ff66b2] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90">Satın Al</button>
                </div>
              </div>
              {/* Animated Glow on Hover */}
              <div className="absolute inset-0 border border-[#ff66b2]/0 group-hover:border-[#ff66b2]/20 rounded-2xl transition-all pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-6xl mx-auto bg-[#ff66b2]/5 border border-[#ff66b2]/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#ff66b2] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">Kendi Kodunu Bozdur!</h2>
                 <p className="text-sm text-white/40 font-bold">Kullanılmamış dijital kodlarını Topluyo Bakiyesine çevir.</p>
              </div>
           </div>
           <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#ff66b2] hover:text-white transition-all shadow-xl">Hemen Başla</button>
        </div>
      </div>
    </div>
  );
};

export default StoreArea;
