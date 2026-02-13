
import React, { useState, useEffect } from 'react';
import { Server, Role, Member } from '../types';

interface MemberSidebarProps {
  activeServer: Server;
  onMemberClick: (member: Member) => void;
  onViewProfile?: (member: Member) => void;
  onSendMessage?: (member: Member) => void;
}

const MemberSidebar: React.FC<MemberSidebarProps> = ({ activeServer, onMemberClick, onViewProfile, onSendMessage }) => {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, member: Member | null }>({ x: 0, y: 0, member: null });

  const handleContextMenu = (e: React.MouseEvent, member: Member) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, member });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu({ x: 0, y: 0, member: null });
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Rol sıralamasına göre listele
  const sortedRoles = [...activeServer.roles].sort((a, b) => a.position - b.position);

  return (
    <div className="hidden xl:flex w-60 bg-[#110524] flex-col border-l border-white/5 shrink-0 overflow-y-auto no-scrollbar relative">
      <div className="p-4 space-y-8">
        {sortedRoles.map(role => {
          const members = activeServer.members.filter(m => m.roleId === role.id);
          if (members.length === 0) return null;

          return (
            <div key={role.id}>
              <div className="text-[10px] font-black text-white/20 uppercase mb-3 tracking-widest flex items-center gap-2">
                <span style={{ color: role.color }}>{role.name}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span>{members.length}</span>
              </div>
              <div className="space-y-1">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    onClick={() => onMemberClick(member)}
                    onContextMenu={(e) => handleContextMenu(e, member)}
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                  >
                    <div className="relative shrink-0">
                      <img src={member.avatar} className="w-8 h-8 rounded-xl bg-purple-900 shadow-md" alt={member.username} />
                      <div className={`absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full border-2 border-[#110524] ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold truncate group-hover:brightness-125 transition-all" style={{ color: role.color }}>
                          {member.username}
                        </span>
                        {role.id === 'r1' && (
                          <div className="w-3 h-3 bg-[#ff66b2] rounded-full flex items-center justify-center shadow-[0_0_5px_rgba(255,102,178,0.5)]">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          </div>
                        )}
                        {role.id === 'r4' && (
                          <span className="text-[10px] animate-pulse">✨</span>
                        )}
                      </div>
                      {member.customStatus && <span className="text-[9px] text-white/30 truncate">{member.customStatus}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Context Menu */}
      {contextMenu.member && (
        <div 
          className="fixed z-[9999] bg-[#0b0314] border-2 border-white/10 shadow-2xl p-2 w-48 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-2 border-b border-white/5 mb-1 flex items-center gap-2">
             <img src={contextMenu.member.avatar} className="w-4 h-4 rounded-sm" alt="" />
             <span className="text-[10px] font-black text-white/40 uppercase italic truncate">{contextMenu.member.username}</span>
          </div>
          <button 
            onClick={() => onViewProfile?.(contextMenu.member!)}
            className="w-full text-left px-3 py-2 text-[11px] font-bold text-white hover:bg-[#ff00ff] transition-all uppercase italic flex items-center justify-between group"
          >
            <span>PROFİLE_BAK</span>
            <span className="opacity-0 group-hover:opacity-100">👁️</span>
          </button>
          <button 
            onClick={() => onSendMessage?.(contextMenu.member!)}
            className="w-full text-left px-3 py-2 text-[11px] font-bold text-white hover:bg-[#00ffff] hover:text-black transition-all uppercase italic flex items-center justify-between group"
          >
            <span>MESAJ_GÖNDER</span>
            <span className="opacity-0 group-hover:opacity-100">💬</span>
          </button>
          <div className="h-px bg-white/5 my-1" />
          <button 
            className="w-full text-left px-3 py-2 text-[11px] font-bold text-red-500/50 hover:text-white hover:bg-red-600 transition-all uppercase italic flex items-center justify-between group"
          >
            <span>ENGELLE</span>
            <span className="opacity-0 group-hover:opacity-100">🚫</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberSidebar;
