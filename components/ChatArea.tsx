
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageType, User } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ChatAreaProps {
  channelId: string;
  user: User;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Kanal değiştiğinde mesajları temizle (demo olduğu için)
  useEffect(() => {
    setMessages([]);
  }, [channelId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
        { botIdx: 5, text: "Ben hazırım aga. Mouse hassasiyetini falan ayarladım, bu sefer o kupayı Topluyo HQ'ya getireceğiz!" }
      ],
      [
        { botIdx: 6, text: "Yayındayım! Gelin de iki sohbetin belini kıralım. Yeni mikrofonu deniyoruz." },
        { botIdx: 0, text: "Hayırlı olsun reis, sesin ipek gibi geliyor valla." }
      ]
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const conv = detailedConversations[Math.floor(Math.random() * detailedConversations.length)];
        conv.forEach((step, i) => {
          setTimeout(() => {
            const bot = bots[step.botIdx];
            const botMsg: Message = {
              id: 'bot-' + Date.now() + '-' + i,
              userId: bot.id,
              content: step.text,
              type: MessageType.TEXT,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev.slice(-99), botMsg]);
          }, i * 2500);
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (val: string, type: MessageType = MessageType.TEXT, mediaUrl?: string) => {
    if (!val.trim() && !mediaUrl) return;
    
    playCyberSound('send');
    const userMessage: Message = { 
      id: Date.now().toString(), 
      userId: user.id, 
      content: val, 
      type: type,
      mediaUrl: mediaUrl,
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); // Inputu sıfırla

    // 5651 COMMAND
    if (val.trim() === '/5651') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'bot-5651-' + Date.now(),
          userId: 'bot-system',
          content: '(akp ve chp arasında fark kalmadı tüm tanrılar yardımcımız olsun)',
          type: MessageType.TEXT,
          timestamp: new Date()
        }]);
        playCyberSound('pop');
      }, 500);
    }

    if (val.startsWith('!oynat')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'bot-music-reply-' + Date.now(),
          userId: 'bot-music',
          content: '🎵 Oynatılıyor: Rick Astley - Never Gonna Give You Up. Ses seviyesi %100.',
          type: MessageType.TEXT,
          timestamp: new Date()
        }]);
      }, 800);
    }

    // SALE BOT INTEGRATION
    if (val.toLowerCase().trim() === '/sale') {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "SteamDB verilerine dayanarak popüler indirimli oyunları bul. SADECE şu formatta bir liste döndür: Oyun İsmi - Fiyat - İndirim Oranı. Başka hiçbir metin, açıklama veya kaynak ekleme. Çok sade olsun.",
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const salesContent = response.text || 'İndirim verisi bulunamadı.';

        setMessages(prev => [...prev, {
          id: 'bot-sale-' + Date.now(),
          userId: 'bot-sale',
          content: salesContent,
          type: MessageType.TEXT,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, {
          id: 'bot-sale-error-' + Date.now(),
          userId: 'bot-sale',
          content: '❌ Veri çekme hatası: SteamDB bağlantısı kurulamadı.',
          type: MessageType.TEXT,
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
      }
    }

    if (val.toLowerCase().startsWith('/topluyo')) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: val.replace('/topluyo', '').trim() || 'Merhaba!',
          config: { systemInstruction: 'Sen Topluyo asistanısın. Punk ruhlu konuş.' },
        });
        setMessages(prev => [...prev, { 
          id: 'ai-' + Date.now(), 
          userId: 'topluyo-ai', 
          content: response.text || 'Protocol Error...', 
          type: MessageType.TEXT,
          timestamp: new Date() 
        }]);
      } catch (err) { console.error(err); } finally { setIsTyping(false); }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const type = file.type.startsWith('video') ? MessageType.VIDEO : MessageType.IMAGE;
      handleSendMessage('', type, base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const playCyberSound = (type: 'pop' | 'send' | 'click') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'send') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      } else if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(2400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      } else {
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      }
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#110524]">
      {/* Protocol Banner */}
      <div className="h-8 bg-[#ff00ff]/10 flex items-center justify-center border-b border-[#ff00ff]/20 shrink-0">
         <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic animate-pulse">
           CONNECTED AS: {user.username.toUpperCase()} // STATUS: AUTHORIZED
         </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
         {messages.length === 0 && (
           <div className="opacity-10 py-20 flex flex-col items-start reveal-item">
             <h2 className="text-8xl font-[1000] text-white italic tracking-tighter uppercase animate-shiny">DATA_FEED</h2>
             <p className="text-[12px] font-black text-[#00ffff] uppercase tracking-[0.5em]">KANAL AKIŞI BAŞLATILDI</p>
           </div>
         )}
         {messages.map((m, idx) => {
           const isMe = m.userId === user.id;
           const isAI = m.userId === 'topluyo-ai';
           const isBot = m.userId.startsWith('bot-');
           const isSaleBot = m.userId === 'bot-sale';
           
           return (
             <div key={m.id} className="group flex gap-4 reveal-item" style={{ animationDelay: `${idx * 0.02}s` }}>
               <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10 shadow-lg ${isAI || isSaleBot ? 'bg-[#ff00ff]' : (isBot || isMe) ? 'bg-[#1e1135] overflow-hidden' : 'bg-purple-900'}`}>
                  {isAI ? '🤖' : isSaleBot ? '🏷️' : (isBot || isMe) ? <img src={isMe ? user.avatar : `https://picsum.photos/seed/${m.userId}/40/40`} className="w-full h-full object-cover" alt="" /> : <div className="text-xl">👤</div>}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className={`text-xs font-black uppercase italic tracking-tight ${isAI || isSaleBot ? 'text-[#ff00ff]' : isBot ? 'text-[#00ffff]' : 'text-purple-300'}`}>
                     {isAI ? 'TOPLUYO AI' : isSaleBot ? 'SALE_BOT' : isBot ? 'SİSTEM_BOT' : user.username}
                   </span>
                   <span className="text-[9px] text-white/20 font-black">{m.timestamp.toLocaleTimeString()}</span>
                 </div>
                 
                 {m.type === MessageType.TEXT && (
                   <p className="text-sm text-white/80 leading-relaxed font-medium transition-all group-hover:text-white whitespace-pre-wrap">{m.content}</p>
                 )}
                 
                 {m.mediaUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border-2 border-white/5 max-w-sm shadow-2xl">
                      {m.type === MessageType.VIDEO ? <video src={m.mediaUrl} controls className="w-full" /> : <img src={m.mediaUrl} className="w-full" alt="" />}
                    </div>
                 )}
               </div>
             </div>
           );
         })}
         {isTyping && <div className="text-[10px] font-black text-[#ff00ff] animate-pulse ml-14 uppercase tracking-widest italic">AĞDAN VERİ ÇEKİLİYOR...</div>}
      </div>

      <div className="p-6 shrink-0">
         <div className="relative group/input flex items-center bg-[#05010a] border-4 border-white/5 shadow-2xl">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
            />
            
            <button 
              onClick={() => { playCyberSound('click'); fileInputRef.current?.click(); }}
              className="p-4 text-white/20 hover:text-[#00ffff] transition-colors"
              title="Yükle"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </button>

            <input 
              className="flex-1 bg-transparent py-5 px-2 text-white font-black placeholder-white/5 outline-none uppercase tracking-wider"
              placeholder="MESAJ GÖNDER // /sale // /topluyo // /5651"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(inputValue);
              }}
            />

            <div className="flex items-center pr-4 gap-2">
              <button 
                onClick={() => handleSendMessage(inputValue)}
                className="bg-[#ff00ff] text-white px-6 py-2 rounded-sm font-[1000] uppercase italic tracking-tighter text-xs shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                GÖNDER
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatArea;
