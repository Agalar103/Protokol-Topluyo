
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChannelList from './ChannelList';
import ChatArea, { BOT_DATA } from './ChatArea';
import VoiceArea from './VoiceArea';
import UserPanel from './UserPanel';
import UserSettingsModal from './UserSettingsModal';
import MemberSidebar from './MemberSidebar';
import ServerSettingsModal from './ServerSettingsModal';
import StoreArea from './StoreArea';
import NitroArea from './NitroArea';
import MatchArea from './MatchArea';
import WalletArea from './WalletArea';
import QuickChat from './QuickChat';
import CreateServerModal from './CreateServerModal';
import AdminPanel from './AdminPanel';
import NetworkReportModal from './NetworkReportModal';
import HackOverlay from './HackOverlay';
import { User, Server, Channel, ChannelType, VoiceState, Role, Member, ScreenShareState, Message, MessageType, AuditLog } from '../types';

interface MainInterfaceProps {
  user: User;
  onLogout: () => void;
  initialServerId?: string;
  onBackToServers: () => void;
  onUpdateUser: (user: User) => void;
  onShowProfile: (user: User | Member) => void;
}

const INITIAL_ROLES: Role[] = [
  { id: 'r1', name: 'YÖNETİCİ', color: '#ff00ff', position: 0 },
  { id: 'r4', name: 'VIP', color: '#00ff00', position: 1 },
  { id: 'r2', name: 'MODERATÖR', color: '#eab308', position: 2 },
  { id: 'r3', name: 'TOPLAYICI', color: '#00ffff', position: 3 },
];

const INITIAL_SERVERS: Server[] = [
  {
    id: 's1', name: 'Topluyo HQ', icon: '⚡', ownerId: 'admin-1', inviteUrl: 'topluyo-hq', isPremium: true, roles: INITIAL_ROLES,
    members: [
      { id: 'admin-1', username: 'AgalarHero', avatar: 'https://picsum.photos/seed/admin/200/200', status: 'online', roleId: 'r1' },
      ...BOT_DATA.map(bot => ({
        id: bot.id,
        username: bot.username,
        avatar: bot.avatar,
        status: (['bot-elraenn', 'bot-jaho', 'bot-wtcn', 'bot-baris'].includes(bot.id) ? 'online' : 'idle') as any,
        roleId: bot.id.includes('bot-elraenn') || bot.id.includes('bot-baris') ? 'r1' : (bot.id.includes('bot-jaho') ? 'r2' : 'r3'),
        customStatus: bot.id.includes('bot-baris') ? 'Gelecek Tasarlanıyor' : (bot.id.includes('bot-jaho') ? 'Drama Analizi' : 'Siber Ağda Aktif')
      }))
    ],
    channels: [
      { id: 'c1', name: 'manifesto', type: ChannelType.ANNOUNCEMENT },
      { id: 'c2', name: 'genel-sohbet', type: ChannelType.TEXT },
      { id: 'w1', name: 'cüzdan', type: ChannelType.WALLET },
      { id: 'n1', name: 'topluyo-nitro', type: ChannelType.NITRO },
      { id: 'm1', name: 'nos-market', type: ChannelType.MARKET },
      { id: 'match1', name: 'eşleştiriyo', type: ChannelType.MATCH },
      { id: 'v1', name: 'ana-terminal', type: ChannelType.VOICE },
    ]
  }
];

const ServerRulesModal: React.FC<{ serverName: string, onAccept: () => void }> = ({ serverName, onAccept }) => (
  <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
    <div className="relative w-full max-w-2xl bg-[#0b0314] border-[6px] border-[#ff00ff]/30 p-12 shadow-[0_0_80px_rgba(255,0,255,0.2)] overflow-hidden flex flex-col items-center text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#ff00ff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,0,255,0.4)] border-4 border-white/20">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-1">SUNUCU KURALLARI: {serverName.toUpperCase()}</h2>
        <p className="text-[10px] font-black text-[#ff00ff] uppercase tracking-[0.4em]">ERİŞİM İÇİN ONAY GEREKLİDİR</p>
      </div>

      <div className="space-y-6 text-left w-full bg-white/5 p-8 border border-white/10 mb-10 overflow-y-auto max-h-[40vh] no-scrollbar">
        <div className="space-y-2">
          <p className="text-[#00ffff] font-black text-[10px] uppercase italic tracking-widest">// MADDE_01: DÜZEN_PROTOKOLÜ</p>
          <p className="text-sm font-bold text-white/60">Sunucu içerisindeki hiyerarşiye ve diğer kullanıcılara saygı göstermek zorunludur.</p>
        </div>
        <div className="space-y-2">
          <p className="text-[#00ffff] font-black text-[10px] uppercase italic tracking-widest">// MADDE_02: SİBER_ETİK</p>
          <p className="text-sm font-bold text-white/60">Spam ve dolandırıcılık amaçlı girişimler kalıcı olarak uzaklaştırılmanıza sebep olur.</p>
        </div>
        <div className="space-y-2">
          <p className="text-[#00ffff] font-black text-[10px] uppercase italic tracking-widest">// MADDE_03: YETKİ_BİLGİSİ</p>
          <p className="text-sm font-bold text-white/60">VIP üyeler özel statüye sahiptir. Yönetim kararları kesindir.</p>
        </div>
      </div>

      <button 
        onClick={onAccept}
        className="w-full py-6 bg-white text-black font-[1000] uppercase italic tracking-tighter text-2xl hover:bg-[#ff00ff] hover:text-white transition-all border-4 border-black active:scale-95 shadow-[8px_8px_0_#ff00ff]"
      >
        OKUDUM, ONAYLADIM
      </button>
    </div>
  </div>
);

const MainInterface: React.FC<MainInterfaceProps> = ({ user, onLogout, initialServerId, onBackToServers, onUpdateUser, onShowProfile }) => {
  const [servers, setServers] = useState<Server[]>(() => {
    const saved = localStorage.getItem('topluyo_servers_v2');
    return saved ? JSON.parse(saved) : INITIAL_SERVERS;
  });
  
  const [activeServerId, setActiveServerId] = useState<string>(initialServerId || servers[0].id);
  const [acceptedRules, setAcceptedRules] = useState<string[]>(() => {
    const saved = localStorage.getItem('topluyo_accepted_rules');
    return saved ? JSON.parse(saved) : ['s1'];
  });
  
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isHackOpen, setIsHackOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'members' | 'logs'>('members');
  
  const [currentMusic, setCurrentMusic] = useState<{title: string, url: string, isPlaying: boolean} | null>(null);

  useEffect(() => {
    localStorage.setItem('topluyo_servers_v2', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    localStorage.setItem('topluyo_accepted_rules', JSON.stringify(acceptedRules));
  }, [acceptedRules]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('topluyo_audit_logs');
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
    } catch (e) { return []; }
  });

  const addLog = (action: AuditLog['action'], details: string, rawData?: any) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + Math.random(),
      timestamp: new Date(),
      userId: user.id,
      username: user.username,
      action,
      details,
      rawData
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 500); 
      localStorage.setItem('topluyo_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('topluyo_messages_v3');
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach(key => {
        parsed[key] = parsed[key].map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      });
      return parsed;
    } catch (e) { return {}; }
  });

  const activeServer = useMemo(() => {
    const s = servers.find(srv => srv.id === activeServerId) || servers[0];
    const otherMembers = s.members.filter(m => m.id !== user.id);
    const existingUser = s.members.find(m => m.id === user.id);
    
    const currentUserAsMember: Member = {
      id: user.id, username: user.username, avatar: user.avatar, status: 'online',
      roleId: existingUser?.roleId || (user.id === s.ownerId ? 'r1' : 'r3'),
      customStatus: existingUser?.customStatus || 'Siber Ağda Aktif', bio: user.bio, banner: user.banner
    };
    return { ...s, members: [...otherMembers, currentUserAsMember] };
  }, [servers, activeServerId, user]);

  const [activeChannel, setActiveChannel] = useState<Channel>(activeServer.channels[1] || activeServer.channels[0]);
  const [activeDM, setActiveDM] = useState<Member | User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isMuted: true, isDeafened: false, isVideoOn: false, isBackgroundBlurred: true
  });

  const [screenShare, setScreenShare] = useState<ScreenShareState>({
    isActive: false, resolution: '1080p', frameRate: 60, shareAudio: true, sourceType: 'screen'
  });

  const handleChannelSelect = (channel: Channel) => setActiveChannel(channel);
  
  const handleServerSelect = (server: Server) => {
    setActiveServerId(server.id);
    const firstSelectable = server.channels.find(c => [ChannelType.TEXT, ChannelType.ANNOUNCEMENT, ChannelType.MARKET, ChannelType.WALLET].includes(c.type));
    setActiveChannel(firstSelectable || server.channels[0]);
  };

  const handleCreateServer = (serverData: any) => {
    const newServerId = 's-' + Date.now();
    const isPremium = !!serverData.isPremium;
    const inviteUrl = isPremium ? serverData.customUrl : `topluyo.com/inv-${Math.random().toString(36).substring(2, 7)}`;

    const newServer: Server = {
      id: newServerId,
      name: serverData.name,
      icon: serverData.icon,
      ownerId: user.id,
      inviteUrl: inviteUrl,
      isPremium: isPremium,
      roles: INITIAL_ROLES,
      members: [
        { id: user.id, username: user.username, avatar: user.avatar, status: 'online', roleId: 'r1' }
      ],
      channels: [
        { id: 'c-genel-' + Date.now(), name: 'genel-sohbet', type: ChannelType.TEXT },
        { id: 'v-ana-' + Date.now(), name: 'ana-terminal', type: ChannelType.VOICE },
        { id: 'm-nos-' + Date.now(), name: 'nos-market', type: ChannelType.MARKET },
        { id: 'n-nitro-' + Date.now(), name: 'topluyo-nitro', type: ChannelType.NITRO },
        { id: 'w-cuzdan-' + Date.now(), name: 'cüzdan', type: ChannelType.WALLET },
      ]
    };

    setServers(prev => [...prev, newServer]);
    setIsCreateServerModalOpen(false);
    setActiveServerId(newServerId);
    setActiveChannel(newServer.channels[0]);
    // Sahibi olduğu için kuralları otomatik onaylı saymıyoruz, yine de görsün
    setAcceptedRules(prev => prev.filter(id => id !== newServerId)); 
    addLog('PROFILE_UPDATE', `Yeni sunucu kuruldu: ${newServer.name}`);
  };

  const handleUpdateServer = (updatedServer: Server) => {
    setServers(prev => prev.map(s => s.id === updatedServer.id ? updatedServer : s));
  };

  const handleAddMessage = (channelId: string, msg: Message) => {
    setAllMessages(prev => {
        const updated = {
            ...prev,
            [channelId]: [...(prev[channelId] || []), msg]
        };
        localStorage.setItem('topluyo_messages_v3', JSON.stringify(updated));
        return updated;
    });
    if (msg.userId === user.id) {
      addLog('MESSAGE_SEND', `${activeChannel.name} kanalına mesaj gönderildi.`);
    }
  };

  const handleAcceptRules = () => {
    setAcceptedRules(prev => [...prev, activeServerId]);
  };

  const handleSupportClick = () => {
    setActiveDM({
        id: 'anan-support-id',
        username: 'anan (YÖNETİM)',
        avatar: 'https://picsum.photos/seed/anan/200/200',
        status: 'online'
    } as User);
  };

  const isCurrentServerAccepted = acceptedRules.includes(activeServerId);

  return (
    <div className="flex h-screen w-full bg-[var(--bg-secondary)] text-[var(--text-main)] animate-in fade-in duration-500 overflow-hidden relative">
      <Sidebar servers={servers} activeServerId={activeServer.id} onServerSelect={handleServerSelect} onAddServer={() => setIsCreateServerModalOpen(true)} onBackToHub={onBackToServers} />

      <div className="w-64 bg-[var(--bg-primary)] flex flex-col border-r border-white/5 shrink-0">
        <button onClick={() => setIsServerSettingsOpen(true)} className="h-12 px-4 flex items-center justify-between hover:bg-white/5 transition-all font-black text-xs uppercase tracking-widest text-white/80 italic">
          <div className="flex items-center gap-2 truncate">
             {activeServer.ownerId === user.id && <span className="text-[#ff00ff]">👑</span>}
             <span className="truncate">{activeServer.name}</span>
          </div>
          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <ChannelList channels={activeServer.channels} activeChannelId={activeChannel.id} onChannelSelect={handleChannelSelect} />
        </div>
        <UserPanel user={user} voiceState={voiceState} setVoiceState={setVoiceState} onOpenSettings={() => setIsSettingsOpen(true)} onProfileClick={() => onShowProfile(user)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-secondary)] relative">
        {activeChannel.type === ChannelType.MARKET ? <StoreArea /> : 
         activeChannel.type === ChannelType.NITRO ? <NitroArea /> :
         activeChannel.type === ChannelType.MATCH ? <MatchArea userMusic={currentMusic} onStartChat={(m) => setActiveDM(m)} /> :
         activeChannel.type === ChannelType.WALLET ? <WalletArea /> :
         activeChannel.type === ChannelType.VOICE || activeChannel.type === ChannelType.STAGE ? (
          <VoiceArea 
            channel={activeChannel} 
            members={activeServer.members} 
            voiceState={voiceState} 
            setVoiceState={setVoiceState} 
            screenShare={screenShare} 
            setScreenShare={setScreenShare}
            currentMusic={currentMusic}
          />
        ) : (
          <ChatArea 
            channelId={activeChannel.id} 
            user={user} 
            messages={allMessages[activeChannel.id] || []} 
            onSendMessage={(msg) => handleAddMessage(activeChannel.id, msg)}
            onOpenAdminPanel={() => { setAdminActiveTab('members'); setIsAdminPanelOpen(true); }}
            onOpenLogs={() => { setAdminActiveTab('logs'); setIsAdminPanelOpen(true); }}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenHack={() => setIsHackOpen(true)}
            onMusicCommand={(title, url, stop) => {
              if (stop) setCurrentMusic(null);
              else setCurrentMusic({ title, url, isPlaying: true });
            }}
          />
        )}

        {/* Live Support Button */}
        <button 
            onClick={handleSupportClick}
            className="absolute bottom-6 right-6 w-16 h-16 bg-[#ff00ff] rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,0,255,0.4)] border-4 border-white/20 hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#05010a] animate-pulse" />
        </button>
      </main>

      <MemberSidebar 
        activeServer={activeServer} 
        onMemberClick={(m) => m.id !== user.id ? setActiveDM(m) : onShowProfile(user)} 
        onViewProfile={(m) => onShowProfile(m)}
        onSendMessage={(m) => setActiveDM(m)}
      />

      {/* Rules Overlay */}
      {!isCurrentServerAccepted && (
        <ServerRulesModal serverName={activeServer.name} onAccept={handleAcceptRules} />
      )}

      {activeDM && <QuickChat currentUser={user} recipient={activeDM} onClose={() => setActiveDM(null)} />}
      {isSettingsOpen && <UserSettingsModal user={user} voiceState={voiceState} setVoiceState={setVoiceState} onUpdateUser={onUpdateUser} onClose={() => setIsSettingsOpen(false)} onLogout={onLogout} />}
      {isServerSettingsOpen && <ServerSettingsModal server={activeServer} onUpdateServer={handleUpdateServer} onClose={() => setIsServerSettingsOpen(false)} currentUser={user} />}
      {isCreateServerModalOpen && <CreateServerModal onClose={() => setIsCreateServerModalOpen(false)} onCreate={handleCreateServer} />}
      {isReportOpen && <NetworkReportModal onClose={() => setIsReportOpen(false)} />}
      {isHackOpen && <HackOverlay onClose={() => setIsHackOpen(false)} />}
      {isAdminPanelOpen && (
        <AdminPanel 
          server={activeServer}
          logs={auditLogs}
          activeTab={adminActiveTab}
          setActiveTab={setAdminActiveTab}
          onClose={() => setIsAdminPanelOpen(false)} 
          currentUser={user}
          onSendSystemMessage={(content) => handleAddMessage(activeChannel.id, {
            id: 'sys-' + Date.now(),
            userId: 'system',
            content,
            type: MessageType.TEXT,
            timestamp: new Date()
          })}
        />
      )}
    </div>
  );
};

export default MainInterface;
