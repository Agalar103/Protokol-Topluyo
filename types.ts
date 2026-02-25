
export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  APP = 'APP',
  MARKET = 'MARKET',
  NITRO = 'NITRO',
  STAGE = 'STAGE',
  FORUM = 'FORUM',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  MATCH = 'MATCH',
  WALLET = 'WALLET'
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF'
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
  isSpeaker?: boolean;
  bio?: string;
  banner?: string;
  featuredImage?: string;
  profileBackground?: string;
  profileSong?: {
    title: string;
    artist: string;
    albumArt: string;
    spotifyUrl?: string;
  };
  favoriteGames?: {
    name: string;
    rank: string;
    rankIcon: string;
  }[];
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar: string;
  banner?: string;
  featuredImage?: string;
  profileBackground?: string;
  profileSong?: {
    title: string;
    artist: string;
    albumArt: string;
    spotifyUrl?: string;
  };
  favoriteGames?: {
    name: string;
    rank: string;
    rankIcon: string;
  }[];
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio?: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface Message {
  id: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
  type: MessageType;
  timestamp: Date;
  isDeleted?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  action: 'MESSAGE_SEND' | 'MESSAGE_DELETE' | 'PROFILE_UPDATE' | 'LOGIN' | 'LOGOUT' | 'WALLET_ACTION';
  details: string;
  rawData?: any;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  inviteUrl: string;
  isPremium: boolean;
  channels: Channel[];
  roles: Role[];
  members: Member[];
}

export interface VoiceState {
  isMuted: boolean;
  isDeafened: boolean;
  isVideoOn: boolean;
  isBackgroundBlurred: boolean;
  noiseSuppression?: boolean;
  echoCancellation?: boolean;
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
  category: 'Steam' | 'Valorant' | 'Merch' | 'Diğer';
}
