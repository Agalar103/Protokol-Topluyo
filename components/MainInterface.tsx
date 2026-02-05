
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChannelList from './ChannelList';
import ChatArea from './ChatArea';
import VoiceArea from './VoiceArea';
import UserPanel from './UserPanel';
import UserSettingsModal from './UserSettingsModal';
import MemberSidebar from './MemberSidebar';
import ServerSettingsModal from './ServerSettingsModal';
import StoreArea from './StoreArea';
import { User, Server, Channel, ChannelType, VoiceState, Role, Member, ScreenShareState } from '../types';

interface MainInterfaceProps {
  user: User;
  onLogout: () => void;
  initialServerId?: string;
  onBackToServers: () => void;
}

const INITIAL_ROLES: Role[] = [
  { id: 'r1', name: 'KURUCU', color: '#ff00ff', position: 0 },
  { id: 'r2', name: 'MODERATÖR', color: '#eab308', position: 1 },
  { id: 'r3', name: 'TOPLAYICI', color: '#00ffff', position: 2 },
];

const INITIAL_SERVERS: Server[] = [
  {
    id: 's1', name: 'Topluyo HQ', icon: '⚡', ownerId: 'admin-1', roles: INITIAL_ROLES, isCommunity: true,
    members: [
      { id: 'admin-1', username: 'AgalarHero', avatar: 'https://picsum.photos/seed/admin/200/200', status: 'online', roleId: 'r1' },
      { id: 'u2', username: 'Bot_Cyber', avatar: 'https://picsum.photos/seed/bot/200/200', status: 'online', roleId: 'r2' },
    ],
    channels: [
      { id: 'c1', name: 'manifesto', type: ChannelType.ANNOUNCEMENT },
      { id: 'c2', name: 'genel-sohbet', type: ChannelType.TEXT },
      { id: 'c3', name: 'forum-desteği', type: ChannelType.FORUM },
      { id: 'v1', name: 'ana-terminal', type: ChannelType.VOICE },
      { id: 'v2', name: 'Sahne / Etkinlik', type: ChannelType.STAGE },
      { id: 'm1', name: 'nos-market', type: ChannelType.MARKET },
    ]
  },
  { id: 's2', name: 'Destek', icon: '🆘', ownerId: 'admin-1', roles: INITIAL_ROLES, members: [], channels: [{ id: 'tc2', name: 'destek-sohbet', type: ChannelType.TEXT }] },
  { id: 's3', name: 'Ekip', icon: '🔥', ownerId: 'admin-1', roles: INITIAL_ROLES, members: [], channels: [{ id: 'tc3', name: 'ekip-sohbet', type: ChannelType.TEXT }] },
];

const MainInterface: React.FC<MainInterfaceProps> = ({ user: initialUser, onLogout, initialServerId, onBackToServers }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [servers] = useState<Server[]>(INITIAL_SERVERS);
  const [activeServer, setActiveServer] = useState<Server>(servers.find(s => s.id === initialServerId) || servers[0]);
  const [activeChannel, setActiveChannel] = useState<Channel>(activeServer.channels[1] || activeServer.channels[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!initialUser.hasSetUsername);
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isMuted: false, isDeafened: false, isVideoOn: false, isBackgroundBlurred: true,
    inputGain: 0.8, outputVolume: 1.0, noiseSuppression: true, echoCancellation: true,
    listenToSelf: false, currentDB: -60, selectedInputDevice: 'Varsayılan Mikrofon', selectedOutputDevice: 'Varsayılan Kulaklık',
  });

  const [screenShare, setScreenShare] = useState<ScreenShareState>({
    isActive: false, resolution: '1080p', frameRate: 60, shareAudio: true, sourceType: 'screen'
  });

  const handleChannelSelect = (channel: Channel) => setActiveChannel(channel);
  const handleServerSelect = (server: Server) => {
    setActiveServer(server);
    setActiveChannel(server.channels[0]);
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0314] text-[#e9d5ff] animate-in fade-in duration-500 overflow-hidden relative">
      <Sidebar 
        servers={servers} 
        activeServerId={activeServer.id} 
        onServerSelect={handleServerSelect} 
        onAddServer={() => {}}
        onBackToHub={onBackToServers}
      />

      <div className="w-64 bg-[#110524] flex flex-col border-r border-white/5 shrink-0">
        <button onClick={() => setIsServerSettingsOpen(true)} className="h-12 px-4 flex items-center justify-between hover:bg-white/5 transition-all font-black text-xs uppercase tracking-widest text-white/80 italic">
          {activeServer.name}
          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <ChannelList channels={activeServer.channels} activeChannelId={activeChannel.id} onChannelSelect={handleChannelSelect} />
        </div>
        <UserPanel user={user} voiceState={voiceState} setVoiceState={setVoiceState} onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0314] relative">
        {activeChannel.type === ChannelType.MARKET ? <StoreArea /> : 
         activeChannel.type === ChannelType.VOICE || activeChannel.type === ChannelType.STAGE ? (
          <VoiceArea 
            channel={activeChannel} 
            members={activeServer.members} 
            voiceState={voiceState} 
            setVoiceState={setVoiceState}
            screenShare={screenShare}
            setScreenShare={setScreenShare}
          />
        ) : <ChatArea channelId={activeChannel.id} />}
      </main>

      <MemberSidebar activeServer={activeServer} />

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-8 backdrop-blur-xl">
           <div className="max-w-2xl w-full bg-[#110524] border-4 border-[#ff00ff] p-16 shadow-[0_0_100px_rgba(255,0,255,0.2)]">
              <h2 className="text-5xl font-[1000] text-white uppercase italic tracking-tighter mb-4 leading-none">AĞA HOŞGELDİN</h2>
              <p className="text-[#00ffff] font-black uppercase text-xs tracking-[0.4em] mb-12">Yolculuğa Başlamadan Önce Kimliğini Doğrula</p>
              
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Görünür İsim</label>
                    <input 
                      className="w-full bg-black border-2 border-white/5 p-4 text-white font-black uppercase" 
                      placeholder="GERÇEK_ISIM_BURAYA" 
                      onChange={(e) => setUser(u => ({...u, displayName: e.target.value}))}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setShowOnboarding(false)} className="bg-[#ff00ff] text-white py-4 font-[1000] uppercase italic tracking-tighter border-2 border-white hover:scale-105 transition-all">Sisteme Sız</button>
                    <button onClick={() => setShowOnboarding(false)} className="bg-white/5 border-2 border-white/10 text-white/40 py-4 font-[1000] uppercase italic tracking-tighter">İptal</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isSettingsOpen && <UserSettingsModal user={user} voiceState={voiceState} setVoiceState={setVoiceState} onUpdateUser={setUser} onClose={() => setIsSettingsOpen(false)} onLogout={onLogout} />}
      {isServerSettingsOpen && <ServerSettingsModal server={activeServer} onUpdateServer={() => {}} onClose={() => setIsServerSettingsOpen(false)} />}
    </div>
  );
};

export default MainInterface;
