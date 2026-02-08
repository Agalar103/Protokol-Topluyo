
import React from 'react';
import { Channel, ChannelType } from '../types';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelIcon: React.FC<{ type: ChannelType }> = ({ type }) => {
  switch(type) {
    case ChannelType.NITRO:
      return (
        <svg className="w-4 h-4 text-[#ff00ff]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
        </svg>
      );
    case ChannelType.MATCH:
      return (
        <svg className="w-4 h-4 text-[#ff00ff]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case ChannelType.APP:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case ChannelType.MARKET:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case ChannelType.WALLET:
      return (
        <svg className="w-4 h-4 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case ChannelType.VOICE:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    default:
      return <span className="text-lg">#</span>;
  }
};

const ChannelList: React.FC<ChannelListProps> = ({ channels, activeChannelId, onChannelSelect }) => {
  const categories = [
    { name: 'MAĞAZA & PREMİUM', types: [ChannelType.MARKET, ChannelType.NITRO, ChannelType.MATCH, ChannelType.WALLET] },
    { name: 'UYGULAMA KANALLARI', types: [ChannelType.APP] },
    { name: 'METİN KANALLARI', types: [ChannelType.TEXT, ChannelType.ANNOUNCEMENT, ChannelType.FORUM] },
    { name: 'SES KANALLARI', types: [ChannelType.VOICE, ChannelType.STAGE] },
  ];

  const playSwitchSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  };

  const handleSelect = (c: Channel) => {
    if (c.id !== activeChannelId) {
      playSwitchSound();
    }
    onChannelSelect(c);
  };

  return (
    <div className="flex flex-col gap-6">
      {categories.map(cat => {
        const filtered = channels.filter(c => cat.types.includes(c.type));
        if (filtered.length === 0) return null;

        return (
          <div key={cat.name}>
            <div className="px-4 text-[10px] font-black text-white/20 uppercase mb-2 tracking-widest flex items-center justify-between group">
              <span>{cat.name}</span>
            </div>
            {filtered.map(c => (
              <div 
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`group px-3 py-1.5 mx-2 rounded flex items-center gap-2 cursor-pointer transition-all mb-0.5
                  ${activeChannelId === c.id 
                    ? 'bg-white/5 text-white' 
                    : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60'}`}
              >
                <div className={`transition-transform duration-200 ${activeChannelId === c.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <ChannelIcon type={c.type} />
                </div>
                <span className="text-xs font-bold truncate flex-1 tracking-tight">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;
