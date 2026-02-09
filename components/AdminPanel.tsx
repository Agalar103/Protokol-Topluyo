
import React, { useState, useEffect } from 'react';
import { Member, MessageType } from '../types';

interface AdminPanelProps {
  members: Member[];
  onClose: () => void;
  currentUser: { username: string };
  onSendSystemMessage: (content: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ members, onClose, currentUser, onSendSystemMessage }) => {
  const [banList, setBanList] = useState<string[]>([]);

  useEffect(() => {
    const savedBans = JSON.parse(localStorage.getItem('topluyo_banlist') || '[]');
    setBanList(savedBans);
  }, []);

  const updateBanList = (newList: string[]) => {
    setBanList(newList);
    localStorage.setItem('topluyo_banlist', JSON.stringify(newList));
  };

  const handleBan = (username: string) => {
    if (username === 'anan' || username === 'nana1') return; // Can't ban admins
    if (!banList.includes(username)) {
      const newList = [...banList, username];
      updateBanList(newList);
      onSendSystemMessage(`anan adlı yönetim şu kullanıcıyı perma ban attı başarıyla: ${username}`);
    }
  };

  const handleUnban = (username: string) => {
    if (banList.includes(username)) {
      const newList = banList.filter(u => u !== username);
      updateBanList(newList);
      onSendSystemMessage(`anan adlı yönetim şu kullanıcının banını açtı başarıyla: ${username}`);
    }
  };

  // Simüle edilmiş IP ve Ülke verileri
  const countries = ['Türkiye 🇹🇷', 'Almanya 🇩🇪', 'ABD 🇺🇸', 'Hollanda 🇳🇱', 'Fransa 🇫🇷', 'İngiltere 🇬🇧'];
  
  const getMockIP = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `176.234.${(hash % 255)}.${(hash % 99)}`;
  };

  const getMockCountry = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return countries[hash % countries.length];
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-[#05010a] border-4 border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-red-600/20 bg-red-600/5 flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-1">ADMİN_TERMİNALİ</h2>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">YÖNETİM_VE_SİBER_GÜVENLİK_KONTROLÜ v4.2</p>
          </div>
          <button onClick={onClose} className="p-3 border-2 border-red-600/20 rounded hover:bg-red-600 hover:text-white transition-all text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-x-auto no-scrollbar max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-red-500/50 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="pb-4 pl-4">Durum</th>
                <th className="pb-4">Kullanıcı</th>
                <th className="pb-4">Ülke</th>
                <th className="pb-4">IP Adresi</th>
                <th className="pb-4">Kimlik ID</th>
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
                      <img src={member.avatar} className={`w-10 h-10 rounded-lg border-2 border-white/5 ${banList.includes(member.username) ? 'grayscale' : ''}`} alt="" />
                      <div>
                        <p className={`text-sm font-black uppercase italic ${banList.includes(member.username) ? 'text-red-500 line-through' : 'text-white'}`}>{member.username}</p>
                        <p className="text-[9px] text-white/20 font-bold">NODE_USER</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-black text-white/60">{getMockCountry(member.id)}</span>
                  </td>
                  <td className="py-4">
                    <code className="text-xs font-black text-red-400 bg-red-400/5 px-2 py-1 rounded">{getMockIP(member.id)}</code>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-white/10 uppercase font-mono">{member.id}</span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    {currentUser.username === 'anan' && (
                      <div className="flex justify-end gap-2">
                        {banList.includes(member.username) ? (
                          <button 
                            onClick={() => handleUnban(member.username)}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-sm font-black text-[10px] uppercase italic tracking-tighter hover:brightness-110 shadow-lg"
                          >
                            BAN_KALDIR
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBan(member.username)}
                            className="bg-red-600 text-white px-4 py-1.5 rounded-sm font-black text-[10px] uppercase italic tracking-tighter hover:brightness-110 shadow-lg"
                          >
                            PERMA_BAN
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {banList.length > 0 && (
            <div className="mt-12 p-6 border-2 border-red-600/20 bg-red-600/5 rounded">
              <h3 className="text-xs font-[1000] text-red-500 uppercase tracking-[0.4em] mb-4 italic">AĞDAN_UZAKLAŞTIRILANLAR ({banList.length})</h3>
              <div className="flex flex-wrap gap-2">
                {banList.map(u => (
                  <div key={u} className="flex items-center gap-3 bg-black border border-red-500/30 px-4 py-2">
                    <span className="text-xs font-black text-white italic">{u}</span>
                    <button onClick={() => handleUnban(u)} className="text-red-500 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-red-600/10 border-t border-red-600/20 text-[9px] font-black text-red-500 uppercase tracking-[0.5em] text-center italic">
          GİZLİ_ERİŞİM_YETKİSİ: AKTİF // TÜM_VERİLER_LOGLANMAKTADIR // ADMİN: {currentUser.username.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
