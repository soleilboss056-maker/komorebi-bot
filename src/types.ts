export interface BotConfig {
  token: string;
  status: 'online' | 'idle' | 'dnd' | 'invisible';
  statusActivityText?: string;
  statusActivityType?: string;
  isRunning: boolean;
  aiEnabled: boolean;
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'custom';
  apiKey: string;
  customAiEndpoint?: string;
  customAiModel?: string;
  systemPrompt: string;
  botName: string;
  ticketPrefix: string;

  // --- Guard Module ---
  guardAntiraid: boolean;
  guardAntispam: boolean;
  guardAutoflood?: boolean;
  guardAntilink: boolean;
  guardAntibot: boolean;
  guardLimitSpam: number;
  guardLimitSpamTime: number;
  guardLimitMention: number;
  guardLimitMentionTime: number;
  guardLimitLinks: number;
  guardLimitLinksTime: number;
  guardSanctionSpam: 'timeout' | 'kick' | 'ban' | 'warn';
  guardSanctionLink: 'timeout' | 'kick' | 'ban' | 'warn';
  guardSanctionRaid: 'timeout' | 'kick' | 'ban' | 'warn';
  guardWhitelist: string[]; // Role or channel IDs
  guardLogsChannelId: string;
  guardCaptcha: boolean;
  guardCaptchaRoleVerifiedId: string;
  guardCaptchaChannelId: string;
  guardCaptchaMaxAttempts?: number;
  guardCaptchaTimeoutMinutes?: number;
  guardCaptchaFailAction?: 'kick' | 'block';
  guardCaptchaRoleUnverifiedId?: string;
  fortressMode: boolean;
  guardAutomod?: boolean;
  guardAutomodWords?: string[];
  linkProtectionEnabled?: boolean;
  linkWhitelistChannels?: string[];
  linkWhitelistRoles?: string[];
  linkWhitelistDomains?: string[];
  linkAllowDefaultMedia?: boolean;
  linkAllowedRoleId?: string;

  // --- Economy Module ---
  economyEnabled?: boolean;
  currencyName: string;
  currencyEmoji: string;
  salaryWorkMin: number;
  salaryWorkMax: number;
  salaryWorkCooldown: number; // in minutes
  salaryCrimeMin: number;
  salaryCrimeMax: number;
  salaryCrimeCooldown: number; // in minutes
  robSuccessRate: number; // 1-100
  robMaxFine: number;

  // --- Leveling Module ---
  levelXpStatus: boolean;
  xpRateMin: number;
  xpRateMax: number;
  xpRateCooldown: number; // in seconds
  vocalXpAmount: number;
  vocalXpMinutes: number;
  levelRewards: Record<string, string>; // Map string representation of level to role ID
  levelBlacklist: string[]; // Channel IDs
  levelAnnouncement: 'channel' | 'current' | 'dm' | 'off';
  levelAnnouncementChannelId: string;
  levelMoneyStatus: boolean;
  levelMoneyRewardAmount: number;

  // --- ZenTickets Module ---
  ticketChannelId: string;
  ticketEmbedTitle: string;
  ticketEmbedDesc: string;
  ticketButtonText: string;
  ticketStaffRoleId: string;
  ticketAdminRoleId?: string;
  ticketCategoryId: string;
  ticketLogsChannelId: string;
  ticketButtons?: string[];

  // --- ZenLang Module ---
  langReactionStatus: boolean;
  langAutoPairs: { sourceId: string; mirrorId: string; targetLang: string }[];

  // --- Events Module ---
  eventBonusMessagesRequired: number;
  eventBonusMoneyReward: number;

  // --- Welcome & Leave Module ---
  welcomeEnabled?: boolean;
  welcomeChannelId?: string;
  welcomeMessage?: string;
  leaveEnabled?: boolean;
  leaveChannelId?: string;
  leaveMessage?: string;
  videoChannelId?: string;
  videoYtChannelLink?: string;
  guardAuthorizedDomains?: string[];
  channelLinkRules?: Record<string, string>;

  leaderboardMoneyChannelId?: string;
  leaderboardMoneyMessageId?: string;
  leaderboardMoneyLastHash?: string;

  // --- Expanded Configurations for Interactive /config ---
  channelAnnoncesId?: string;
  channelPartenariatsId?: string;
  channelLogsId?: string;
  channelBienvenueId?: string;
  channelAuRevoirId?: string;
  channelTicketsId?: string;
  channelLevelUpId?: string;
  channelCommandesId?: string;
  channelBoutiqueId?: string;
  channelCasinoId?: string;
  roleAdminBotId?: string;
  roleStaffTicketsId?: string;
  roleVipId?: string;
  partnershipValidationStatus?: boolean;
  permanentInviteUrl?: string;
  channelVideosId?: string;
  videoCreatorChannelUrl?: string;
  candidatureChannelId?: string;
  candidatureQuestion1?: string;
  candidatureQuestion2?: string;
  candidatureQuestion3?: string;
  language?: 'fr' | 'en';
  roleSalaries?: Record<string, number>;
  roleMultipliers?: Record<string, number>;
  roleDiscounts?: Record<string, number>;
  welcomeChannelEnabled?: boolean;
  maintenanceMode?: boolean;
  levelChannelId?: string;
  translationEnabled?: boolean;
  translationAutoDelete?: boolean;
  reglement_title?: string;
  reglement_desc?: string;
  reglement_art1?: string;
  reglement_art2?: string;
  reglement_art3?: string;
  reglement_art4?: string;
  reglement_role_id?: string;
  autoroleEnabled?: boolean;
  autoroleRoleId?: string;
  lastSentChangelogVersion?: string;

  // --- Counting Module ---
  countingChannelId?: string;
  countingCurrentNumber?: number;
  countingStartNumber?: number;
  countingAllowDoublePost?: boolean;
  countingDeleteInvalid?: boolean;
  countingResetOnFail?: boolean;
  countingCelebrationInterval?: number;
  countingLastUserId?: string;
  countingEmoji?: string;
  countingHighScore?: number;
  countingSaves?: number;
  countingUserContributions?: Record<string, number>;

  // --- AutoMod Module ---
  automodMentionsEnabled?: boolean;
  automodMentionsLimit?: number;
  automodMentionsActions?: string[];
  automodSpamContentEnabled?: boolean;
  automodSpamContentActions?: string[];
  automodFlaggedWordsEnabled?: boolean;
  automodFlaggedWordsActions?: string[];
  automodCustomWordsEnabled?: boolean;
  automodCustomWords?: string[];
  automodCustomWordsActions?: string[];
  automodSensitiveFilterEnabled?: boolean;

  // --- Birthday Module ---
  birthdayEnabled?: boolean;
  birthdayChannelId?: string;

  // --- Real-time Logs and AI Tickets ---
  logsEnabled?: boolean;
  logsCategoryId?: string;
  logMessagesChannelId?: string;
  logModerationChannelId?: string;
  logEconomieAdminChannelId?: string;
  logAutomodSpamChannelId?: string;
  logMembresChannelId?: string;
  logTicketsChannelId?: string;
  logVocalChannelId?: string;
  logServeurChannelId?: string;
  ticketAiEnabled?: boolean;
  badWordsEnabled?: boolean;
  badWordsSanction?: 'delete' | 'warn' | 'timeout';
  boostEnabled?: boolean;
  boostChannelId?: string;
  tempVoiceCreatorChannelId?: string;
  tempVoiceCategoryId?: string;

  // --- Social Feeds & Video Announcements ---
  socialFeeds?: SocialFeedChannel[];
  leftAt?: number | null;
}

export interface SocialFeedChannel {
  id: string;
  platform: 'youtube' | 'twitch' | 'twitter' | 'tiktok';
  channelNameOrId: string;
  discordChannelId: string;
  customMessage?: string;
  lastVideoId?: string;
  enabled: boolean;
  addedAt: string;
  channelTitle?: string;
}

export interface LiveMusicTrack {
  title: string;
  duration?: string;
  requestedBy: string;
  requestedById: string;
  thumbnail?: string;
  url?: string;
  streamUrl?: string | null;
}

export interface LiveMusicSession {
  guildId: string;
  controllerId: string | null;
  voiceChannelId: string | null;
  textChannelId: string | null;
  panelMessageId: string | null;
  songs: LiveMusicTrack[];
  currentSongIndex: number;
  isPlaying: boolean;
  volume: number;
  isLoop: boolean;
  isShuffle: boolean;
  lastInteractionTimestamp: number;
}

export interface BotInfo {
  tag: string;
  id: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  guildsCount: number;
  usersCount: number;
  channelsCount: number;
  ping: number;
}

export interface BotLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command' | 'moderation' | 'ai' | 'economy';
  message: string;
  user?: string;
  guild?: string;
  guildId?: string;
}

export interface Ticket {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  status: 'open' | 'closed';
  category: 'support' | 'billing' | 'tiktok' | 'complaint' | 'partner' | 'recruitment' | 'question' | 'admin' | 'other';
  createdAt: string;
  closedAt?: string;
  guildId?: string;
  isLocked?: boolean;
}

export interface TrainingItem {
  id: string;
  trigger: string;
  response: string;
  createdAt: string;
  guildId?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  wallet: number;
  bank: number;
  xp: number;
  level: number;
  inventory: Record<string, number>; // itemId -> count
  warnsCount: number;
  warns: { id: string; reason: string; timestamp: string }[];
  levelBackgroundUrl?: string;
  lastWork?: string;
  lastDaily?: string;
  lastCrime?: string;
  lastRob?: string;
  guildId?: string;

  // --- RPG / Game Module ---
  rpgLevel?: number;
  rpgXp?: number;
  rpgWins?: number;
  rpgLosses?: number;
  rpgHp?: number;
  rpgAttack?: number;
  rpgDefense?: number;
  rpgWeapon?: string;
  rpgCoins?: number;
  rpgPotions?: number;
  rpgQuestsCompleted?: number;
  inviteCount?: number;
  invitesCount?: number;
  invitedMembers?: string[];
  tempMultipliers?: { factor: number; expiresAt: string }[];
  memberMultipliers?: number;
  memberDiscounts?: number;
  snakeHighScore?: number;
  brickHighScore?: number;
  dinoHighScore?: number;
  astroHighScore?: number;
  sokobanLevel?: number;
  rpgClass?: string;
  rpgShield?: string;
  rpgHasUltimate?: boolean;
  rpgOwnedWeapons?: string[];
  rpgOwnedArmors?: string[];
  rpgOwnedBags?: string[];
  rpgEquippedWeapon?: string;
  rpgEquippedArmor?: string;
  rpgEquippedBag?: string;

  // --- Phone Module ---
  hasPhone?: boolean;
  contacts?: { id: string; pseudo: string; addedAt: string }[];
  blockedUsers?: string[];
  phoneNotifications?: { type: 'message' | 'virement'; from: string; amount?: number; message?: string; timestamp: string; read: boolean }[];
  phoneNotes?: { id: string; title: string; content: string; updatedAt: string }[];
  phoneAlarms?: { id: string; hour: number; minute: number; message: string; repeat: boolean }[];
  phoneSettings?: { theme?: string; lang?: string; notificationsEnabled?: boolean };
  rpgLastQuest?: number;
  lastTrivia?: number;

  // --- Profile & Customizations ---
  bio?: string;
  birthday?: string;
  nicknameHistory?: string[];
  joinedAtHistory?: string[];
  muteHistory?: { id: string; reason: string; timestamp: string; duration?: string }[];
  leftAt?: number | null;
}

export interface GiftCard {
  id: string; // the code
  value: number;
  tier: 'commun' | 'rare' | 'epique' | 'legendaire';
  maxUses: number | 'infini';
  currentUses: number;
  expiration: string | 'off'; // e.g. '30-06-2026'
  claimedBy: string[]; // user IDs
  guildId?: string;
}

export interface EggItem {
  id: string; // name
  price: number;
  rewardType: 'eco' | 'xp' | 'role';
  rewardValue: string; // e.g. "1000", "VIP"
  guildId?: string;
}

export interface DashboardState {
  config: BotConfig;
  info: BotInfo | null;
  logs: BotLog[];
  tickets: Ticket[];
  training: TrainingItem[];
  users: UserProfile[];
  giftcards: GiftCard[];
  eggs: EggItem[];
  isServerConnected: boolean;
}
