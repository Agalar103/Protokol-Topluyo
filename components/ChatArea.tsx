
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
      { name: 'NeonBot', content: 'Selam millet! Bugün kimler online?', userId: 'bot-1' },
      { name: 'CyberPunker', content: 'Topluyo markete yeni VP kodları gelmiş beyler, kaçırmayın.', userId: 'bot-2' },
      { name: 'GigaChad_99', content: 'Sesli sohbetteyiz gelin takılalım.', userId: 'bot-3' },
      { name: 'MusicMaster', content: '!oynat https://youtube.com/watch?v=dQw4w9WgXcQ', userId: 'bot-music' },
      { name: 'KodCanavarı', content: 'Yeni temayı gören var mı? Çok punk olmuş.', userId: 'bot-4' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { 
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          userId: bot.userId,
          content: bot.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev.slice(-49), botMsg]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (val: string) => {
    const userMessage: Message = { id: Date.now().toString(), userId: 'me', content: val, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    if (val.toLowerCase().startsWith('/topluyo')) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: val.replace('/topluyo', '').trim() || 'Merhaba!',
          config: { systemInstruction: 'Sen Topluyo asistanısın. Punk ruhlu, kısa ve öz konuş.' },
        });
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), userId: 'topluyo-ai', content: response.text || 'Error...', timestamp: new Date() }]);
      } catch (err) { console.error(err); } finally { setIsTyping(false); }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#110524]">
      {/* 48h Deletion Banner */}
      <div className="h-8 bg-[#ff00ff]/10 flex items-center justify-center border-b border-[#ff00ff]/20 shrink-0">
         <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic animate-pulse">
           PROTOCOL ACTIVE // TÜM MESAJLAR 48 SAATTE BİR SİLİNİR // GİZLİLİK ÖNCELİĞİMİZ
         </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
         {messages.length === 0 && (
           <div className="opacity-10 py-20">
             <h2 className="text-8xl font-[1000] text-white italic tracking-tighter leading-none mb-4">DATA_FEED</h2>
             <p className="text-[12px] font-black text-[#00ffff] uppercase tracking-[0.5em]">Kanalın başlangıcı. Şifreli iletişim başladı.</p>
           </div>
         )}
         {messages.map(m => (
           <div key={m.id} className="group flex gap-4 animate-in slide-in-from-left-2 duration-300">
             <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10 ${m.userId === 'topluyo-ai' ? 'bg-[#ff00ff]' : m.userId.startsWith('bot-') ? 'bg-[#00ffff]' : 'bg-purple-900'}`}>
                {m.userId === 'topluyo-ai' ? '🤖' : m.userId.startsWith('bot-') ? '🤖' : '👤'}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className={`text-xs font-black uppercase italic tracking-tight ${m.userId === 'topluyo-ai' ? 'text-[#ff00ff]' : m.userId.startsWith('bot-') ? 'text-[#00ffff]' : 'text-purple-300'}`}>
                   {m.userId === 'topluyo-ai' ? 'TOPLUYO AI' : m.userId.startsWith('bot-') ? 'BOT_PROTOCOL' : 'TOPLAYICI'}
                 </span>
                 <span className="text-[9px] text-white/20 font-black">{m.timestamp.toLocaleTimeString()}</span>
               </div>
               <p className="text-sm text-white/80 leading-relaxed font-medium">{m.content}</p>
             </div>
           </div>
         ))}
         {isTyping && <div className="text-[10px] font-black text-[#ff00ff] animate-pulse">TOPLUYO_AI VERİ İŞLİYOR...</div>}
      </div>

      <div className="p-6 shrink-0">
         <div className="relative group/input">
            <input 
              className="w-full bg-[#05010a] border-4 border-white/5 p-5 text-white font-black placeholder-white/5 outline-none focus:border-[#ff00ff]/30 transition-all uppercase tracking-wider"
              placeholder="MESAJ GÖNDER // /TOPLUYO"
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
