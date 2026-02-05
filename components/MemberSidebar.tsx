
import React from 'react';
import { Server, Role, Member } from '../types';

interface MemberSidebarProps {
  activeServer: Server;
}

const MemberSidebar: React.FC<MemberSidebarProps> = ({ activeServer }) => {
  return (
    <div className="hidden xl:flex w-60 bg-[#110524] flex-col border-l border-white/5 shrink-0 overflow-y-auto no-scrollbar">
      <div className="p-4 space-y-8">
        {activeServer.roles.map(role => {
          const members = activeServer.members.filter(m => m.roleId === role.id);
          if (members.length === 0) return null;

          return (
            <div key={role.id}>
              <div className="text-[10px] font-black text-white/20 uppercase mb-3 tracking-widest flex items-center gap-2">
                <span>{role.name}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span>{members.length}</span>
              </div>
              <div className="space-y-1">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
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
                      </div>
                      {member.customStatus && <span className="text-[9px] text-white/30 truncate">{member.customStatus}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div>
          <div className="text-[10px] font-black text-white/20 uppercase mb-3 tracking-widest">EKİPLER</div>
          <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 cursor-pointer text-xs font-bold text-white/60 transition-all">
             <span className="text-blue-400 font-black">#</span> DİSCORD AÇILMASIN AQ
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSidebar;
