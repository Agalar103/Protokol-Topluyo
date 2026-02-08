
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MainInterface from './components/MainInterface';
import LoginPage from './components/LoginPage';
import ServerSelection from './components/ServerSelection';
import { User, Server } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'server-selection' | 'main'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nebula_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setView('server-selection');
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nebula_user', JSON.stringify(user));
    setView('server-selection');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('nebula_user', JSON.stringify(updatedUser));
  };

  const handleServerSelect = (serverId: string) => {
    setSelectedServerId(serverId);
    setView('main');
  };

  const handleLogout = () => {
    setView('landing');
    setCurrentUser(null);
    setSelectedServerId(null);
    localStorage.removeItem('nebula_user');
  };

  const handleBackToServers = () => {
    setView('server-selection');
  };

  if (view === 'main' && currentUser && selectedServerId) {
    return (
      <div className="h-screen w-full bg-[#0f051a] overflow-hidden">
        <MainInterface 
          user={currentUser} 
          onLogout={handleLogout} 
          initialServerId={selectedServerId}
          onBackToServers={handleBackToServers}
          onUpdateUser={handleUpdateUser}
        />
      </div>
    );
  }

  if (view === 'server-selection' && currentUser) {
    return (
      <ServerSelection 
        user={currentUser} 
        onSelectServer={handleServerSelect} 
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-[#0f051a] overflow-hidden">
      {view === 'landing' ? (
        <LandingPage onLogin={() => setView('login')} />
      ) : (
        <LoginPage 
          onSuccess={handleLoginSuccess} 
          onBack={() => setView('landing')} 
        />
      )}
    </div>
  );
};

export default App;
