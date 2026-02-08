
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, MessageType, Member } from '../types';
import { GoogleGenAI } from "@google/genai";

interface QuickChatProps {
  currentUser: User;
  recipient: Member | User;
  onClose: () => void;
}

const QuickChat: React.FC<QuickChatProps> = ({ currentUser, recipient, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Bildirim sesi fonksiyonu
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: inputValue,
      type: MessageType.TEXT,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');

    // Eğer alıcı bir bot ise (veya bot simülasyonu yapıyorsak)
    if (recipient.username.toLowerCase().includes('bot') || recipient.id.startsWith('bot-') || recipient.username === 'Topluyo_Bot') {
      setIsTyping(true);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: currentInput,
          config: {
            systemInstruction: `Sen ${recipient.username} isminde bir yardım botusun. Topluyo platformunda kullanıcılara kısa ve cyberpunk ruhuna uygun cevaplar veriyorsun.`,
          },
        });

        setTimeout(() => {
          const botMsg: Message = {
            id: 'bot-' + Date.now(),
            userId: recipient.id,
            content: response.text || 'Protocol Error: Data missing.',
            type: MessageType.TEXT,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMsg]);
          setIsTyping(false);
          playNotificationSound();
        }, 1000);
      } catch (err) {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[450px] bg-[#05010a] border-2 border-[#ff00ff]/30 shadow-[0_0_30px_rgba(255,0,255,0.2)] flex flex-col z-[1000] reveal-item animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="h-12 bg-[#110524] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase italic tracking-widest truncate max-w-[150px]">
            DM: {recipient.username}
          </span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-[#ff00ff] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#0b0314]">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Güvenli Bağlantı Kuruldu</p>
            <p className="text-[8px] italic">E2E ENCRYPTED // NODE_42</p>
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.userId === currentUser.id;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${isMe ? 'bg-[#ff00ff]/10 text-white border-r-2 border-[#ff00ff]' : 'bg-white/5 text-purple-200 border-l-2 border-[#00ffff]'}`}>
                {m.content}
              </div>
              <span className="text-[8px] text-white/10 mt-1 font-black uppercase italic">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        {isTyping && (
          <div className="text-[8px] font-black text-[#00ffff] animate-pulse uppercase tracking-widest italic">
            {recipient.username.toUpperCase()} YAZIYOR...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#110524] border-t border-white/5">
        <div className="relative flex items-center bg-[#05010a] border border-white/10 p-1">
          <input 
            className="flex-1 bg-transparent py-2 px-2 text-[11px] text-white font-bold outline-none uppercase placeholder-white/5"
            placeholder="Mesaj..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-[#ff00ff] text-white px-3 py-1 text-[9px] font-black uppercase italic tracking-tighter hover:scale-105 transition-all"
          >
            GÖNDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickChat;
