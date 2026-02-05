
import React, { useState } from 'react';
import { Server, Role, Channel, ChannelType, Member } from '../types';

interface ServerSettingsModalProps {
  server: Server;
  onUpdateServer: (server: Server) => void;
  onClose: () => void;
}

const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({ server, onUpdateServer, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'roles' | 'channels' | 'members'>('general');
  const [serverName, setServerName] = useState(server.name);
  const [newRoleName, setNewRoleName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');

  const handleSaveName = () => {
    onUpdateServer({ ...server, name: serverName });
  };

  const handleAddRole = () => {
    if (!newRoleName) return;
    // Fix: Added missing 'position' property to comply with the Role interface defined in types.ts
    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      position: server.roles.length,
    };
    onUpdateServer({ ...server, roles: [...server.roles, newRole] });
    setNewRoleName('');
  };

  const handleAddChannel = (type: ChannelType) => {
    if (!newChannelName) return;
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelName,
      type: type,
    };
    onUpdateServer({ ...server, channels: [...server.channels, newChannel] });
    setNewChannelName('');
  };

  const handleDeleteChannel = (id: string) => {
    onUpdateServer({ ...server, channels: server.channels.filter(c => c.id !== id) });
  };

  const handleChangeMemberRole = (memberId: string, roleId: string) => {
    const updatedMembers = server.members.map(m => m.id === memberId ? { ...m, roleId } : m);
    onUpdateServer({ ...server, members: updatedMembers });
  };

  return (
    <div className="fixed inset-0 z-[200] flex bg-[#0b0314] animate-in fade-in zoom-in-95 duration-200">
      <div className="w-64 bg-[#110524] flex flex-col items-end py-12 pr-6 border-r border-white/5">
        <div className="w-48 space-y-1">
          <div className="text-[10px] font-black text-white/20 uppercase px-3 py-2 tracking-widest">{server.name} Ayarları</div>
          <button onClick={() => setActiveTab('general')} className={`w-full text-left px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-[#ff66b2]/10 text-[#ff66b2]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>Genel Görünüm</button>
          <button onClick={() => setActiveTab('roles')} className={`w-full text-left px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-[#ff66b2]/10 text-[#ff66b2]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>Roller</button>
          <button onClick={() => setActiveTab('channels')} className={`w-full text-left px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'channels' ? 'bg-[#ff66b2]/10 text-[#ff66b2]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>Kanallar</button>
          <button onClick={() => setActiveTab('members')} className={`w-full text-left px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-[#ff66b2]/10 text-[#ff66b2]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>Üyeler</button>
        </div>
      </div>

      <div className="flex-1 bg-[#160a29] p-16 relative overflow-y-auto">
        <button onClick={onClose} className="absolute right-12 top-12 p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white transition-all group">
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="max-w-xl animate-in slide-in-from-bottom-4 duration-300">
          {activeTab === 'general' && (
            <div className="space-y-10">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Sunucu Genel Görünümü</h1>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest">Sunucu Adı</label>
                <input 
                  type="text" 
                  value={serverName}
                  onChange={e => setServerName(e.target.value)}
                  className="w-full bg-[#0b0314] p-3 rounded border-none outline-none focus:ring-2 focus:ring-[#ff66b2]/50 text-white font-bold transition-all" 
                />
                <button onClick={handleSaveName} className="bg-[#ff66b2] text-white px-5 py-2.5 rounded font-black text-xs uppercase tracking-widest shadow-lg shadow-[#ff66b2]/20 hover:brightness-110 active:scale-95 transition-all">Değişiklikleri Kaydet</button>
              </div>
              <div className="p-6 bg-[#0b0314]/50 border border-white/5 rounded-xl">
                 <p className="text-xs text-white/40 font-medium leading-relaxed">Sunucu sahibi olarak sunucuyu silebilir, yetkileri düzenleyebilir ve kanalları yönetebilirsiniz. Şu anki sunucu ID: <code className="text-[#ff66b2]">{server.id}</code></p>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-10">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Rolleri Yönet</h1>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Yeni Rol Adı..."
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  className="flex-1 bg-[#0b0314] p-3 rounded border-none outline-none text-sm font-bold"
                />
                <button onClick={handleAddRole} className="bg-[#ff66b2] text-white px-5 rounded font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">Rol Ekle</button>
              </div>
              <div className="space-y-2">
                {server.roles.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5 hover:bg-white/5 transition-all">
                    <span className="font-black text-sm tracking-tight" style={{ color: r.color }}>{r.name}</span>
                    <div className="w-5 h-5 rounded-md shadow-inner" style={{ backgroundColor: r.color }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-10">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Kanal Ayarları</h1>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Kanal İsmi..."
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  className="flex-1 bg-[#0b0314] p-3 rounded border-none outline-none text-sm font-bold"
                />
                <button onClick={() => handleAddChannel(ChannelType.TEXT)} className="bg-purple-600 text-white px-4 rounded font-black text-[10px] uppercase tracking-widest hover:brightness-110">Metin</button>
                <button onClick={() => handleAddChannel(ChannelType.VOICE)} className="bg-blue-600 text-white px-4 rounded font-black text-[10px] uppercase tracking-widest hover:brightness-110">Ses</button>
              </div>
              <div className="space-y-2">
                {server.channels.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5 group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-white/20">{c.type === ChannelType.TEXT ? '#' : c.type === ChannelType.APP ? '⚡' : '🔊'}</span>
                      <span className="font-bold text-sm tracking-tight">{c.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteChannel(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-2 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-10">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Üye Yönetimi</h1>
              <div className="space-y-3">
                {server.members.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} className="w-10 h-10 rounded-full bg-purple-900 border border-white/10" alt="" />
                      <div className="flex flex-col">
                        <span className="font-black text-sm tracking-tight text-white">{m.username}</span>
                        <span className="text-[10px] text-white/20 font-bold uppercase">{server.roles.find(r => r.id === m.roleId)?.name}</span>
                      </div>
                    </div>
                    
                    <select 
                      value={m.roleId}
                      onChange={(e) => handleChangeMemberRole(m.id, e.target.value)}
                      className="bg-[#0b0314] border-none outline-none p-2 rounded text-[10px] font-black uppercase text-white/60 focus:ring-1 focus:ring-[#ff66b2]"
                    >
                      {server.roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSettingsModal;
