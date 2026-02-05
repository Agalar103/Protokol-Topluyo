
import React from 'react';
import { Channel, ChannelType } from '../types';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelIcon: React.FC<{ type: ChannelType }> = ({ type }) => {
  switch(type) {
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
    { name: 'UYGULAMA KANALLARI', type: ChannelType.APP },
    { name: 'MARKET', type: ChannelType.MARKET },
    { name: 'METİN KANALLARI', type: ChannelType.TEXT },
    { name: 'SES KANALLARI', type: ChannelType.VOICE },
  ];

  return (
    <div className="flex flex-col gap-6">
      {categories.map(cat => {
        const filtered = channels.filter(c => c.type === cat.type || (cat.type === ChannelType.MARKET && c.type === ChannelType.MARKET));
        if (filtered.length === 0) return null;

        return (
          <div key={cat.name}>
            <div className="px-4 text-[10px] font-black text-white/20 uppercase mb-2 tracking-widest flex items-center justify-between group">
              <span>{cat.name}</span>
              <button className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {filtered.map(c => (
              <div 
                key={c.id}
                onClick={() => onChannelSelect(c)}
                className={`group px-3 py-1 mx-2 rounded flex items-center gap-2 cursor-pointer transition-all mb-0.5
                  ${activeChannelId === c.id 
                    ? 'bg-white/5 text-white' 
                    : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60'}`}
              >
                <div className={`transition-transform duration-200 ${activeChannelId === c.id ? 'scale-110 text-[#ff66b2]' : 'group-hover:scale-110'}`}>
                  <ChannelIcon type={c.type} />
                </div>
                <span className="text-xs font-bold truncate flex-1 tracking-tight">
                  {c.name}
                </span>
                {c.type === ChannelType.VOICE && activeChannelId === c.id && (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-green-500 animate-pulse" />
                    <div className="w-1 h-2 bg-green-500 animate-pulse delay-75" />
                    <div className="w-1 h-3 bg-green-500 animate-pulse delay-150" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;
