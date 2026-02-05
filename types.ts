
export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  APP = 'APP',
  MARKET = 'MARKET',
  STAGE = 'STAGE',
  FORUM = 'FORUM',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface Role {
  id: string;
  name: string;
  color: string;
  icon?: string;
  position: number;
}

export interface Member {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  roleId: string;
  customStatus?: string;
  isSpeaker?: boolean; // For Stage
}

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar: string;
  banner?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  hasSetUsername?: boolean;
  sessions?: string[];
}

export interface Reaction {
  emoji: string;
  count: number;
  me: boolean;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  reactions?: Reaction[];
  hasThread?: boolean;
  embed?: {
    title: string;
    description: string;
    url?: string;
    image?: string;
  };
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
  isPrivate?: boolean;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  ownerId: string;
  channels: Channel[];
  roles: Role[];
  members: Member[];
  isCommunity?: boolean;
}

export interface VoiceState {
  isMuted: boolean;
  isDeafened: boolean;
  isVideoOn: boolean;
  isBackgroundBlurred: boolean;
  inputGain: number;
  outputVolume: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  listenToSelf: boolean;
  currentDB: number;
  selectedInputDevice: string;
  selectedOutputDevice: string;
}

export interface ScreenShareState {
  isActive: boolean;
  resolution: '720p' | '1080p' | '2k' | '4k' | '8k';
  frameRate: 15 | 30 | 60 | 120;
  shareAudio: boolean;
  sourceType: 'window' | 'screen' | 'app';
}

export interface MarketItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: 'Steam' | 'Valorant' | 'Diğer';
}
