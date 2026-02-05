
import React from 'react';

const NitroArea: React.FC = () => {
  const perks = [
    { icon: '🎨', title: 'Holografik Profil', desc: 'Avatarına ve bannerına hareketli efektler ekle.' },
    { icon: '🚀', title: '4K Yayın Kalitesi', desc: 'Arkadaşlarına kristal netliğinde ekran paylaş.' },
    { icon: '💎', title: 'Özel Emojiler', desc: 'Tüm sunucularda kendi emojilerini kullan.' },
    { icon: '📨', title: '500MB Yükleme', desc: 'Dosya boyutu sınırlarını ortadan kaldır.' },
  ];

  const plans = [
    { name: 'Basic', price: '₺29.99', perks: ['Özel Emojiler', '100MB Yükleme'], color: 'from-blue-500 to-cyan-500' },
    { name: 'Topluyo Pro', price: '₺79.99', perks: ['4K Yayın', 'Holografik Profil', '500MB Yükleme'], color: 'from-pink-500 to-purple-600', recommended: true },
    { name: 'Elite', price: '₺149.99', perks: ['Tüm Özellikler', 'Kurucu Rozeti', 'Öncelikli Destek'], color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-y-auto no-scrollbar selection:bg-[#ff00ff] selection:text-white relative">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#ff00ff]/10 to-transparent pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-12 text-center">
        <div className="mb-8 inline-block animate-float">
           <div className="w-24 h-24 bg-gradient-to-tr from-[#ff00ff] to-[#00ffff] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,0,255,0.4)] border-4 border-white transform rotate-6">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
           </div>
        </div>
        <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-tight mb-4 reveal-item">
           DİJİTAL <span className="animate-shiny">GÜCÜNÜ</span> <br /> SERBEST BIRAK
        </h1>
        <p className="max-w-xl mx-auto text-white/40 font-bold italic reveal-item" style={{ animationDelay: '0.1s' }}>
          Topluyo Nitro ile sınırları zorla. Daha fazla özellik, daha fazla özgürlük ve tamamen kişiselleştirilmiş bir deneyim seni bekliyor.
        </p>
      </section>

      {/* Perks Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12 mb-24 reveal-item" style={{ animationDelay: '0.2s' }}>
        {perks.map((perk, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all group">
             <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{perk.icon}</div>
             <h3 className="text-xl font-[1000] text-white uppercase italic tracking-tight mb-2">{perk.title}</h3>
             <p className="text-sm text-white/30 font-medium leading-relaxed">{perk.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing Plans */}
      <section className="px-12 pb-32 reveal-item" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter mb-12 text-center">PLANINI SEÇ</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {plans.map((plan, i) => (
             <div key={i} className={`relative group/card bg-black border-4 transition-all duration-500 p-10 rounded-3xl ${plan.recommended ? 'border-[#ff00ff] scale-105 shadow-[0_0_50px_rgba(255,0,255,0.15)]' : 'border-white/5 hover:border-white/20'}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff00ff] text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white">En Popüler</div>
                )}
                
                <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-5xl font-[1000] text-white animate-shiny">{plan.price}</span>
                   <span className="text-white/20 font-black uppercase text-[10px]">/ AY</span>
                </div>

                <div className="space-y-4 mb-12">
                   {plan.perks.map((p, j) => (
                     <div key={j} className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-xs font-bold text-white/60 uppercase">{p}</span>
                     </div>
                   ))}
                </div>

                <button className={`w-full py-5 rounded-xl font-[1000] uppercase italic tracking-tighter transition-all shadow-xl bg-gradient-to-r ${plan.color} text-white hover:brightness-110 active:scale-95`}>
                   Abone Ol
                </button>
             </div>
           ))}
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent opacity-30" />
    </div>
  );
};

export default NitroArea;
