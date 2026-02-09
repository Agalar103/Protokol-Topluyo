
import React, { useState, useEffect, useRef } from 'react';
import { Channel, VoiceState, Member, ScreenShareState, ChannelType } from '../types';

interface VoiceAreaProps {
  channel: Channel;
  members: Member[];
  voiceState: VoiceState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceState>>;
  screenShare: ScreenShareState;
  setScreenShare: React.Dispatch<React.SetStateAction<ScreenShareState>>;
  currentMusic?: { title: string, url: string, isPlaying: boolean } | null;
}

const QUALITY_OPTIONS = [
  { label: '720p 30fps', res: '720p', fps: 30 },
  { label: '1080p 60fps', res: '1080p', fps: 60 },
  { label: '2k 60fps', res: '2k', fps: 60 },
  { label: '4k 60fps', res: '4k', fps: 60 },
];

// UI Ses Efekti Üreticisi
const playUISound = (type: 'on' | 'off' | 'click' | 'alert') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'on') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
    } else if (type === 'off') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    } else if (type === 'alert') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.05);
    } else {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    }
    
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {}
};

const MemberCard: React.FC<{ member: Member; isCompact?: boolean; isActivePresenter?: boolean }> = ({ member, isCompact = false, isActivePresenter = false }) => (
  <div className={`${isCompact ? 'h-32 w-full' : 'aspect-video w-full'} bg-[#110524] rounded-2xl border-2 ${isActivePresenter ? 'border-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.2)]' : 'border-white/5'} relative overflow-hidden group transition-all shrink-0`}>
     <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <span className={`text-[10px] font-black uppercase tracking-widest ${isCompact ? 'opacity-20' : 'opacity-40'}`}>{member.username.toUpperCase()}</span>
     </div>
     <img src={member.avatar} className={`w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ${isCompact ? 'opacity-20 hover:opacity-100' : 'opacity-60'}`} alt="" />
     <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-black text-white/80 group-hover:text-white uppercase italic transition-colors">
       {member.username}
     </div>
     {isActivePresenter && (
       <div className="absolute top-2 right-2 bg-blue-600 p-1 rounded-lg shadow-lg">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
       </div>
     )}
  </div>
);

const VoiceArea: React.FC<VoiceAreaProps> = ({ channel, members, voiceState, setVoiceState, screenShare, setScreenShare, currentMusic }) => {
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [showMicSelector, setShowMicSelector] = useState(false);
  const [selectedMic, setSelectedMic] = useState('Varsayılan Mikrofon');
  const [showParticipants, setShowParticipants] = useState(true);

  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0&controls=0&rel=0` : null;
  };

  const musicUrl = currentMusic?.isPlaying && currentMusic?.url ? getEmbedUrl(currentMusic.url) : null;

  const handleMicToggle = () => {
    const newState = !voiceState.isMuted;
    setVoiceState(prev => ({ ...prev, isMuted: newState }));
    playUISound(newState ? 'off' : 'on');
    if (!newState) setShowMicSelector(false);
  };

  const handleVideoToggle = () => {
    const newState = !voiceState.isVideoOn;
    setVoiceState(v => ({...v, isVideoOn: newState}));
    playUISound(newState ? 'on' : 'off');
  };

  const stopScreenShare = () => {
    setScreenShare(prev => ({ ...prev, isActive: false }));
    playUISound('off');
  };

  const handleScreenShareToggle = () => {
    playUISound('click');
    if (screenShare.isActive) {
      stopScreenShare();
    } else {
      setShowQualitySelector(!showQualitySelector);
    }
  };

  const handleQualitySelect = (res: any, fps: any) => {
    setScreenShare({
      isActive: true,
      resolution: res,
      frameRate: fps,
      shareAudio: true,
      sourceType: 'screen'
    });
    setShowQualitySelector(false);
    playUISound('on');
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    playUISound('click');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#05010a] overflow-hidden relative font-mono select-none">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {musicUrl && (
          <div className="absolute w-1 h-1 opacity-0 pointer-events-none">
              <iframe src={musicUrl} allow="autoplay; encrypted-media" frameBorder="0" />
          </div>
      )}

      {/* Top Bar */}
      <div className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
               <span className="text-[11px] font-[1000] text-white uppercase italic tracking-tighter">
                 {channel.name}
               </span>
            </div>
            {screenShare.isActive && (
              <>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#ff00ff] rounded-full animate-pulse shadow-[0_0_8px_#ff00ff]" />
                   <span className="text-[10px] font-black text-[#ff00ff] uppercase tracking-widest">LIVE // ASI103</span>
                </div>
              </>
            )}
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => playUISound('click')} className="p-2 text-white/40 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
            <button onClick={() => playUISound('click')} className="p-2 text-white/40 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></button>
            <button onClick={handleScreenShareToggle} className={`p-2 transition-colors ${screenShare.isActive ? 'text-[#ff00ff]' : 'text-white/40 hover:text-white'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
         
         {screenShare.isActive ? (
           // THEATER MODE (Ekran Paylaşımı Varken)
           <>
             <div className="flex-1 bg-black border-2 border-white/5 rounded-2xl overflow-hidden relative shadow-2xl group/theater">
                <div className="absolute inset-0 bg-gradient-to-br from-[#110524] via-[#05010a] to-[#110524] flex items-center justify-center">
                   <div className="w-full h-full relative">
                      <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200" className="w-full h-full object-cover opacity-60 grayscale group-hover/theater:grayscale-0 transition-all duration-1000 blur-[2px]" alt="focused" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute bottom-10 left-10 space-y-2 z-20">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#ff00ff] p-1 shadow-[0_0_20px_#ff00ff]">
                               <img src="https://picsum.photos/seed/asi103/100/100" className="w-full h-full object-cover rounded" alt="" />
                            </div>
                            <div>
                               <h3 className="text-xl font-[1000] text-white italic uppercase tracking-tighter">ASI103's STREAM</h3>
                               <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">RESOLUTION: {screenShare.resolution.toUpperCase()} // FPS: {screenShare.frameRate}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 text-[8px] font-black text-[#00ffff] uppercase tracking-[0.3em] border border-[#00ffff]/20 z-20">SIGNAL: 100%</div>
             </div>

             {showParticipants && (
               <div className="w-72 flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0 animate-in slide-in-from-right duration-300">
                  <MemberCard member={members[0]} isCompact isActivePresenter />
                  {members.slice(1, 20).map((m) => (
                     <MemberCard key={m.id} member={m} isCompact />
                  ))}
               </div>
             )}
           </>
         ) : (
           // GRID MODE (Ekran Paylaşımı Yokken)
           <div className="flex-1 flex items-center justify-center overflow-hidden">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl h-full overflow-y-auto no-scrollbar p-4 content-start">
                {members.slice(0, 16).map(m => (
                  <MemberCard key={m.id} member={m} />
                ))}
             </div>
           </div>
         )}
      </div>

      {/* Control Footer */}
      <div className="h-28 bg-[#05010a] border-t border-white/5 flex items-center justify-between px-12 shrink-0 z-30">
         <div className="w-1/4 flex items-center">
            <button onClick={() => playUISound('click')} className="flex flex-col items-center gap-1 group">
               <div className="p-3 text-blue-500 group-hover:bg-blue-500/10 rounded-full transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               </div>
               <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">CHAT</span>
            </button>
         </div>

         <div className="flex-1 flex items-center justify-center gap-6">
            <div className="flex items-center bg-white/[0.03] p-1.5 rounded-full border border-white/5 shadow-2xl gap-1">
               <button 
                 onClick={handleVideoToggle}
                 className={`p-4 rounded-full transition-all group ${voiceState.isVideoOn ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               </button>
               
               <div className="relative">
                 <button 
                   onClick={handleMicToggle}
                   className={`p-4 rounded-full transition-all group ${!voiceState.isMuted ? 'text-white/40 hover:text-white hover:bg-white/5' : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'}`}
                 >
                    {voiceState.isMuted ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                 </button>
                 
                 {showMicSelector && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-black border border-[#ff00ff]/30 p-2 shadow-2xl animate-in zoom-in slide-in-from-bottom-2">
                     <p className="text-[8px] font-black text-[#ff00ff] uppercase tracking-widest mb-2 px-2 italic">Mikrofon Seçimi</p>
                     <div className="space-y-1">
                        {['Varsayılan Mikrofon', 'Harici Mikrofon (USB)', 'Studio Mic v2.1'].map(mic => (
                          <button key={mic} onClick={() => { playUISound('click'); setSelectedMic(mic); setShowMicSelector(false); }} className="w-full text-left px-3 py-2 text-[10px] text-white/60 hover:text-white hover:bg-[#ff00ff]/10 transition-all uppercase italic">
                            {mic}
                          </button>
                        ))}
                     </div>
                   </div>
                 )}
               </div>
            </div>

            <button onClick={() => playUISound('click')} className="flex flex-col items-center gap-1 group px-4">
               <div className="p-4 bg-[#ff00ff]/10 rounded-2xl border-2 border-[#ff00ff]/30 text-[#ff00ff] shadow-[0_0_30px_rgba(255,0,255,0.1)] group-hover:scale-110 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
               </div>
               <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">AVAILABLE</span>
            </button>

            <div className="relative">
              <button 
                onClick={handleScreenShareToggle}
                className={`flex flex-col items-center gap-1 group px-4`}
              >
                 <div className={`p-4 rounded-2xl border-2 transition-all group-hover:scale-110 ${screenShare.isActive ? 'bg-blue-600 border-white text-white shadow-[0_0_30px_rgba(0,0,255,0.3)]' : 'bg-white/5 border-white/20 text-white shadow-xl'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 </div>
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">PRESENT</span>
              </button>

              {showQualitySelector && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-black border border-blue-500/30 p-2 shadow-2xl animate-in zoom-in slide-in-from-bottom-2">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2 px-2 italic">Ekran Paylaşım Kalitesi</p>
                  <div className="space-y-1">
                     {QUALITY_OPTIONS.map(opt => (
                       <button key={opt.label} onClick={() => handleQualitySelect(opt.res, opt.fps)} className="w-full text-left px-3 py-2 text-[10px] text-white/60 hover:text-white hover:bg-blue-500/10 transition-all uppercase italic flex justify-between">
                         <span>{opt.label}</span>
                         <span className="opacity-40">FPS:{opt.fps}</span>
                       </button>
                     ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => playUISound('alert')} className="flex flex-col items-center gap-1 group px-4">
               <div className="p-4 rounded-full border-2 border-white/10 text-white/20 hover:text-red-500 hover:border-red-500 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
               </div>
               <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">RECORD</span>
            </button>
         </div>

         <div className="w-1/4 flex items-center justify-end">
            <button 
              onClick={toggleParticipants}
              className="flex flex-col items-center gap-1 group"
            >
               <div className={`p-3 transition-colors ${showParticipants ? 'text-white' : 'text-white/20 hover:text-white'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               </div>
               <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">PARTICIPANTS</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default VoiceArea;
