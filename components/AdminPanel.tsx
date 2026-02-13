
import React, { useState, useEffect } from 'react';
import { Member, MessageType, AuditLog, Server, Role } from '../types';

interface AdminPanelProps {
  server: Server;
  logs: AuditLog[];
  activeTab: 'members' | 'logs';
  setActiveTab: (tab: 'members' | 'logs') => void;
  onClose: () => void;
  currentUser: { id: string, username: string };
  onSendSystemMessage: (content: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ server, logs, activeTab, setActiveTab, onClose, currentUser, onSendSystemMessage }) => {
  const [banList, setBanList] = useState<string[]>([]);
  const members = server.members;

  useEffect(() => {
    const savedBans = JSON.parse(localStorage.getItem('topluyo_banlist') || '[]');
    setBanList(savedBans);
  }, []);

  const updateBanList = (newList: string[]) => {
    setBanList(newList);
    localStorage.setItem('topluyo_banlist', JSON.stringify(newList));
  };

  const handleBan = (username: string, roleId: string) => {
    // Admin (r1) ve VIP (r4) banlanamaz. Global admin 'anan' asla banlanamaz.
    if (roleId === 'r1' || roleId === 'r4' || username === 'anan') return; 
    if (!banList.includes(username)) {
      const newList = [...banList, username];
      updateBanList(newList);
      onSendSystemMessage(`[YÖNETİM] ${username} adlı kullanıcı siber ağdan perma banlandı.`);
    }
  };

  const handleUnban = (username: string) => {
    if (banList.includes(username)) {
      const newList = banList.filter(u => u !== username);
      updateBanList(newList);
      onSendSystemMessage(`[YÖNETİM] ${username} adlı kullanıcının banı kaldırıldı.`);
    }
  };

  const getActionColor = (action: AuditLog['action']) => {
    switch(action) {
      case 'MESSAGE_SEND': return 'text-green-400';
      case 'MESSAGE_DELETE': return 'text-red-500';
      case 'PROFILE_UPDATE': return 'text-yellow-400';
      case 'WALLET_ACTION': return 'text-[#00ffff]';
      default: return 'text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-[#05010a] border-4 border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-red-600/20 bg-red-600/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-5xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-1">ADMİN_TERMİNALİ</h2>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">SİBER_GÜVENLİK_KONTROLÜ v4.8</p>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-black border border-white/5 p-1">
                <button onClick={() => setActiveTab('members')} className={`px-6 py-2 text-[10px] font-black uppercase italic transition-all ${activeTab === 'members' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}>ÜYELER</button>
                <button onClick={() => setActiveTab('logs')} className={`px-6 py-2 text-[10px] font-black uppercase italic transition-all ${activeTab === 'logs' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}>SİSTEM_LOGLARI</button>
             </div>
             <button onClick={onClose} className="p-3 border-2 border-red-600/20 rounded hover:bg-red-600 hover:text-white transition-all text-red-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeTab === 'members' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-red-500/50 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="pb-4 pl-4">Durum</th>
                  <th className="pb-4">Kullanıcı</th>
                  <th className="pb-4">Yetki</th>
                  <th className="pb-4 text-right pr-4">Eylemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member.id} className={`group transition-colors ${banList.includes(member.username) ? 'bg-red-950/20' : 'hover:bg-red-600/5'}`}>
                    <td className="py-4 pl-4">
                      <div className={`w-2 h-2 rounded-full ${banList.includes(member.username) ? 'bg-black border border-red-500' : (member.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500')}`} />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} className="w-10 h-10 rounded-lg border-2 border-white/5" alt="" />
                        <div>
                          <p className={`text-sm font-black uppercase italic ${banList.includes(member.username) ? 'text-red-500 line-through' : 'text-white'}`}>{member.username}</p>
                          <p className="text-[9px] text-white/20 font-bold">NODE_USER</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] font-black uppercase italic" style={{ color: server.roles.find(r => r.id === member.roleId)?.color }}>
                        {server.roles.find(r => r.id === member.roleId)?.name}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      {(currentUser.username === 'anan' || currentUser.id === server.ownerId) && (
                        <div className="flex justify-end gap-2">
                          {banList.includes(member.username) ? (
                            <button onClick={() => handleUnban(member.username)} className="bg-green-600 text-white px-4 py-1.5 rounded-sm font-black text-[10px] uppercase italic tracking-tighter">BAN_KALDIR</button>
                          ) : (
                            <button 
                              onClick={() => handleBan(member.username, member.roleId)}
                              disabled={member.roleId === 'r1' || member.roleId === 'r4' || member.username === 'anan'}
                              className={`px-4 py-1.5 rounded-sm font-black text-[10px] uppercase italic tracking-tighter transition-all ${member.roleId === 'r1' || member.roleId === 'r4' || member.username === 'anan' ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-red-600 text-white hover:scale-105'}`}
                            >
                              {member.roleId === 'r4' ? 'VIP_IMMUNE' : 'PERMA_BAN'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="space-y-4">
               <div className="bg-red-600/10 p-4 border border-red-600/20 mb-8 font-black text-red-500 text-[10px] uppercase tracking-widest">DİKKAT: TÜM TRAFİK KAYIT ALTINA ALINMAKTADIR.</div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="py-4 pl-4 text-[10px] font-mono text-white/40">{new Date(log.timestamp).toLocaleTimeString()}</td>
                         <td className="py-4 text-xs font-black uppercase text-white/80">{log.username}</td>
                         <td className="py-4"><span className={`text-[10px] font-black uppercase italic ${getActionColor(log.action)}`}>{log.action}</span></td>
                         <td className="py-4 text-xs font-medium text-white/60">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
