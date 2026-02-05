
import React, { useState, useEffect } from 'react';
import { Channel, VoiceState, Member, ScreenShareState, ChannelType } from '../types';

interface VoiceAreaProps {
  channel: Channel;
  members: Member[];
  voiceState: VoiceState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceState>>;
  screenShare: ScreenShareState;
  setScreenShare: React.Dispatch<React.SetStateAction<ScreenShareState>>;
}

const VoiceArea: React.FC<VoiceAreaProps> = ({ channel, members, voiceState, setVoiceState, screenShare, setScreenShare }) => {
  const isStage = channel.type === ChannelType.STAGE;
  const [isBotPlaying, setIsBotPlaying] = useState(true);
  
  return (
    <div className="flex-1 flex flex-col bg-[#0b0314] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent animate-shiny" />
      
      {/* Top Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
         <div className="space-y-1 reveal-item">
            <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none animate-shiny">{channel.name}</h2>
            <p className="text-[10px] font-black text-[#00ffff] uppercase tracking-[0.4em]">{isStage ? 'STAGER_NODE_ACTIVE' : 'VOICE_LINK_ESTABLISHED'}</p>
         </div>
         <div className="flex gap-4">
           {isBotPlaying && (
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 animate-float">
                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Music Bot: Rick Astley - Never Gonna Give You Up</span>
              </div>
           )}
           {isStage && (
             <button className="magnetic-btn bg-[#ff00ff] text-white px-8 py-3 font-[1000] uppercase italic tracking-tighter border-2 border-white shadow-2xl transition-all">
               KONUŞMA İSTEĞİ
             </button>
           )}
         </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
         {isStage ? (
            <div className="space-y-16">
               <div className="space-y-6">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic ml-2">SAHNE / KONUŞMACILAR</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="aspect-square bg-[#110524] border-4 border-[#ff00ff] relative overflow-hidden group shadow-[0_0_30px_rgba(255,0,255,0.1)] reveal-item">
                         <div className="w-full h-full flex items-center justify-center bg-black">
                            <span className="text-4xl animate-bounce">🎵</span>
                         </div>
                         <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <span className="text-xs font-[1000] text-white uppercase italic">MUSIC MASTER BOT</span>
                         </div>
                     </div>
                     {members.slice(0, 3).map((m, idx) => (
                       <div key={m.id} className="aspect-square bg-[#110524] border-4 border-[#00ffff] relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,255,0.1)] reveal-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <img src={m.avatar} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110" alt="" />
                          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                             <span className="text-xs font-[1000] text-white uppercase italic">{m.username}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="space-y-6">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic ml-2">İZLEYİCİLER / {members.length}</p>
                  <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 opacity-50">
                     {members.map(m => (
                        <img key={m.id} src={m.avatar} className="aspect-square rounded-xl bg-purple-900 border-2 border-white/10 hover:opacity-100 transition-opacity" alt="" />
                     ))}
                  </div>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
               {/* Music Bot Speaker */}
               <div className="aspect-video bg-[#110524] rounded-2xl border-2 border-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.2)] flex flex-col items-center justify-center gap-4 group relative overflow-hidden reveal-item">
                  <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">🎵</div>
                  <span className="text-[10px] font-[1000] text-[#ff00ff] uppercase tracking-widest italic animate-shiny">MUSIC MASTER BOT (YAYINDA)</span>
                  <div className="absolute inset-0 border-4 border-[#ff00ff]/20 animate-pulse rounded-2xl" />
               </div>
               {members.slice(0, 11).map((m, idx) => (
                  <div key={m.id} className={`aspect-video bg-[#110524] rounded-2xl border-2 transition-all group relative overflow-hidden reveal-item ${m.id === 'admin-1' && !voiceState.isMuted ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-white/5'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                     {m.id === 'admin-1' && voiceState.isVideoOn ? (
                       <div className="w-full h-full bg-black flex items-center justify-center relative">
                         <div className={`absolute inset-0 bg-purple-900/20 ${voiceState.isBackgroundBlurred ? 'backdrop-blur-xl' : ''}`} />
                         <span className="text-white/20 font-black uppercase text-4xl italic animate-shiny">VIDEO_FEED</span>
                       </div>
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                          <img src={m.avatar} className="w-20 h-20 rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt="" />
                          <span className="text-[10px] font-[1000] text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{m.username}</span>
                       </div>
                     )}
                     {m.id === 'admin-1' && !voiceState.isMuted && (
                       <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Control Footer */}
      <div className="h-32 bg-[#05010a] border-t-4 border-[#ff00ff]/10 flex items-center justify-center gap-6 relative px-8 shrink-0">
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff00ff]/20 to-transparent" />
         
         <button 
           onClick={() => setVoiceState(v => ({...v, isMuted: !v.isMuted}))}
           className={`magnetic-btn p-6 border-2 transition-all ${voiceState.isMuted ? 'bg-red-600 border-red-400 text-white shadow-2xl' : 'bg-white/5 border-white/10 text-white hover:border-[#ff00ff]'}`}
         >
           {voiceState.isMuted ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
         </button>

         <button 
           onClick={() => setVoiceState(v => ({...v, isVideoOn: !v.isVideoOn}))}
           className={`magnetic-btn p-6 border-2 transition-all ${voiceState.isVideoOn ? 'bg-[#00ffff] border-white text-black' : 'bg-white/5 border-white/10 text-white hover:border-[#00ffff]'}`}
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
         </button>

         <button className="magnetic-btn px-10 py-5 bg-[#ff00ff] border-4 border-white text-white font-[1000] uppercase italic tracking-tighter text-sm shadow-2xl active:translate-y-1">EKRAN PAYLAŞ</button>

         <button className="magnetic-btn p-6 bg-red-600/10 text-red-600 border-2 border-red-600/30 font-black italic uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all">AĞI TERK ET</button>
      </div>
    </div>
  );
};

export default VoiceArea;
