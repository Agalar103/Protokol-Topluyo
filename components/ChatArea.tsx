
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageType, User } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface ChatAreaProps {
  channelId: string;
  user: User;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onOpenAdminPanel?: () => void;
  onOpenLogs?: () => void;
  onOpenReport?: () => void;
  onOpenHack?: () => void;
  onMusicCommand?: (title: string, url: string, stop?: boolean) => void;
}

// Görsel hatası durumunda kullanılacak siber avatar
const FALLBACK_AVATAR = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=system";

export const BOT_DATA = [
  // YAYINCILAR (STREAMERS) - Güvenilir picsum/dicebear kaynaklarıyla güncellendi
  { 
    id: 'bot-elraenn', 
    username: 'Elraenn', 
    avatar: 'https://picsum.photos/seed/tuqkan/400/400', 
    gifs: ['https://media.tenor.com/Y7vM0Ym6V1kAAAAC/elraenn-tu%C4%9Fkan.gif', 'https://media.tenor.com/5U7zBIn_184AAAAd/elraenn.gif'],
    youtube: 'https://www.youtube.com/watch?v=R9j6V8p6T4o'
  },
  { 
    id: 'bot-jaho', 
    username: 'Jahrein', 
    avatar: 'https://picsum.photos/seed/jaho7/400/400',
    gifs: ['https://media.tenor.com/kE5n-5D7-kYAAAAd/jahrein-jahrein-yay%C4%B1n.gif', 'https://media.tenor.com/X6oB9u2Qx9wAAAAd/jahrein-yay%C4%B1n.gif'],
    youtube: 'https://www.youtube.com/watch?v=4uP2L0kI2wM'
  },
  { 
    id: 'bot-wtcn', 
    username: 'wtcN', 
    avatar: 'https://picsum.photos/seed/ferit-wtcn/400/400',
    gifs: ['https://media.tenor.com/YI56oN72I48AAAAC/ferit-wtcn.gif', 'https://media.tenor.com/V9M-N6V_7t0AAAAC/wtcn-wtcn-dans.gif'],
    youtube: 'https://www.youtube.com/watch?v=Xh6Xv6H7K1E'
  },
  { 
    id: 'bot-kemal', 
    username: 'KendineMüzisyen', 
    avatar: 'https://picsum.photos/seed/rakun-kemal/400/400',
    gifs: ['https://media.tenor.com/fUv_G2hW9eMAAAAd/kemal-can-parlak-kendine-m%C3%BCzisyen.gif', 'https://media.tenor.com/0-uS9R9p6UoAAAAd/kemal-can-parlak-kendine-m%C3%BCzisyen.gif'],
    youtube: 'https://www.youtube.com/watch?v=F7L6X8_qVsw'
  },
  { 
    id: 'bot-pelin', 
    username: 'Pqueen', 
    avatar: 'https://picsum.photos/seed/pelin-pq/400/400',
    gifs: ['https://media.tenor.com/G6u7K6z7B_YAAAAd/pqueen-pqueen-dans.gif', 'https://media.tenor.com/x3-S9_U3-1YAAAAd/pqueen-yay%C4%B1n.gif'],
    youtube: 'https://www.youtube.com/watch?v=V9X9X9_qVsw'
  },
  // YOUTUBERLAR
  { 
    id: 'bot-baris', 
    username: 'BarışÖzcan', 
    avatar: 'https://picsum.photos/seed/barisozcan/400/400',
    youtube: 'https://www.youtube.com/watch?v=vV0f49K_pGs'
  },
  { 
    id: 'bot-ruhi', 
    username: 'RuhiÇenet', 
    avatar: 'https://picsum.photos/seed/ruhi-cenet/400/400',
    youtube: 'https://www.youtube.com/watch?v=9X9X9_qVsw'
  },
  { 
    id: 'bot-orkun', 
    username: 'OrkunIşıtmak', 
    avatar: 'https://picsum.photos/seed/orkun-isitmak/400/400',
    youtube: 'https://www.youtube.com/watch?v=Xh6Xv6H7K1E'
  },
  { 
    id: 'bot-enes', 
    username: 'EnesBatur', 
    avatar: 'https://picsum.photos/seed/enes-batur/400/400',
    youtube: 'https://www.youtube.com/watch?v=R9j6V8p6T4o'
  },
  { 
    id: 'bot-panda', 
    username: 'Pintipanda', 
    avatar: 'https://picsum.photos/seed/tuna-panda/400/400',
    youtube: 'https://www.youtube.com/watch?v=4uP2L0kI2wM'
  },
  // NORMAL KULLANICILAR
  { id: 'bot-savasci', username: 'SiberSavaşçı', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Savasci' },
  { id: 'bot-yolcu', username: 'GeceYolcusu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yolcu' },
  { id: 'bot-kodcu', username: 'KodMeraklısı', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kodcu' }
];

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, user, messages, onSendMessage, onOpenAdminPanel, onOpenLogs, onOpenReport, onOpenHack, onMusicCommand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0` : null;
  };

  const runDemoChat = async () => {
    const scripts = [
      { botId: 'bot-baris', text: "Dostlar, bugün @Topluyo ağında bir aradayız. Geleceğin topluluk mimarisi burada şekilleniyor. Tasarımın ve hızın birleştiği bu nokta muazzam değil mi? https://topluyo.com" },
      { botId: 'bot-jaho', text: "Barış abi hoşgeldin. Mimari falan güzel de, şu piyasanın halini ne yapacağız? Steam dolar oldu, Topluyo'daki Nos Market fiyatları bile daha uygun valla şaka gibi.", yt: true },
      { botId: 'bot-wtcn', text: "Abi bırak piyasayı, dün Valorant'ta attığım ace'i izleyen var mı? Ferit girdi odaya, ortalık karıştı! Linki buraya bıraktım, gurme vuruşlar var.", yt: true, gifIdx: 0 },
      { botId: 'bot-kemal', text: "LAN! NE ACE'İ? Benim ses kartı yine p*ç oldu ağlayacağım şimdi a*k! Ferit, bana acil yeni bir setup lazım yoksa kafayı yiyeceğim!", gifIdx: 1 },
      { botId: 'bot-elraenn', text: "Kemal sakinleş kardeşim, akşam bir çay demleyelim de sesli kanalda şu gıybetin dibine vuralım. Jaho sen de gel de şu yeni siber yasaları eleştir, özledik.", yt: true, gifIdx: 0 },
      { botId: 'bot-ruhi', text: "Peki ya size bu platformun arkasındaki kod yapısının saniyede 1 milyon paket işleyebildiğini söylesem? Gerçekten korkutucu bir teknoloji...", yt: true },
      { botId: 'bot-orkun', text: "Arkadaşlar siber ağda 24 saat kalma challenge yapıyoruz! Şu an gözlerim kanlanmış durumda ama Topluyo'nun arayüzü çok akıcı, kopamıyorum.", yt: true },
      { botId: 'bot-panda', text: "Yavrularım, ben burada mis gibi hikayeli oyunumu oynuyorum. Jaho'nun dramalarından uzak, huzur içindeyim. Çayınızı alın gelin.", gifIdx: 0 },
      { botId: 'bot-pelin', text: "AYOL! Kemal bağıırma şu çocuğun kulağına valla terlikle gelirim! Ben yayına geçiyorum beyler, dans edip stres atacağız.", yt: true, gifIdx: 0 },
      { botId: 'bot-yolcu', text: "Gece gece yine drama başlamış... @anan hocam şu Kemal'in sesini bir kısıverin de kulaklarımız bayram etsim." }
    ];

    for (const script of scripts) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));
      const bot = BOT_DATA.find(b => b.id === script.botId);
      if (bot) {
        let content = script.text;
        if (script.yt && bot.youtube) content += `\n${bot.youtube}`;

        onSendMessage({
          id: 'demo-txt-' + Date.now() + Math.random(),
          userId: bot.id,
          content: content,
          type: MessageType.TEXT,
          timestamp: new Date()
        });

        if (script.gifIdx !== undefined && bot.gifs) {
          await new Promise(r => setTimeout(r, 1200));
          onSendMessage({
            id: 'demo-gif-' + Date.now() + Math.random(),
            userId: bot.id,
            mediaUrl: bot.gifs[script.gifIdx],
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

    const cmdInput = val.trim();
    const cmd = cmdInput.toLowerCase();

    if (cmd === '/list') {
      setInputValue('');
      const isAnan = user.username === 'anan';
      const commonCommands = [
        "🔹 /list - Sistemdeki tüm komutları listeler.",
        "🔹 /müzik [şarkı adı/link] - Sesli kanalda müzik çalmaya başlar.",
        "🔹 /stop - Çalan müziği durdurur.",
        "🔹 /demo - Otonom yayıncı botlarını kanala çağırır ve sohbet başlatır.",
        "🔹 /sale - SteamDB flaş indirimlerini raporlar.",
        "🔹 /topluyo [mesaj] - Topluyo AI asistanı ile konuşun.",
        "🔹 /5651 - 5651 sayılı kanun loglarını başlatır (Simülasyon)."
      ];
      const adminCommands = [
        "🔸 /admin - Yönetici panelini açar.",
        "🔸 /log - Tüm kullanıcı eylemlerini (silinen mesajlar dahil) listeler.",
        "🔸 /ban [kullanıcı] perma - Belirtilen kullanıcıyı yasaklar.",
        "🔸 /uba [kullanıcı] - Kullanıcının yasağını kaldırır.",
        "🔸 /rapor - Canlı ağ haritasını ve siber saldırı durumunu açar.",
        "🔸 /hack - Sistem sızma protokolünü başlatır."
      ];

      const content = `📜 **TOPLUYO SİSTEM KOMUTLARI** 📜\n\n${commonCommands.join('\n')}${isAnan ? `\n\n🛡️ **ADMİN KOMUTLARI**\n${adminCommands.join('\n')}` : ''}`;
      
      onSendMessage({
        id: 'sys-list-' + Date.now(),
        userId: 'system',
        content,
        type: MessageType.TEXT,
        timestamp: new Date()
      });
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

    if (cmd === '/stop') {
        setInputValue('');
        if (onMusicCommand) onMusicCommand('', '', true);
        onSendMessage({
            id: 'm-stop-' + Date.now(),
            userId: 'system',
            content: "⏹️ Müzik durduruldu ve Master Bot terminalden ayrıldı.",
            type: MessageType.TEXT,
            timestamp: new Date()
        });
        return;
    }

    if (cmd.startsWith('/müzik')) {
        const query = cmdInput.replace('/müzik', '').trim();
        setInputValue('');
        if (!query) return;

        setIsTyping(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `User wants to play music: "${query}". 
            If it's a youtube link, return that link. 
            If it's a song name, return a likely YouTube Watch URL for it (like https://www.youtube.com/watch?v=dQw4w9WgXcQ).
            Return only valid JSON in this format: {"title": "Song Title", "url": "Youtube URL"}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { 
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING }
                        }
                    }
                }
            });

            const musicData = JSON.parse(response.text || '{}');
            if (musicData.url && onMusicCommand) {
                onMusicCommand(musicData.title, musicData.url);
                onSendMessage({
                    id: 'm-play-' + Date.now(),
                    userId: 'bot-wtcn',
                    content: `🎶 **Master Bot Sesli Kanala Giriş Yaptı!**\nOynatılıyor: **${musicData.title}**\n${musicData.url}`,
                    type: MessageType.TEXT,
                    timestamp: new Date()
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsTyping(false);
        }
        return;
    }

    const isAnan = user.username === 'anan';
    
    if (cmd.startsWith('/')) {
      if (!isAnan && !['/müzik', '/stop', '/5651', '/list', '/demo', '/sale', '/topluyo'].includes(cmd.split(' ')[0])) {
        setInputValue('');
        onSendMessage({
          id: 'error-' + Date.now(),
          userId: 'system',
          content: `❌ HATA: '${cmdInput}' komutu için yetkiniz bulunmamaktadır. Bu komut sadece 'anan' adlı yöneticiye özeldir.`,
          type: MessageType.TEXT,
          timestamp: new Date()
        });
        return;
      }

      if (cmd === '/log') {
        setInputValue('');
        if (onOpenLogs) onOpenLogs();
        return;
      }

      if (cmd === '/hack') {
        setInputValue('');
        onSendMessage({
          id: 'sys-' + Date.now(),
          userId: 'system',
          content: "🏴‍☠️ SYSTEM_BREACH_PROTOCOL: EXECUTING... ROOT_ACCESS_GRANTED.",
          type: MessageType.TEXT,
          timestamp: new Date()
        });
        if (onOpenHack) onOpenHack();
        return;
      }

      if (cmd === '/rapor') {
        setInputValue('');
        onSendMessage({ 
          id: 'sys-' + Date.now(), 
          userId: 'system', 
          content: "🛡️ AĞ_TARA_PROTOKOLÜ: Başlatılıyor... SHIELD_NODE v5.1 Aktif. Bağlantı haritası oluşturuluyor.", 
          type: MessageType.TEXT, 
          timestamp: new Date() 
        });
        if (onOpenReport) onOpenReport();
        return;
      }

      if (cmd === '/ban') {
        setInputValue('');
        if (onOpenAdminPanel) onOpenAdminPanel();
        return;
      }

      if (cmd.startsWith('/ban ')) {
        const parts = cmdInput.split(' ');
        if (parts.length >= 3 && parts[parts.length - 1].toLowerCase() === 'perma') {
          const targetNick = parts.slice(1, -1).join(' ');
          const bans = JSON.parse(localStorage.getItem('topluyo_banlist') || '[]');
          if (!bans.includes(targetNick)) {
            bans.push(targetNick);
            localStorage.setItem('topluyo_banlist', JSON.stringify(bans));
          }
          setInputValue('');
          onSendMessage({
            id: 'sys-ban-' + Date.now(),
            userId: 'system',
            content: `anan adlı yönetim şu kullanıcıyı perma ban attı başarıyla: ${targetNick}`,
            type: MessageType.TEXT,
            timestamp: new Date()
          });
          return;
        }
      }

      if (cmd.startsWith('/uba ')) {
        const targetNick = cmdInput.slice(5).trim();
        let bans = JSON.parse(localStorage.getItem('topluyo_banlist') || '[]');
        if (bans.includes(targetNick)) {
          bans = bans.filter((b: string) => b !== targetNick);
          localStorage.setItem('topluyo_banlist', JSON.stringify(bans));
          setInputValue('');
          onSendMessage({
            id: 'sys-unban-' + Date.now(),
            userId: 'system',
            content: `anan adlı yönetim şu kullanıcının banını açtı başarıyla: ${targetNick}`,
            type: MessageType.TEXT,
            timestamp: new Date()
          });
          return;
        }
      }

      if (cmd === '/demo') {
        onSendMessage({ id: 'cmd-' + Date.now(), userId: user.id, content: '/demo - Otonom Streamer & YouTuber v8.0 Protokolü Aktif...', type: MessageType.TEXT, timestamp: new Date() });
        setInputValue('');
        runDemoChat();
        return;
      }

      if (cmd === '/admin') {
        setInputValue('');
        if (onOpenAdminPanel) onOpenAdminPanel();
        return;
      }

      if (cmd === '/sale') {
        setInputValue('');
        setIsTyping(true);
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

      if (cmd.startsWith('/topluyo')) {
        setIsTyping(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: cmdInput.replace('/topluyo', '').trim() || 'Merhaba!',
            config: { systemInstruction: 'Sen Topluyo asistanısın. Kemal Can Parlak gibi küfürlü, Jaho gibi eleştirel bir yayıncı ağzıyla konuş.' },
          });
          onSendMessage({ id: 'ai-' + Date.now(), userId: 'topluyo-ai', content: response.text || 'Data corrupted...', type: MessageType.TEXT, timestamp: new Date() });
        } catch (err) { console.error(err); } finally { setIsTyping(false); }
        setInputValue('');
        return;
      }
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleSendMessage('', file.type.startsWith('video') ? MessageType.VIDEO : MessageType.IMAGE, reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderMessageContent = (m: Message) => {
    if (m.type === MessageType.GIF || m.type === MessageType.IMAGE) {
      return (
        <div className="relative inline-block mt-2">
          <img 
            src={m.mediaUrl} 
            className="max-w-md rounded-lg border-2 border-[#ff00ff]/40 shadow-2xl transition-all hover:scale-[1.02] bg-black/20" 
            alt="media"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=GIF_LOAD_ERROR')}
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-[#ff00ff] text-[8px] font-black uppercase tracking-widest rounded italic">SİBER_MEDYA</div>
        </div>
      );
    }

    if (m.type === MessageType.VIDEO && m.mediaUrl) {
       return (
         <video src={m.mediaUrl} controls className="max-w-md rounded-lg border-2 border-[#00ffff]/40 mt-2 shadow-2xl" />
       );
    }

    const ytUrl = m.content ? m.content.match(/(https?:\/\/[^\s]+youtube[^\s]+|https?:\/\/youtu\.be\/[^\s]+)/) : null;
    const embedUrl = ytUrl ? getYouTubeEmbedUrl(ytUrl[0]) : null;

    const parseText = (text: string) => {
      const parts = text.split(/(\s+)/);
      return parts.map((part, i) => {
        if (part.match(/^https?:\/\//)) {
          return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline cursor-pointer">{part}</a>;
        }
        if (part.startsWith('@') && part.length > 1) {
          return <span key={i} className="text-red-500 font-black italic hover:bg-red-500/10 rounded px-1 cursor-help">{part}</span>;
        }
        return <span key={i} className="text-white">{part}</span>;
      });
    };

    return (
      <div className="space-y-3">
        <div className={`text-sm leading-relaxed font-medium transition-all group-hover:text-white whitespace-pre-wrap ${m.userId === 'system' ? 'text-red-400 font-black italic border-l-2 border-red-500 pl-3 bg-red-500/5 py-2' : 'text-white'}`}>
           {m.content ? parseText(m.content) : null}
        </div>
        {embedUrl && (
          <div className="mt-3 aspect-video w-full max-w-lg border-4 border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  };

  const getAvatar = (userId: string) => {
    if (userId === user.id) return user.avatar;
    const bot = BOT_DATA.find(b => b.id === userId);
    if (bot) return bot.avatar;
    if (userId === 'system') return FALLBACK_AVATAR;
    if (userId === 'topluyo-ai') return "https://api.dicebear.com/7.x/pixel-art/svg?seed=TopluyoAI";
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)] relative">
      {isThrottled && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
           <div className="bg-red-600 text-white px-6 py-2 border-2 border-white shadow-[0_0_20px_rgba(255,0,255,0.5)] font-[1000] text-[10px] uppercase italic tracking-[0.3em]">SYSTEM_COOLDOWN: SEKTİRİCİ AKTİF</div>
        </div>
      )}

      <div className="h-8 bg-[#ff00ff]/10 flex items-center justify-center border-b border-[#ff00ff]/20 shrink-0">
         <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.3em] italic animate-pulse">
           CONNECTED AS: {user.username.toUpperCase()} // /demo - /müzik - /stop - /admin - /log - /list
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
             <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10 shadow-lg bg-[var(--bg-secondary)] overflow-hidden">
                <img 
                  src={getAvatar(m.userId)} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-black uppercase italic tracking-tight text-purple-300">
                   {m.userId === user.id ? user.username : (BOT_DATA.find(b => b.id === m.userId)?.username || (m.userId === 'system' ? 'AĞ_YÖNETİMİ' : (m.userId === 'topluyo-ai' ? 'TOPLUYO_AI' : 'AI_NODE')))}
                 </span>
                 <span className="text-[9px] text-white/20 font-black">{new Date(m.timestamp).toLocaleTimeString()}</span>
               </div>
               {renderMessageContent(m)}
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
              placeholder={isThrottled ? "SYSTEM_COOLDOWN_ACTIVE" : "/list yazarak tüm komutları gör..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(inputValue); }}
            />
            <div className="flex items-center pr-4 gap-2">
              <button disabled={isThrottled} onClick={() => handleSendMessage(inputValue)} className="bg-[#ff00ff] text-white px-8 py-2.5 rounded-xl font-[1000] uppercase italic tracking-tighter text-xs shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:scale-105 active:scale-95 transition-all">GÖNDER</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatArea;
