
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

  // Enhanced bot message simulation
  useEffect(() => {
    const bots = [
      { name: 'NeonBot', content: 'Selam millet! Bugün kimler online?', userId: 'bot-1', color: 'text-pink-500' },
      { name: 'CyberPunker', content: 'Topluyo markete yeni VP kodları gelmiş beyler, kaçırmayın.', userId: 'bot-2', color: 'text-cyan-400' },
      { name: 'GigaChad_99', content: 'Sesli sohbetteyiz gelin takılalım.', userId: 'bot-3', color: 'text-green-400' },
      { name: 'MusicMaster', content: '!oynat https://youtube.com/watch?v=dQw4w9WgXcQ', userId: 'bot-music', color: 'text-yellow-400' },
      { name: 'KodCanavarı', content: 'Yeni temayı gören var mı? Çok punk olmuş.', userId: 'bot-4', color: 'text-purple-400' },
      { name: 'Slayer_31', content: 'Aga sunucuya yeni roller gelsin artık.', userId: 'bot-5', color: 'text-red-400' },
      { name: 'AgalarHero', content: 'Yayına geçiyorum beyler hazır olun!', userId: 'bot-6', color: 'text-orange-400' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.6) { 
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          userId: bot.userId,
          content: bot.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev.slice(-49), botMsg]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (val: string) => {
    const userMessage: Message = { id: Date.now().toString(), userId: 'me', content: val, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    // Command Simulation
    if (val.startsWith('!oynat')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'bot-music-reply-' + Date.now(),
          userId: 'bot-music',
          content: '🎵 Oynatılıyor: Rick Astley - Never Gonna Give You Up',
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
          config: { systemInstruction: 'Sen Topluyo asistanısın. Punk ruhlu, kısa ve öz konuş. Kullanıcılara yardımcı ol.' },
        });
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), userId: 'topluyo-ai', content: response.text || 'Error...', timestamp: new Date() }]);
      } catch (err) { console.error(err); } finally { setIsTyping(false); }
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
                {m.userId === 'topluyo-ai' ? '🤖' : m.userId.startsWith('bot-') ? <img src={`https://picsum.photos/seed/${m.userId}/40/40`} className="w-full h-full rounded-lg" alt="" /> : '👤'}
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
