
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ChatAreaProps {
  channelId: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Enhanced bot message simulation with conversation flows
  useEffect(() => {
    const bots = [
      { name: 'NeonBot', id: 'bot-1', icon: '⚡' },
      { name: 'CyberPunker', id: 'bot-2', icon: '🎸' },
      { name: 'GigaChad_99', id: 'bot-3', icon: '💪' },
      { name: 'MusicMaster', id: 'bot-music', icon: '🎵' },
      { name: 'KodCanavarı', id: 'bot-4', icon: '💻' },
      { name: 'Slayer_31', id: 'bot-5', icon: '🔥' },
      { name: 'AgalarHero', id: 'bot-6', icon: '👑' },
      { name: 'QuantumVibe', id: 'bot-7', icon: '🌀' },
      { name: 'DarkByte', id: 'bot-8', icon: '🕶️' },
    ];

    const detailedConversations = [
      [
        { botIdx: 1, text: "Beyler bu geceki turnuvaya kimler katılıyor? Ödül havuzu bayağı genişlemiş diyorlar." },
        { botIdx: 4, text: "Benim kodlarda ufak bir hata var, onu fixleyebilirsem yetişirim. Slayer sen ne durumdasın?" },
        { botIdx: 5, text: "Ben hazırım aga. Mouse hassasiyetini falan ayarladım, bu sefer o kupayı Topluyo HQ'ya getireceğiz!" },
        { botIdx: 2, text: "Aynen valla, geçen seferki gibi lag olmasın da. İnternet sağlayıcımı değiştirdim sırf bu iş için." }
      ],
      [
        { botIdx: 6, text: "Yayındayım! Gelin de iki sohbetin belini kıralım. Yeni mikrofonu deniyoruz." },
        { botIdx: 0, text: "Hayırlı olsun reis, sesin ipek gibi geliyor valla. Krisp ayarlarını nasıl yaptın?" },
        { botIdx: 6, text: "Valla Topluyo'nun kendi ses motoru yetiyor ya, ekstradan bir şeye gerek kalmadı." }
      ],
      [
        { botIdx: 7, text: "Marketten aldığım yeni banner nasıl duruyor sizce? Biraz fazla mı neon oldu?" },
        { botIdx: 8, text: "Bence tam kıvamında. Zaten bu platformun ruhu neon ve punk değil mi? Çok sırıtmamış." },
        { botIdx: 7, text: "Sağ ol aga, bir dahakine animasyonlu olanlardan deneyeceğim." }
      ],
      [
        { botIdx: 3, text: "Bugün 100 şınav, 100 mekik, 10km koşu... bitti. Şimdi biraz oyun zamanı." },
        { botIdx: 1, text: "Oha Giga, sen gerçek hayatta da mı kasmaya başladın artık?" },
        { botIdx: 3, text: "Sağlam kafa sağlam vücutta bulunur kardeşim. Topluyo'da bile dik duracaksın!" }
      ]
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // Higher frequency for demo
        const conv = detailedConversations[Math.floor(Math.random() * detailedConversations.length)];
        
        // Simulating a sequence
        conv.forEach((step, i) => {
          setTimeout(() => {
            const bot = bots[step.botIdx];
            const botMsg: Message = {
              id: 'bot-' + Date.now() + '-' + i,
              userId: bot.id,
              content: step.text,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev.slice(-99), botMsg]);
          }, i * 2500); // 2.5 seconds between replies in a conversation
        });
      }
    }, 15000); // New conversation starts every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (val: string) => {
    playSound('click');
    const userMessage: Message = { id: Date.now().toString(), userId: 'me', content: val, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    if (val.startsWith('!oynat')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'bot-music-reply-' + Date.now(),
          userId: 'bot-music',
          content: '🎵 Oynatılıyor: Rick Astley - Never Gonna Give You Up. Ses seviyesi %100. İyi dinlemeler Toplayıcı!',
          timestamp: new Date()
        }]);
      }, 800)
    }

    if (val.toLowerCase().startsWith('/topluyo')) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: val.replace('/topluyo', '').trim() || 'Merhaba!',
          config: { systemInstruction: 'Sen Topluyo asistanısın. Punk ruhlu, kısa ve öz konuş. Kullanıcılara yardımcı ol. Argodan kaçınma ama saygılı kal.' },
        });
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), userId: 'topluyo-ai', content: response.text || 'Error...', timestamp: new Date() }]);
      } catch (err) { console.error(err); } finally { setIsTyping(false); }
    }
  };

  // Helper function for UI sounds using Web Audio API
  const playSound = (type: 'click' | 'hover' | 'pop') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'pop') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#110524] selection:bg-[#ff00ff] selection:text-white">
      {/* 48h Deletion Banner */}
      <div className="h-8 bg-[#ff00ff]/10 flex items-center justify-center border-b border-[#ff00ff]/20 shrink-0">
         <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic animate-pulse">
           PROTOCOL ACTIVE // TÜM MESAJLAR 48 SAATTE BİR SİLİNİR // GİZLİLİK ÖNCELİĞİMİZ
         </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
         {messages.length === 0 && (
           <div className="opacity-10 py-20 flex flex-col items-start">
             <h2 className="text-8xl font-[1000] text-white italic tracking-tighter leading-none mb-4 uppercase">DATA_FEED</h2>
             <p className="text-[12px] font-black text-[#00ffff] uppercase tracking-[0.5em]">SİSTEM BAŞLATILDI // ŞİFRELİ İLETİŞİM KATMANI AKTİF</p>
           </div>
         )}
         {messages.map(m => (
           <div key={m.id} className="group flex gap-4 animate-in slide-in-from-left-2 duration-300">
             <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10 shadow-lg ${m.userId === 'topluyo-ai' ? 'bg-[#ff00ff]' : m.userId.startsWith('bot-') ? 'bg-[#1e1135]' : 'bg-purple-900'}`}>
                {m.userId === 'topluyo-ai' ? '🤖' : m.userId.startsWith('bot-') ? <img src={`https://picsum.photos/seed/${m.userId}/40/40`} className="w-full h-full rounded-lg" alt="" /> : <div className="text-xl">👤</div>}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className={`text-xs font-black uppercase italic tracking-tight ${m.userId === 'topluyo-ai' ? 'text-[#ff00ff]' : m.userId.startsWith('bot-') ? 'text-[#00ffff]' : 'text-purple-300'}`}>
                   {m.userId === 'topluyo-ai' ? 'TOPLUYO AI' : m.userId.startsWith('bot-') ? 'SİSTEM_BOT' : 'TOPLAYICI'}
                 </span>
                 <span className="text-[9px] text-white/20 font-black">{m.timestamp.toLocaleTimeString()}</span>
               </div>
               <p className="text-sm text-white/80 leading-relaxed font-medium">{m.content}</p>
             </div>
           </div>
         ))}
         {isTyping && <div className="text-[10px] font-black text-[#ff00ff] animate-pulse ml-14 uppercase tracking-widest italic">TOPLUYO_AI VERİ İŞLİYOR...</div>}
      </div>

      <div className="p-6 shrink-0">
         <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff00ff] rounded-full group-focus-within/input:animate-ping" />
            <input 
              className="w-full bg-[#05010a] border-4 border-white/5 pl-10 pr-5 py-5 text-white font-black placeholder-white/5 outline-none focus:border-[#ff00ff]/30 transition-all uppercase tracking-wider shadow-2xl"
              placeholder="MESAJ GÖNDER // !oynat link // /topluyo"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   const val = (e.target as HTMLInputElement).value;
                   if (val) {
                     handleSendMessage(val);
                     (e.target as HTMLInputElement).value = '';
                   }
                }
              }}
            />
         </div>
      </div>
    </div>
  );
};

export default ChatArea;
