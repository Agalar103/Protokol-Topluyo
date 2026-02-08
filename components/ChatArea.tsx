
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageType, User } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ChatAreaProps {
  channelId: string;
  user: User;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
}

const BOT_DATA = [
  { 
    id: 'bot-elraenn', 
    username: 'Elraenn_Bot', 
    avatar: 'https://picsum.photos/seed/elraenn/40/40', 
    gifs: [
      'https://media1.tenor.com/m/Y7vM0Ym6V1kAAAAC/elraenn-tu%C4%9Fkan.gif',
      'https://media1.tenor.com/m/5U7zBIn_184AAAAd/elraenn.gif'
    ]
  },
  { 
    id: 'bot-jaho', 
    username: 'Jaho_Bot', 
    avatar: 'https://picsum.photos/seed/jaho/40/40',
    gifs: [
      'https://media1.tenor.com/m/kE5n-5D7-kYAAAAd/jahrein-jahrein-yay%C4%B1n.gif',
      'https://media1.tenor.com/m/X6oB9u2Qx9wAAAAd/jahrein-yay%C4%B1n.gif'
    ]
  },
  { 
    id: 'bot-wtcn', 
    username: 'Ferit_Bot', 
    avatar: 'https://picsum.photos/seed/wtcn/40/40',
    gifs: [
      'https://media1.tenor.com/m/YI56oN72I48AAAAC/ferit-wtcn.gif',
      'https://media1.tenor.com/m/V9M-N6V_7t0AAAAC/wtcn-wtcn-dans.gif'
    ]
  },
  { 
    id: 'bot-kemal', 
    username: 'Kemal_Bot', 
    avatar: 'https://picsum.photos/seed/kemal/40/40',
    gifs: [
      'https://media1.tenor.com/m/fUv_G2hW9eMAAAAd/kemal-can-parlak-kendine-m%C3%BCzisyen.gif',
      'https://media1.tenor.com/m/0-uS9R9p6UoAAAAd/kemal-can-parlak-kendine-m%C3%BCzisyen.gif'
    ]
  },
  { 
    id: 'bot-pelin', 
    username: 'Pqueen_Bot', 
    avatar: 'https://picsum.photos/seed/pelin/40/40',
    gifs: [
      'https://media1.tenor.com/m/G6u7K6z7B_YAAAAd/pqueen-pqueen-dans.gif',
      'https://media1.tenor.com/m/x3-S9_U3-1YAAAAd/pqueen-yay%C4%B1n.gif'
    ]
  }
];

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, user, messages, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const runDemoChat = async () => {
    const scripts = [
      { botId: 'bot-elraenn', text: "Beyler agalarla geçen gün bir kamp yaptık ormanda, siber ağlardan uzak. Ulan diyorum kendi kendime, bu Topluyo niye bu kadar akıcı? Meğer arkada p*nk ruhlu adamlar çalışıyormuş. Agalar, ortamın kalitesi gerçekten arşa çıkmış." },
      { botId: 'bot-jaho', text: "Tuğkan, orman falan güzel de... X (Twitter) gündemini gördün mü? Yine o 'malum' yayıncılar bir yerlerden drama kasmaya çalışıyor. 2025 yılına gelmişiz, adam hala frame loss (kare kaybı) yaşıyor. Ulan ben burada 8K yayın açıyorum Topluyo üzerinden, tık demiyor sistem. Ama şu ekonomi... Steam kodları zamlanmadan Nos Market'ten stok yapın benden söylemesi.", gifIdx: 0 },
      { botId: 'bot-wtcn', text: "Jaho kanka sakin ol ya. Ferit girdi odaya! Beyler Valorant'ta yeni bir meta başlıyor, Topluyo'daki pro-hub kanalında taktikleri paylaştım. Bu arada şu 48 saat olayı harika, maç planlarını yapıyoruz sonra puff! Data yok oluyor. Kimse bizi izleyemez.", gifIdx: 0 },
      { botId: 'bot-kemal', text: "LAN! NE METASI? S*KEYİM METANIZI! Sesim neden bu kadar yüksek geliyor l*n? Ferit, s*ktir git vp'ni al da gel, benim ses kartı yine p*ç oldu ağlayacağım şimdi a*k! Pqueen, şu yayını aç da iki dans et de moralimiz düzelsin s*ktir git ya!", gifIdx: 1 },
      { botId: 'bot-pelin', text: "KEMAL! Bağırma şu çocuğun kulağına valla terlikle gelirim oraya! Selam pqueen_bot geldi! Ayol beyler, Jaho'nun bahsettiği o drama yayını neydi öyle? Ben izlerken utançtan koltuğun altına girdim. Neyse, Topluyo'nun bu pembe teması beni benden alıyor!", gifIdx: 0 },
      { botId: 'bot-jaho', text: "Pelin, dansı bırak da şu habere bak. SteamDB'de gördüm, Cyberpunk 2077 yine %90 indirime girmiş. Ulan almayan kaldı mı hala? Alın l*n, bari kütüphanede dursun. Ama sorsan 'Jaho yine oyun eleştiriyor'. Eleştiririm tabii s*ktir git!", gifIdx: 1 },
      { botId: 'bot-kemal', text: "S*TIRIM HABERİNİ! Ben gidiyorum a*k, ses kartını camdan aşağı atacağım şimdi. Kaos her zaman kazanır beyler, s*ktir edin her şeyi!", gifIdx: 0 },
      { botId: 'bot-elraenn', text: "Agalar, Kemal'in tansiyonu fırladı yine. Akşam bir çay demleyelim de sesli kanalda şu gıybetin dibine bir vuralım. Jaho, sen de gel de şu yeni siber yasaları bir eleştir, özledik o gurme yorumlarını.", gifIdx: 1 }
    ];

    for (const script of scripts) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
      const bot = BOT_DATA.find(b => b.id === script.botId);
      if (bot) {
        onSendMessage({
          id: 'demo-txt-' + Date.now() + Math.random(),
          userId: bot.id,
          content: script.text,
          type: MessageType.TEXT,
          timestamp: new Date()
        });
        if (script.gifIdx !== undefined) {
          await new Promise(r => setTimeout(r, 1200));
          onSendMessage({
            id: 'demo-gif-' + Date.now() + Math.random(),
            userId: bot.id,
            mediaUrl: bot.gifs?.[script.gifIdx],
            type: MessageType.GIF,
            timestamp: new Date()
          });
        }
      }
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (val: string, type: MessageType = MessageType.TEXT, mediaUrl?: string) => {
    if (!val.trim() && !mediaUrl) return;

    const cmd = val.trim().toLowerCase();
    
    if (cmd === '/demo') {
      onSendMessage({ id: 'cmd-' + Date.now(), userId: user.id, content: '/demo - Otonom Streamer-Protocol v5.0 Aktif...', type: MessageType.TEXT, timestamp: new Date() });
      setInputValue('');
      runDemoChat();
      return;
    }

    if (cmd === '/5651') {
      setInputValue('');
      onSendMessage({ 
        id: 'sys-' + Date.now(), 
        userId: 'system', 
        content: "⚠️ (AKP ve CHP arasinda fark kalmadi tüm tanrilar yardimcimiz olsun) // 5651 Sayili Kanun Uyarinca Log Kayitlari Baslatilmistir.", 
        type: MessageType.TEXT, 
        timestamp: new Date() 
      });
      return;
    }

    if (cmd === '/sale') {
      setInputValue('');
      setIsTyping(true);
      // SteamDB Simulated Feed
      setTimeout(() => {
        onSendMessage({ 
          id: 'sale-' + Date.now(), 
          userId: 'bot-jaho', 
          content: `📊 **STEAMDB FLAŞ İNDİRİM RAPORU** 📊\n\n🔹 **Elden Ring:** ₺499 (%30 İndirim)\n🔹 **Red Dead Redemption 2:** ₺320 (%67 İndirim)\n🔹 **Cyberpunk 2077:** ₺240 (%90 İndirim)\n\n🚀 Nos Market üzerinden %5 ekstra indirimle alabilirsiniz!`, 
          type: MessageType.TEXT, 
          timestamp: new Date() 
        });
        setIsTyping(false);
      }, 1500);
      return;
    }

    const now = Date.now();
    if (now - lastMessageTime < 500) {
      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), 2000);
      return;
    }
    setLastMessageTime(now);
    
    const userMessage: Message = { id: Date.now().toString(), userId: user.id, content: val, type: type, mediaUrl: mediaUrl, timestamp: new Date() };
    onSendMessage(userMessage);
    setInputValue('');

    if (val.toLowerCase().startsWith('/topluyo')) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: val.replace('/topluyo', '').trim() || 'Merhaba!',
          config: { systemInstruction: 'Sen Topluyo asistanısın. Kemal Can Parlak gibi küfürlü, Jaho gibi eleştirel bir yayıncı ağzıyla konuş.' },
        });
        onSendMessage({ id: 'ai-' + Date.now(), userId: 'topluyo-ai', content: response.text || 'Data corrupted...', type: MessageType.TEXT, timestamp: new Date() });
      } catch (err) { console.error(err); } finally { setIsTyping(false); }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleSendMessage('', file.type.startsWith('video') ? MessageType.VIDEO : MessageType.IMAGE, reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#110524] relative">
      {isThrottled && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
           <div className="bg-red-600 text-white px-6 py-2 border-2 border-white shadow-[0_0_20px_rgba(255,0,0,0.5)] font-[1000] text-[10px] uppercase italic tracking-[0.3em]">SYSTEM_COOLDOWN: SEKTİRİCİ AKTİF</div>
        </div>
      )}

      <div className="h-8 bg-[#ff00ff]/10 flex items-center justify-center border-b border-[#ff00ff]/20 shrink-0">
         <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic animate-pulse">
           CONNECTED AS: {user.username.toUpperCase()} // /demo - /5651 - /sale
         </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
         {messages.length === 0 && (
           <div className="opacity-10 py-20 flex flex-col items-start reveal-item">
             <h2 className="text-8xl font-[1000] text-white italic tracking-tighter uppercase animate-shiny">DATA_FEED</h2>
             <p className="text-[12px] font-black text-[#00ffff] uppercase tracking-[0.5em]">KANAL AKIŞI BAŞLATILDI // /demo YAZARAK DRAMAYI BAŞLAT</p>
           </div>
         )}
         {messages.map((m) => (
           <div key={m.id} className="group flex gap-4 reveal-item">
             <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10 shadow-lg bg-[#1e1135] overflow-hidden">
                <img src={m.userId === user.id ? user.avatar : (BOT_DATA.find(b => b.id === m.userId)?.avatar || (m.userId === 'system' ? 'https://picsum.photos/seed/sys/40/40' : `https://picsum.photos/seed/${m.userId}/40/40`))} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-black uppercase italic tracking-tight text-purple-300">
                   {m.userId === user.id ? user.username : (BOT_DATA.find(b => b.id === m.userId)?.username || (m.userId === 'system' ? 'AĞ_YÖNETİMİ' : 'AI_NODE'))}
                 </span>
                 <span className="text-[9px] text-white/20 font-black">{new Date(m.timestamp).toLocaleTimeString()}</span>
               </div>
               {m.type === MessageType.GIF || m.type === MessageType.IMAGE ? (
                 <div className="relative inline-block mt-2">
                   <img src={m.mediaUrl} className="max-w-md rounded-lg border-2 border-[#ff00ff]/40 shadow-2xl transition-all hover:scale-[1.02]" alt="" />
                   <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-[#ff00ff] text-[8px] font-black uppercase tracking-widest rounded italic">SİBER_GIF</div>
                 </div>
               ) : (
                 <p className={`text-sm leading-relaxed font-medium transition-all group-hover:text-white whitespace-pre-wrap ${m.userId === 'system' ? 'text-red-400 font-black italic border-l-2 border-red-500 pl-3 bg-red-500/5 py-2' : 'text-white/80'}`}>{m.content}</p>
               )}
             </div>
           </div>
         ))}
         {isTyping && <div className="text-[10px] font-black text-[#ff00ff] animate-pulse ml-14 uppercase tracking-widest italic">AĞDAN VERİ ÇEKİLİYOR...</div>}
      </div>

      <div className="p-6 shrink-0">
         <div className={`relative group/input flex items-center bg-[#05010a] border-4 shadow-2xl transition-all ${isThrottled ? 'border-red-600 opacity-50' : 'border-white/5'}`}>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            <button disabled={isThrottled} onClick={() => fileInputRef.current?.click()} className="p-4 text-white/20 hover:text-[#00ffff] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </button>
            <input 
              disabled={isThrottled}
              className="flex-1 bg-transparent py-5 px-2 text-white font-black placeholder-white/5 outline-none uppercase tracking-wider disabled:cursor-not-allowed"
              placeholder={isThrottled ? "SYSTEM_COOLDOWN_ACTIVE" : "/demo, /sale, /5651..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(inputValue); }}
            />
            <div className="flex items-center pr-4 gap-2">
              <button disabled={isThrottled} onClick={() => handleSendMessage(inputValue)} className="bg-[#ff00ff] text-white px-6 py-2 rounded-sm font-[1000] uppercase italic tracking-tighter text-xs shadow-[0_0_15px_rgba(255,0,255,0.4)]">GÖNDER</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatArea;
