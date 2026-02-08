
import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import ChannelList from './ChannelList';
import ChatArea from './ChatArea';
import VoiceArea from './VoiceArea';
import UserPanel from './UserPanel';
import UserSettingsModal from './UserSettingsModal';
import MemberSidebar from './MemberSidebar';
import ServerSettingsModal from './ServerSettingsModal';
import StoreArea from './StoreArea';
import NitroArea from './NitroArea';
import MatchArea from './MatchArea';
import QuickChat from './QuickChat';
import { User, Server, Channel, ChannelType, VoiceState, Role, Member, ScreenShareState } from '../types';

interface MainInterfaceProps {
  user: User;
  onLogout: () => void;
  initialServerId?: string;
  onBackToServers: () => void;
  onUpdateUser: (user: User) => void;
  onShowProfile: (user: User | Member) => void;
}

const INITIAL_ROLES: Role[] = [
  { id: 'r1', name: 'KURUCU', color: '#ff00ff', position: 0 },
  { id: 'r2', name: 'MODERATÖR', color: '#eab308', position: 1 },
  { id: 'r3', name: 'TOPLAYICI', color: '#00ffff', position: 2 },
];

const INITIAL_SERVERS: Server[] = [
  {
    id: 's1', name: 'Topluyo HQ', icon: '⚡', ownerId: 'admin-1', roles: INITIAL_ROLES,
    members: [
      { id: 'admin-1', username: 'AgalarHero', avatar: 'https://picsum.photos/seed/admin/200/200', status: 'online', roleId: 'r1' },
      { id: 'u2', username: 'Bot_Cyber', avatar: 'https://picsum.photos/seed/bot/200/200', status: 'online', roleId: 'r2' },
      { id: 'bot-test', username: 'Topluyo_Bot', avatar: 'https://picsum.photos/seed/topluyobot/200/200', status: 'online', roleId: 'r3', customStatus: '7/24 Aktif Yardımcı' },
    ],
    channels: [
      { id: 'c1', name: 'manifesto', type: ChannelType.ANNOUNCEMENT },
      { id: 'c2', name: 'genel-sohbet', type: ChannelType.TEXT },
      { id: 'n1', name: 'topluyo-nitro', type: ChannelType.NITRO },
      { id: 'm1', name: 'nos-market', type: ChannelType.MARKET },
      { id: 'match1', name: 'eşleştiriyo', type: ChannelType.MATCH },
      { id: 'v1', name: 'ana-terminal', type: ChannelType.VOICE },
    ]
  },
  { id: 's2', name: 'Destek', icon: '🆘', ownerId: 'admin-1', roles: INITIAL_ROLES, members: [], channels: [{ id: 'tc2', name: 'destek-sohbet', type: ChannelType.TEXT }] },
];

const MainInterface: React.FC<MainInterfaceProps> = ({ user, onLogout, initialServerId, onBackToServers, onUpdateUser, onShowProfile }) => {
  const [servers] = useState<Server[]>(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>(initialServerId || servers[0].id);
  const [activeDM, setActiveDM] = useState<Member | User | null>(null);
  
  const activeServer = useMemo(() => {
    const s = servers.find(srv => srv.id === activeServerId) || servers[0];
    
    // Aktif kullanıcının üye listesinde olduğundan emin ol
    const otherMembers = s.members.filter(m => m.id !== user.id);
    const currentUserAsMember: Member = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      status: 'online',
      roleId: user.id === 'admin-1' ? 'r1' : 'r3',
      customStatus: 'Siber Ağda Aktif',
      bio: user.bio,
      banner: user.banner
    };

    return { ...s, members: [...otherMembers, currentUserAsMember] };
  }, [servers, activeServerId, user]);

  const [activeChannel, setActiveChannel] = useState<Channel>(activeServer.channels[1] || activeServer.channels[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isMuted: false, isDeafened: false, isVideoOn: false, isBackgroundBlurred: true
  });

  const [screenShare, setScreenShare] = useState<ScreenShareState>({
    isActive: false, resolution: '1080p', frameRate: 60, shareAudio: true, sourceType: 'screen'
  });

  const handleChannelSelect = (channel: Channel) => setActiveChannel(channel);
  const handleServerSelect = (server: Server) => {
    setActiveServerId(server.id);
    setActiveChannel(server.channels[0]);
  };

  const handleMemberClick = (member: Member) => {
    if (member.id !== user.id) {
      setActiveDM(member);
    } else {
      onShowProfile(member);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0314] text-[#e9d5ff] animate-in fade-in duration-500 overflow-hidden relative">
      <Sidebar servers={servers} activeServerId={activeServer.id} onServerSelect={handleServerSelect} onAddServer={() => {}} onBackToHub={onBackToServers} />

      <div className="w-64 bg-[#110524] flex flex-col border-r border-white/5 shrink-0">
        <button onClick={() => setIsServerSettingsOpen(true)} className="h-12 px-4 flex items-center justify-between hover:bg-white/5 transition-all font-black text-xs uppercase tracking-widest text-white/80 italic">
          {activeServer.name}
          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <ChannelList channels={activeServer.channels} activeChannelId={activeChannel.id} onChannelSelect={handleChannelSelect} />
        </div>
        <UserPanel user={user} voiceState={voiceState} setVoiceState={setVoiceState} onOpenSettings={() => setIsSettingsOpen(true)} onProfileClick={() => onShowProfile(user)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0314] relative">
        {activeChannel.type === ChannelType.MARKET ? <StoreArea /> : 
         activeChannel.type === ChannelType.NITRO ? <NitroArea /> :
         activeChannel.type === ChannelType.MATCH ? <MatchArea /> :
         activeChannel.type === ChannelType.VOICE || activeChannel.type === ChannelType.STAGE ? (
          <VoiceArea channel={activeChannel} members={activeServer.members} voiceState={voiceState} setVoiceState={setVoiceState} screenShare={screenShare} setScreenShare={setScreenShare} />
        ) : <ChatArea channelId={activeChannel.id} user={user} />}
      </main>

      <MemberSidebar activeServer={activeServer} onMemberClick={handleMemberClick} />

      {activeDM && (
        <QuickChat 
          currentUser={user} 
          recipient={activeDM} 
          onClose={() => setActiveDM(null)} 
        />
      )}

      {isSettingsOpen && <UserSettingsModal user={user} voiceState={voiceState} setVoiceState={setVoiceState} onUpdateUser={onUpdateUser} onClose={() => setIsSettingsOpen(false)} onLogout={onLogout} />}
      {isServerSettingsOpen && <ServerSettingsModal server={activeServer} onUpdateServer={() => {}} onClose={() => setIsServerSettingsOpen(false)} />}
    </div>
  );
};

export default MainInterface;
