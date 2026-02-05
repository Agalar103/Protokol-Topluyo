
import React from 'react';
import { User, VoiceState } from '../types';

interface UserPanelProps {
  user: User;
  voiceState: VoiceState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceState>>;
  onOpenSettings: () => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ user, voiceState, setVoiceState, onOpenSettings }) => {
  return (
    <div className="bg-[#160a29] p-2 flex items-center justify-between shrink-0 shadow-lg border-t border-black/10">
      <div 
        onClick={onOpenSettings}
        className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
      >
        <div className="relative shrink-0">
          <img src={user.avatar} className="w-8 h-8 rounded-xl shadow-md transition-all" alt="Avatar" />
          <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-green-500 border-2 border-[#160a29] rounded-full" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white text-sm font-black tracking-tight truncate">{user.username}</span>
          <span className="text-purple-300/20 text-[10px] font-bold truncate">#0001</span>
        </div>
      </div>

      <div className="flex items-center">
        <button 
          onClick={() => setVoiceState(v => ({...v, isMuted: !v.isMuted}))}
          className={`p-2 rounded-lg hover:bg-white/5 transition-all ${voiceState.isMuted ? 'text-red-500' : 'text-purple-200'}`}
        >
          {voiceState.isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          )}
        </button>
        <button 
          onClick={() => setVoiceState(v => ({...v, isDeafened: !v.isDeafened}))}
          className={`p-2 rounded-lg hover:bg-white/5 transition-all ${voiceState.isDeafened ? 'text-red-500' : 'text-purple-200'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-purple-200 rounded-lg hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
