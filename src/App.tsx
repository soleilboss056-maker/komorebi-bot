import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Shield,
  Zap,
  Settings,
  Terminal,
  Ticket as TicketIcon,
  Power,
  RefreshCw,
  Trash2,
  Plus,
  Check,
  X,
  Activity,
  User,
  Server,
  Sliders,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  Coins,
  TrendingUp,
  Gift,
  ShoppingBag,
  Clock,
  Eye,
  AlertTriangle,
  UserCheck,
  Languages,
  Megaphone,
  Globe,
  Code,
  Copy,
  ExternalLink,
  Scale,
  FileText,
  ShieldCheck,
  Music,
  Share2,
  Play,
  Pause,
  SkipForward,
  Volume2,
  RefreshCcw,
  Key,
  Square,
  Shuffle,
  Repeat,
  Tv,
  Video,
  Radio
} from 'lucide-react';
import { BotConfig, BotInfo, BotLog, Ticket, TrainingItem, UserProfile, GiftCard, EggItem, SocialFeedChannel, LiveMusicSession } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'guard' | 'economy' | 'leveling' | 'giftcards' | 'eggs' | 'tickets' | 'logs' | 'hosting' | 'legal' | 'music' | 'social' | 'tutorial'>('overview');
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const [copiedSiteCode, setCopiedSiteCode] = useState(false);
  const [copiedSiteUrl, setCopiedSiteUrl] = useState(false);
  const [copiedPrivacy, setCopiedPrivacy] = useState(false);
  const [copiedTos, setCopiedTos] = useState(false);
  const [copiedSupportRules, setCopiedSupportRules] = useState(false);

  // --- Music & Social Feeds Dashboard States ---
  const [musicSession, setMusicSession] = useState<LiveMusicSession | null>(null);
  const [musicInput, setMusicInput] = useState('');
  const [musicLoading, setMusicLoading] = useState(false);

  // --- Video Tutorial States ---
  const [tutorialPlaying, setTutorialPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const [socialPlatform, setSocialPlatform] = useState<'youtube' | 'twitch' | 'twitter' | 'tiktok'>('youtube');
  const [socialChannelName, setSocialChannelName] = useState('');
  const [socialChannelTitle, setSocialChannelTitle] = useState('');
  const [socialDiscordChannelId, setSocialDiscordChannelId] = useState('');
  const [socialCustomMessage, setSocialCustomMessage] = useState('');
  const [socialChecking, setSocialChecking] = useState(false);

  const privacyPolicyText = `POLITIQUE DE CONFIDENTIALITÉ OFFICIELLE DE KOMOREBI BOT
Dernière mise à jour : 2026 — Version 4.0 (Conforme RGPD & Discord Developer Policy)

ARTICLE 1. ENGAGEMENT GÉNÉRAL ET TRANSPARENCE
La présente Politique de Confidentialité décrit la manière dont Komorebi Bot ("le Bot", "Nous") collecte, traite, stocke et protège les données associées à votre utilisation sur les serveurs Discord et via son tableau de bord web. Nous nous engageons fermement à respecter la vie privée de tous les utilisateurs et à minimiser la collecte de données au strict nécessaire.

ARTICLE 2. DONNÉES COLLECTÉES ET FINALITÉS
Komorebi Bot traite uniquement les identifiants techniques et les données de jeu nécessaires au bon fonctionnement de ses modules :
2.1 Identifiants Techniques Discord :
- Discord User ID (Identifiant unique du membre) : pour associer les niveaux d'expérience (XP), le solde d'économie virtuelle, l'inventaire et les statistiques RPG.
- Discord Guild ID (Identifiant unique du serveur) : pour lier les configurations personnalisées (salon de bienvenue, rôles automatiques, filtres de sécurité, devises).
- Discord Channel ID & Message ID : pour acheminer les notifications d'annonces, la gestion des tickets et la modération en temps réel.
2.2 Données de Progression et d'Économie Virtuelle :
- Solde du portefeuille et de la banque virtuelle, rôles achetés en boutique.
- Niveau vocal/textuel, points d'expérience (XP) et cartes cadeaux échangées.
- Historique des tickets de support ouverts et transcripts de conversation.
2.3 Données de Modération et Sécurité :
- Nombre d'avertissements (warns), bannissements ou mutes temporaires enregistrés sur un serveur par les modérateurs.

ARTICLE 3. STOCKAGE, SÉCURITÉ ET INFRASTRUCTURE
Toutes les données sont stockées de manière chiffrée et sécurisée dans la base de données de classe entreprise Google Firebase / Firestore. L'infrastructure est hébergée sur des serveurs sécurisés Google Cloud Platform (GCP) garantissant un taux de disponibilité supérieur à 99,9%. Aucune donnée n'est stockée en clair sur des serveurs non sécurisés ou des disques locaux non chiffrés.

ARTICLE 4. POLITIQUE DE RÉTENTION ET PURGE AUTOMATIQUE SOUS 14 JOURS (Droit à l'Oubli)
Conformément au principe de minimisation des données et au RGPD :
4.1 Départ d'un Membre d'un Serveur :
Lorsqu'un utilisateur quitte un serveur Discord sur lequel le Bot est présent, un chronomètre automatique de rétention de 14 jours est déclenché. Si le membre ne réintègre pas le serveur dans un délai de 14 jours (336 heures), l'intégralité de son profil utilisateur (XP, portefeuille virtuel, niveaux, inventaires) associée à ce serveur est DÉFINITIVEMENT ET IRRÉVOCABLEMENT SUPPRIMÉE de la base de données.
4.2 Expulsion / Retrait du Bot d'un Serveur :
Si Komorebi Bot est retiré ou expulsé d'un serveur Discord, la configuration du serveur ainsi que l'ensemble des données de tous les membres associés à ce serveur entrent dans une période de grâce de 14 jours. À l'échéance des 14 jours, l'intégralité du dossier du serveur (configs, tickets, logs, profils membres) est AUTOMATIQUEMENT PURGÉE ET EFFACÉE sans possibilité de récupération.

ARTICLE 5. NON-DIVULGATION ET TIERS
Komorebi Bot ne vend, ne loue, ne commercialise et ne cède AUCUNE donnée d'utilisateur à des tiers, courtiers en données ou entreprises publicitaires. Les données ne sont manipulées par aucun système tiers en dehors des infrastructures nécessaires (API Discord, Google Cloud / Firebase).

ARTICLE 6. DROITS DE L'UTILISATEUR (RGPD & DROITS D'ACCÈS)
Chaque utilisateur dispose d'un droit d'accès, de rectification et de suppression totale de ses données. Vous pouvez exercer ce droit à tout moment :
- En utilisant la commande /ticket sur un serveur utilisant le bot pour contacter l'équipe support.
- En formulant une demande directe de suppression immédiate auprès des administrateurs du bot.`;

  const termsOfServiceText = `CONDITIONS GÉNÉRALES D'UTILISATION (CGU) OFFICIELLES DE KOMOREBI BOT
Dernière mise à jour : 2026 — Version 4.0

ARTICLE 1. ACCEPTATION DES CONDITIONS
En ajoutant Komorebi Bot à un serveur Discord ou en interagissant avec l'une de ses commandes (slash commands, boutons, menus déroulants), vous reconnaissez avoir lu, compris et accepté sans réserve les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, vous devez immédiatement retirer le bot de votre serveur ou cesser de l'utiliser.

ARTICLE 2. CONFORMITÉ AUX CONDITIONS DE DISCORD
L'utilisation de Komorebi Bot est soumise au respect strict des Conditions de Service de Discord (Discord Terms of Service) et des Directives de la Communauté Discord (Discord Community Guidelines). Tout comportement violant les règles de Discord entraîne l'interdiction immédiate d'utiliser le Bot.

ARTICLE 3. RÈGLES D'UTILISATION ET COMPORTEMENTS INTERDITS
3.1 Exploitation de Bugs et Spams :
- Il est strictement interdit d'exploiter intentionnellement des failles de sécurité, bugs d'économie ou glitches de duplication du bot.
- L'utilisation de scripts automatisés, de self-bots ou de spams de commandes pour fausser les classements d'XP ou manipuler l'économie est formellement interdite.
3.2 Contenu Illégal et Nuisible :
- Il est interdit d'utiliser les fonctionnalités de personnalisation du bot (annonces, embeds, tickets, boutique) pour diffuser du contenu haineux, diffamatoire, obscène, illégal ou faisant la promotion d'activités malveillantes.
3.3 Attaques et Reverse Engineering :
- Toute tentative d'attaque par déni de service (DDoS), de tentative d'injection de code ou d'ingénierie inverse sur le bot ou son infrastructure web est passible de poursuites et d'un bannissement irrévocable.

ARTICLE 4. ÉCONOMIE VIRTUELLE ET MONNAIES DU BOT
Toutes les devises virtuelles (pièces, argent en banque, or d'aventure, ZenEggs, items) présentes dans Komorebi Bot sont de pure nature ludique et fictive. Elles n'ont aucune valeur monétaire réelle dans le monde réel, ne sont pas convertibles en monnaie fiduciaire et ne peuvent faire l'objet d'aucun remboursement ou transaction financière réelle.

ARTICLE 5. DISPONIBILITÉ DU SERVICE ET GARANTIE D'HÉBERGEMENT
Komorebi Bot est conçu pour fonctionner 24 heures sur 24 et 7 jours sur 7. Toutefois, l'équipe de développement se réserve le droit d'interrompre momentanément le service sans préavis pour effectuer des mises à jour, corrections de bugs ou opérations de maintenance de l'infrastructure Cloud Run. Le Bot est fourni "tel quel" sans garantie absolue de fonctionnement ininterrompu.

ARTICLE 6. SANCTIONS ET RÉSILIATION D'ACCÈS
L'équipe d'administration de Komorebi Bot se réserve le droit discrétionnaire de révoquer l'accès d'un utilisateur ou de blacklister un serveur Discord entier en cas de non-respect avéré des présentes CGU, sans préavis ni compensation.`;

  const supportRulesText = `RÈGLEMENT OFFICIEL DU SERVEUR SUPPORT DISCORD
Dernière mise à jour : 2026 — Version Officielle à Copier

📌 RÈGLE 1. COURTOISIE, RESPECT ET POLITESSE
Le respect est obligatoire entre tous les membres et envers l'équipe du staff (Fondateurs, Administrateurs, Modérateurs, Supports). Les insultes, le harcèlement, la provocation, les propos discriminatoires, racistes, sexistes, homophobes ou haineux sont strictement interdits sous peine de bannissement immédiat.

📌 RÈGLE 2. PAS DE SPAM, NI D'AUTOPROMOTION NON AUTORISÉE
- Le spam, le flood, l'abus de majuscules ou de mentions inutiles (@everyone, @here, mentions répétées du staff) sont interdits.
- La publicité sauvage (envois de liens de serveurs Discord, chaînes YouTube/Twitch non sollicitées en MP ou dans les salons généraux) est strictement interdite.

📌 RÈGLE 3. UTILISATION CORRECTE DES TICKETS DE SUPPORT
- Avant de créer un ticket de support, veuillez vérifier si la commande /help ou /tutoriel ne répond pas déjà à votre question.
- Lorsque vous ouvrez un ticket, expliquez clairement et précisément votre problème dès le premier message avec des captures d'écran si nécessaire.
- Soyez patient : le staff est composé de bénévoles qui répondent dans les plus brefs délais. L'ouverture de tickets multiples pour la même demande est interdite.

📌 RÈGLE 4. PROTECTION DE LA VIE PRIVÉE ET SÉCURITÉ
Ne partagez JAMAIS d'informations confidentielles ou sensibles dans les salons textuels ou les tickets (tokens de bot, mots de passe, cartes bancaires, adresses IP). Le staff du serveur ne vous demandera JAMAIS votre mot de passe Discord.

📌 RÈGLE 5. ÉCHELLE DES SANCTIONS DU STAFF
L'équipe de modération applique une politique de sanctions graduelles en fonction de la gravité de l'infraction :
1️⃣ Avertissement verbal ou écrit (/warn)
2️⃣ Exclusion temporaire de la parole (Mute de 1h à 24h)
3️⃣ Expulsion du serveur support (Kick)
4️⃣ Bannissement temporaire ou définitif du serveur support et blacklistage du bot (Ban)

📌 RÈGLE 6. RESPECT DES DÉCISIONS DU STAFF ET CONTESTATIONS
Les décisions prises par l'équipe de modération sont souveraines. Si vous souhaitez contester une sanction, veuillez le faire de manière calme et argumentée via un ticket dédié, et non dans les salons publics.`;

  const handleCopyPrivacy = () => {
    navigator.clipboard.writeText(privacyPolicyText);
    setCopiedPrivacy(true);
    showAlert('success', "Politique de Confidentialité copiée dans le presse-papier !");
    setTimeout(() => setCopiedPrivacy(false), 3000);
  };

  const handleCopyTos = () => {
    navigator.clipboard.writeText(termsOfServiceText);
    setCopiedTos(true);
    showAlert('success', "Conditions d'Utilisation (CGU) copiées dans le presse-papier !");
    setTimeout(() => setCopiedTos(false), 3000);
  };

  const handleCopySupportRules = () => {
    navigator.clipboard.writeText(supportRulesText);
    setCopiedSupportRules(true);
    showAlert('success', "Règlement Officiel du Serveur Support copié dans le presse-papier !");
    setTimeout(() => setCopiedSupportRules(false), 3000);
  };

  const siteDirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/site` : '/site';

  const handleCopySiteUrl = () => {
    navigator.clipboard.writeText(siteDirectUrl);
    setCopiedSiteUrl(true);
    showAlert('success', "Lien direct du site vitrine copié dans le presse-papier !");
    setTimeout(() => setCopiedSiteUrl(false), 3000);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = 'https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot';
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInviteCode(true);
    showAlert('success', "Lien d'invitation Discord copié dans le presse-papier !");
    setTimeout(() => setCopiedInviteCode(false), 3000);
  };

  const handleCopySiteCode = () => {
    const siteCode = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Komorebi Bot - Bot Discord Officiel</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
  <!-- Header -->
  <header class="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xl">K</div>
      <span class="font-extrabold text-xl text-white">Komorebi Bot</span>
    </div>
    <a href="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot" target="_blank" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30">Inviter le Bot</a>
  </header>

  <!-- Hero Section -->
  <main class="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
    <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight">
      Le Bot Discord Ultime pour <span class="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Gérer, Protéger & Animer</span> votre Serveur.
    </h1>
    <p class="text-lg text-slate-300 max-w-2xl mx-auto">
      Système de tickets multilingue, modération Guard renforcée, mini-jeux RPG et économie complète. Un seul bot pour tout faire.
    </p>
    <div>
      <a href="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot" target="_blank" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105">
        Ajouter Komorebi à Discord 🚀
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500">
    Komorebi Bot © 2026 — Tous droits réservés.
  </footer>
</body>
</html>`;
    navigator.clipboard.writeText(siteCode);
    setCopiedSiteCode(true);
    showAlert('success', "Code source du site copié dans le presse-papier !");
    setTimeout(() => setCopiedSiteCode(false), 3000);
  };
  
  // State
  const [config, setConfig] = useState<BotConfig>({
    token: '',
    status: 'online',
    isRunning: false,
    aiEnabled: true,
    translationEnabled: true,
    translationAutoDelete: false,
    aiProvider: 'gemini',
    apiKey: '',
    customAiEndpoint: '',
    customAiModel: '',
    systemPrompt: '',
    botName: '',
    ticketPrefix: 'ticket-',

    // Guard Defaults
    guardAntiraid: false,
    guardAntispam: true,
    guardAntilink: true,
    guardAntibot: false,
    guardLimitSpam: 5,
    guardLimitSpamTime: 5,
    guardLimitMention: 4,
    guardLimitMentionTime: 10,
    guardLimitLinks: 3,
    guardLimitLinksTime: 10,
    guardSanctionSpam: 'timeout',
    guardSanctionLink: 'warn',
    guardSanctionRaid: 'ban',
    guardWhitelist: [],
    guardLogsChannelId: '',
    guardCaptcha: false,
    guardCaptchaRoleVerifiedId: '',
    guardCaptchaChannelId: '',
    fortressMode: false,

    // Economy Defaults
    currencyName: 'pièces',
    currencyEmoji: '🪙',
    salaryWorkMin: 100,
    salaryWorkMax: 500,
    salaryWorkCooldown: 10,
    salaryCrimeMin: 200,
    salaryCrimeMax: 1000,
    salaryCrimeCooldown: 30,
    robSuccessRate: 40,
    robMaxFine: 300,

    // Leveling Defaults
    levelXpStatus: true,
    xpRateMin: 15,
    xpRateMax: 25,
    xpRateCooldown: 60,
    vocalXpAmount: 10,
    vocalXpMinutes: 5,
    levelRewards: {},
    levelBlacklist: [],
    levelAnnouncement: 'current',
    levelAnnouncementChannelId: '',
    levelMoneyStatus: true,
    levelMoneyRewardAmount: 1000,

    // Tickets Defaults
    ticketChannelId: '',
    ticketEmbedTitle: '🎫 Centre d\'Assistance Technique',
    ticketEmbedDesc: 'Besoin d\'aide ? Ouvrez un ticket d\'assistance d\'un simple clic.',
    ticketButtonText: 'Ouvrir un ticket',
    ticketStaffRoleId: '',
    ticketCategoryId: '',
    ticketLogsChannelId: '',

    // ZenLang Defaults
    langReactionStatus: true,
    langAutoPairs: [],

    // Events Defaults
    eventBonusMessagesRequired: 100,
    eventBonusMoneyReward: 2500
  });

  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [training, setTraining] = useState<TrainingItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [giftcards, setGiftcards] = useState<GiftCard[]>([]);
  const [eggs, setEggs] = useState<EggItem[]>([]);
  const [isAutoKeepAlive, setIsAutoKeepAlive] = useState<boolean>(() => {
    return localStorage.getItem('komorebi_auto_keep_alive') === 'true';
  });
  
  // Custom states for RPG, detailed search, and broadcast tools
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementRole, setAnnouncementRole] = useState('everyone');
  const [announcementChannel, setAnnouncementChannel] = useState('');
  const [isAdminActionLoading, setIsAdminActionLoading] = useState(false);

  // Multi-server state
  const [guilds, setGuilds] = useState<{ id: string; name: string; memberCount: number; iconUrl: string }[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState<string>('1010101010101010');

  // Safe fetch helper to guarantee JSON responses and prevent HTML/SPA fallback errors
  const safeFetchJson = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  };

  // --- Music & Social Feeds Handlers ---
  const fetchMusicSession = async () => {
    try {
      const data = await safeFetchJson(`/api/music/session?guildId=${selectedGuildId}`);
      if (data) {
        setMusicSession(data);
      }
    } catch (e) {
      console.error("Error fetching music session:", e);
    }
  };

  useEffect(() => {
    fetchMusicSession();
    const interval = setInterval(fetchMusicSession, 5000);
    return () => clearInterval(interval);
  }, [selectedGuildId]);

  const handleMusicControl = async (action: string, payload?: any) => {
    setMusicLoading(true);
    try {
      const data = await safeFetchJson('/api/music/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId, action, ...payload })
      });
      if (data) {
        setMusicSession(data);
        if (action === 'add') {
          setMusicInput('');
          showAlert('success', "Morceau ajouté à la file d'attente !");
        }
      }
    } catch (e) {
      showAlert('error', "Échec de la commande musicale.");
    } finally {
      setMusicLoading(false);
    }
  };

  const handleAddSocialFeed = async (e: FormEvent) => {
    e.preventDefault();
    if (!socialChannelName.trim()) {
      showAlert('error', "Veuillez entrer un ID de chaîne, lien ou pseudo !");
      return;
    }

    const currentFeeds = config.socialFeeds || [];
    const newFeed: SocialFeedChannel = {
      id: `feed_${Date.now()}`,
      platform: socialPlatform,
      channelNameOrId: socialChannelName.trim(),
      channelTitle: socialChannelTitle.trim() || socialChannelName.trim(),
      discordChannelId: socialDiscordChannelId.trim() || config.channelAnnoncesId || '',
      customMessage: socialCustomMessage.trim(),
      enabled: true,
      addedAt: new Date().toISOString()
    };

    const updatedFeeds = [...currentFeeds, newFeed];
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId, socialFeeds: updatedFeeds })
      });
      if (res.ok) {
        setConfig(prev => ({ ...prev, socialFeeds: updatedFeeds }));
        setSocialChannelName('');
        setSocialChannelTitle('');
        setSocialCustomMessage('');
        showAlert('success', `Chaîne ${socialPlatform.toUpperCase()} ajoutée au suivi !`);
      }
    } catch (e) {
      showAlert('error', "Erreur lors de l'enregistrement de la chaîne.");
    }
  };

  const handleRemoveSocialFeed = async (feedId: string) => {
    const currentFeeds = config.socialFeeds || [];
    const updatedFeeds = currentFeeds.filter(f => f.id !== feedId);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId, socialFeeds: updatedFeeds })
      });
      if (res.ok) {
        setConfig(prev => ({ ...prev, socialFeeds: updatedFeeds }));
        showAlert('success', "Chaîne retirée du suivi.");
      }
    } catch (e) {
      showAlert('error', "Échec de la suppression.");
    }
  };

  const handleToggleSocialFeed = async (feedId: string) => {
    const currentFeeds = config.socialFeeds || [];
    const updatedFeeds = currentFeeds.map(f => f.id === feedId ? { ...f, enabled: !f.enabled } : f);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId, socialFeeds: updatedFeeds })
      });
      if (res.ok) {
        setConfig(prev => ({ ...prev, socialFeeds: updatedFeeds }));
      }
    } catch (e) {
      showAlert('error', "Échec de la modification.");
    }
  };

  const handleTriggerSocialCheck = async () => {
    setSocialChecking(true);
    try {
      const res = await fetch('/api/social/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.count > 0) {
          showAlert('success', `🎉 ${data.count} nouvelle(s) annonce(s) envoyée(s) sur Discord !`);
        } else {
          showAlert('info', "Toutes les chaînes sont à jour ! Aucune nouvelle vidéo détectée.");
        }
      }
    } catch (e) {
      showAlert('error', "Erreur lors de la vérification des réseaux sociaux.");
    } finally {
      setSocialChecking(false);
    }
  };

  const [isServerConnected, setIsServerConnected] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  // AI training fields
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [isTrainingSubmitting, setIsTrainingSubmitting] = useState(false);

  // Giftcard creation fields
  const [newCardCode, setNewCardCode] = useState('');
  const [newCardValue, setNewCardValue] = useState(500);
  const [newCardTier, setNewCardTier] = useState<'commun' | 'rare' | 'epique' | 'legendaire'>('commun');
  const [newCardMaxUses, setNewCardMaxUses] = useState('1');
  const [newCardExp, setNewCardExp] = useState('off');

  // Egg creation fields
  const [newEggName, setNewEggName] = useState('');
  const [newEggPrice, setNewEggPrice] = useState(1000);
  const [newEggRewardType, setNewEggRewardType] = useState<'eco' | 'xp' | 'role'>('eco');
  const [newEggRewardValue, setNewEggRewardValue] = useState('2500');

  // Terminal auto-scroll ref
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Trigger brief alert notification
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Fetch initial data
  const fetchData = async (guildId: string = selectedGuildId) => {
    try {
      // First, get guilds
      const loadedGuilds = await safeFetchJson('/api/guilds');
      if (loadedGuilds && Array.isArray(loadedGuilds)) {
        setGuilds(loadedGuilds);
      }

      const [configData, infoData, logsData, ticketsData, trainingData, usersData, cardsData, eggsData] = await Promise.all([
        safeFetchJson(`/api/config?guildId=${guildId}`),
        safeFetchJson('/api/info'),
        safeFetchJson(`/api/logs?guildId=${guildId}`),
        safeFetchJson(`/api/tickets?guildId=${guildId}`),
        safeFetchJson(`/api/training?guildId=${guildId}`),
        safeFetchJson(`/api/users?guildId=${guildId}`),
        safeFetchJson(`/api/giftcards?guildId=${guildId}`),
        safeFetchJson(`/api/eggs?guildId=${guildId}`)
      ]);

      if (configData) setConfig(configData);
      if (infoData && infoData.info) setBotInfo(infoData.info);
      if (logsData && Array.isArray(logsData)) setLogs(logsData);
      if (ticketsData && Array.isArray(ticketsData)) setTickets(ticketsData);
      if (trainingData && Array.isArray(trainingData)) setTraining(trainingData);
      if (usersData && Array.isArray(usersData)) setUsers(usersData);
      if (cardsData && Array.isArray(cardsData)) setGiftcards(cardsData);
      if (eggsData && Array.isArray(eggsData)) setEggs(eggsData);
      
      setIsServerConnected(true);
    } catch (err) {
      console.error('Failed to fetch data from API:', err);
      setIsServerConnected(false);
    }
  };

  // Poll for logs and info
  useEffect(() => {
    fetchData(selectedGuildId);
    const interval = setInterval(async () => {
      // Fetch dynamic stats frequently
      const infoData = await safeFetchJson('/api/info');
      if (infoData && infoData.info) {
        setBotInfo(infoData.info);
      } else if (!infoData) {
        setIsServerConnected(false);
      }

      const logsData = await safeFetchJson(`/api/logs?guildId=${selectedGuildId}`);
      if (logsData && Array.isArray(logsData)) {
        setLogs(logsData);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedGuildId]);

  // Auto-Clicker Keep Alive (Every 2 minutes)
  useEffect(() => {
    localStorage.setItem('komorebi_auto_keep_alive', String(isAutoKeepAlive));
    if (!isAutoKeepAlive) return;

    const interval = setInterval(async () => {
      // If bot is not running, let's auto-click start!
      if (config && !config.isRunning) {
        console.log("[AUTO-CLICKER] Bot is offline, auto-clicking to start bot...");
        setIsBotLoading(true);
        try {
          const res = await fetch('/api/bot/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', guildId: selectedGuildId })
          });
          const data = await res.json();
          if (data.success) {
            setConfig(prev => prev ? { ...prev, isRunning: data.isRunning } : prev);
            showAlert('success', '⚡ [Auto-Clicker] Bot remis en ligne automatiquement !');
          }
        } catch (err) {
          console.error('[AUTO-CLICKER] Failed to auto-click start bot:', err);
        } finally {
          setIsBotLoading(false);
          fetchData(selectedGuildId);
        }
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [isAutoKeepAlive, config?.isRunning, selectedGuildId]);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (activeTab === 'logs') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Handle Bot toggle power (start/stop)
  const handleTogglePower = async () => {
    setIsBotLoading(true);
    const action = config.isRunning ? 'stop' : 'start';
    try {
      // First save token to db if specified
      if (config.token) {
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guildId: selectedGuildId, token: config.token })
        }).catch(() => {});
      }

      const res = await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, guildId: selectedGuildId, token: config.token })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(prev => ({ ...prev, isRunning: data.isRunning }));
        showAlert('success', action === 'start' ? '⚡ Bot mis en ligne avec succès !' : '🔴 Le Bot a été mis hors ligne.');
      } else {
        showAlert('error', data.error || 'Échec du contrôle du bot. Vérifiez votre Token Discord.');
      }
    } catch (err) {
      showAlert('error', 'Erreur de communication avec le serveur.');
    } finally {
      setIsBotLoading(false);
      fetchData(selectedGuildId);
    }
  };

  // Force redeploy and synchronize all slash commands instantly
  const handleRedeployCommands = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeploy_commands', guildId: selectedGuildId })
      });
      const data = await res.json();
      if (data.success) {
        showAlert('success', '✅ Les commandes Discord ont été re-déployées et synchronisées à l\'instant sur tous vos serveurs !');
      } else {
        showAlert('error', `Échec du déploiement : ${data.error || 'Erreur inconnue'}`);
      }
    } catch (err) {
      showAlert('error', 'Erreur de communication avec le serveur.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update member profile in Firestore
  const handleUpdateUserProfile = async (userProfile: UserProfile) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${userProfile.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userProfile, guildId: selectedGuildId })
      });
      if (res.ok) {
        showAlert('success', `Profil de @${userProfile.username} sauvegardé avec succès !`);
        // Refresh users list
        const usersRes = await fetch(`/api/users?guildId=${selectedGuildId}`);
        if (usersRes.ok) setUsers(await usersRes.json());
      } else {
        showAlert('error', `Échec de la sauvegarde du profil.`);
      }
    } catch (err) {
      showAlert('error', 'Erreur de connexion lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  // Run administrator action remotely
  const handleExecuteAdminAction = async (action: string, userId: string, extraValue?: string | number) => {
    setIsAdminActionLoading(true);
    try {
      const bodyPayload = {
        action,
        userId,
        guildId: selectedGuildId,
        value: extraValue,
        roleId: announcementRole,
        channelId: announcementChannel,
        message: announcementMessage
      };
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showAlert('success', data.message || 'Action administrative exécutée avec succès !');
        if (action === 'broadcast') {
          setAnnouncementMessage('');
        }
        // Refresh users list
        const usersRes = await fetch(`/api/users?guildId=${selectedGuildId}`);
        if (usersRes.ok) {
          const freshUsers = await usersRes.json();
          setUsers(freshUsers);
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(freshUsers.find((u: any) => u.id === userId) || null);
          }
        }
      } else {
        showAlert('error', data.error || 'Erreur lors de l\'exécution de l\'action.');
      }
    } catch (err) {
      showAlert('error', 'Erreur de communication avec le serveur.');
    } finally {
      setIsAdminActionLoading(false);
    }
  };

  // Handle saving configurations
  const handleSaveConfig = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, guildId: selectedGuildId })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        showAlert('success', 'Configuration sauvegardée et appliquée en temps réel !');
      } else {
        showAlert('error', 'Erreur lors de la sauvegarde de la configuration.');
      }
    } catch (err) {
      showAlert('error', 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle custom status selection
  const handleStatusChange = async (status: BotConfig['status']) => {
    const updated = { ...config, status };
    setConfig(updated);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, guildId: selectedGuildId })
      });
      showAlert('info', `Statut Discord modifié : ${status}`);
    } catch (err) {
      showAlert('error', 'Erreur lors du changement de statut.');
    }
  };

  // Add customized AI instruction pattern
  const handleAddTraining = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newResponse.trim()) {
      return showAlert('error', 'Le déclencheur et la réponse ne peuvent pas être vides.');
    }
    setIsTrainingSubmitting(true);
    try {
      const res = await fetch('/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: newTrigger, response: newResponse, guildId: selectedGuildId })
      });
      if (res.ok) {
        const item = await res.json();
        setTraining(prev => [item, ...prev]);
        setNewTrigger('');
        setNewResponse('');
        showAlert('success', 'Nouvelle consigne d\'entraînement apprise avec succès !');
      } else {
        showAlert('error', 'Erreur lors de l\'enregistrement de la consigne.');
      }
    } catch (err) {
      showAlert('error', 'Erreur de connexion.');
    } finally {
      setIsTrainingSubmitting(false);
    }
  };

  // Delete training pattern
  const handleDeleteTraining = async (id: string) => {
    try {
      const res = await fetch(`/api/training/${id}?guildId=${selectedGuildId}`, { method: 'DELETE' });
      if (res.ok) {
        setTraining(prev => prev.filter(item => item.id !== id));
        showAlert('info', 'Consigne supprimée.');
      }
    } catch (err) {
      showAlert('error', 'Échec de la suppression.');
    }
  };

  // Close active ticket remotely
  const handleCloseTicket = async (id: string) => {
    try {
      const res = await fetch(`/api/tickets/${id}/close`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed', closedAt: new Date().toISOString() } : t));
        showAlert('success', `Ticket #${id.substring(0, 8)} fermé avec succès.`);
      }
    } catch (err) {
      showAlert('error', 'Échec de la fermeture du ticket.');
    }
  };

  // Clear log history
  const handleClearLogs = async () => {
    if (!window.confirm('Voulez-vous vraiment effacer l\'historique des logs ?')) return;
    try {
      const res = await fetch('/api/logs/clear', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: selectedGuildId })
      });
      if (res.ok) {
        setLogs([]);
        showAlert('info', 'Historique des logs réinitialisé.');
      }
    } catch (err) {
      showAlert('error', 'Échec de la réinitialisation.');
    }
  };

  // Create Giftcard
  const handleCreateGiftcard = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCardCode.trim()) return showAlert('error', 'Le code de carte est requis.');
    try {
      const res = await fetch('/api/giftcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newCardCode,
          value: newCardValue,
          tier: newCardTier,
          maxUses: newCardMaxUses,
          expiration: newCardExp,
          guildId: selectedGuildId
        })
      });
      if (res.ok) {
        const item = await res.json();
        setGiftcards(prev => [item, ...prev]);
        setNewCardCode('');
        showAlert('success', 'Carte cadeau créée avec succès !');
      } else {
        showAlert('error', 'Erreur lors de la création.');
      }
    } catch (err) {
      showAlert('error', 'Échec de connexion.');
    }
  };

  // Delete Giftcard
  const handleDeleteGiftcard = async (id: string) => {
    try {
      const res = await fetch(`/api/giftcards/${id}?guildId=${selectedGuildId}`, { method: 'DELETE' });
      if (res.ok) {
        setGiftcards(prev => prev.filter(c => c.id !== id));
        showAlert('info', 'Carte cadeau supprimée.');
      }
    } catch (err) {
      showAlert('error', 'Échec de la suppression.');
    }
  };

  // Create Egg Item (Boutique)
  const handleCreateEgg = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEggName.trim() || !newEggRewardValue.trim()) return showAlert('error', 'Le nom et la valeur de gain sont requis.');
    try {
      const res = await fetch('/api/eggs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newEggName,
          price: newEggPrice,
          rewardType: newEggRewardType,
          rewardValue: newEggRewardValue,
          guildId: selectedGuildId
        })
      });
      if (res.ok) {
        const item = await res.json();
        setEggs(prev => [item, ...prev]);
        setNewEggName('');
        showAlert('success', 'Œuf boutique configuré avec succès !');
      } else {
        showAlert('error', 'Erreur lors de l\'enregistrement.');
      }
    } catch (err) {
      showAlert('error', 'Échec de connexion.');
    }
  };

  // Delete Egg Item
  const handleDeleteEgg = async (id: string) => {
    try {
      const res = await fetch(`/api/eggs/${id}?guildId=${selectedGuildId}`, { method: 'DELETE' });
      if (res.ok) {
        setEggs(prev => prev.filter(e => e.id !== id));
        showAlert('info', 'Œuf retiré de la boutique.');
      }
    } catch (err) {
      showAlert('error', 'Échec du retrait.');
    }
  };

  return (
    <div id="dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center gap-2 text-purple-400">
          <Bot className="w-4 h-4" />
          <span>Tableau de Bord Administration Komorebi</span>
        </div>
      </div>
      
      {/* Alert Banner Notifications */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl shadow-black/40 backdrop-blur-md max-w-md"
            style={{
              backgroundColor: alert.type === 'success' ? 'rgba(6, 78, 59, 0.85)' : alert.type === 'error' ? 'rgba(153, 27, 27, 0.85)' : 'rgba(30, 41, 59, 0.85)',
              borderColor: alert.type === 'success' ? '#10b981' : alert.type === 'error' ? '#ef4444' : '#64748b'
            }}
          >
            <div className="rounded-full p-1 bg-white/10 text-white">
              {alert.type === 'success' ? <Check className="w-5 h-5" /> : alert.type === 'error' ? <X className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            </div>
            <p className="text-sm font-medium text-white">{alert.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Section */}
        <header id="dash-header" className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Bot className="w-8 h-8" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {config.botName || 'Komorebi Bot'} 
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                    Komorebi v3.0
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">Moteur de configuration et de supervision en temps réel connectée à Firebase</p>
              </div>
            </div>
          </div>

          {/* Server Selector & Quick status controls */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Elegant Guild Selector */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800/80 min-w-[240px] focus-within:border-emerald-500/50 transition-all">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Serveur Actif</label>
                <select
                  id="guild-select"
                  value={selectedGuildId}
                  onChange={(e) => {
                    setSelectedGuildId(e.target.value);
                    showAlert('info', `Chargement de la configuration pour le serveur sélectionné...`);
                  }}
                  className="block w-full bg-transparent border-0 p-0 text-xs font-semibold text-white focus:ring-0 cursor-pointer outline-none"
                >
                  {guilds.map((g) => (
                    <option key={g.id} value={g.id} className="bg-slate-950 text-slate-300">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Server connection status indicator */}
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <span className={`w-2.5 h-2.5 rounded-full ${isServerConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
              {isServerConnected ? 'Firestore synchronisé' : 'Erreur de liaison serveur'}
            </div>

            {/* Always-Online High Availability Status */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-xs select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  ⚡ Statut Système
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Actif en continu 24h/24</span>
              </div>
            </div>

            {/* Relaunch Button */}
            <button
              id="power-switch-btn"
              onClick={handleTogglePower}
              disabled={isBotLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide bg-slate-800 hover:bg-slate-700 text-white hover:shadow-lg border border-slate-700/60 cursor-pointer transition-all disabled:opacity-50"
            >
              {isBotLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              )}
              Relancer le Bot
            </button>

            {/* Sync Discord Commands Button */}
            <button
              onClick={handleRedeployCommands}
              disabled={isSaving || isBotLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide bg-slate-800 hover:bg-slate-700 text-white hover:shadow-lg border border-slate-700/60 cursor-pointer transition-all disabled:opacity-50"
              title="Synchronise instantanément les commandes Slash ajoutées ou modifiées sur Discord."
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Mettre à jour les Commandes
            </button>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <nav id="dash-nav" className="flex flex-wrap items-center gap-2 py-6 border-b border-slate-800/40">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: Sliders },
            { id: 'ai', label: 'Intelligence Artificielle', icon: Sparkles },
            { id: 'guard', label: 'Guard & Sécurité', icon: Shield },
            { id: 'economy', label: 'Économie & Membres', icon: Coins },
            { id: 'leveling', label: 'Expérience & Leveling', icon: TrendingUp },
            { id: 'social', label: 'Réseaux & Vidéos', icon: Share2 },
            { id: 'music', label: 'Lecteur Musique', icon: Music },
            { id: 'tutorial', label: 'Tutoriel Vidéo 🎥', icon: Video },
            { id: 'giftcards', label: 'Codes Cadeaux', icon: Gift },
            { id: 'eggs', label: 'ZenEggs Boutique', icon: ShoppingBag },
            { id: 'tickets', label: 'Gestion des Tickets', icon: TicketIcon },
            { id: 'logs', label: 'Live Console', icon: Terminal },
            { id: 'hosting', label: 'Hébergement 24/7', icon: Server },
            { id: 'legal', label: 'Politique & CGU', icon: Scale }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700/60' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'tickets' && tickets.filter(t => t.status === 'open').length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white leading-none scale-90">
                  {tickets.filter(t => t.status === 'open').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tab Contents */}
        <main className="py-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div id="overview-view" className="space-y-8">
              
              {/* Bot Presence / Profile Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Discord Profile Visualizer */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between shadow-xl">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Profil Discord</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {botInfo?.avatarUrl ? (
                          <img 
                            src={botInfo.avatarUrl} 
                            alt={config.botName} 
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-full border-2 border-slate-700 shadow-inner"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-slate-700 flex items-center justify-center text-emerald-400">
                            <Bot className="w-8 h-8" />
                          </div>
                        )}
                        {/* Status badge on avatar */}
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          !config.isRunning 
                            ? 'bg-slate-500' 
                            : config.status === 'online' 
                              ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' 
                              : config.status === 'idle' 
                                ? 'bg-amber-500' 
                                : config.status === 'dnd' 
                                  ? 'bg-rose-500' 
                                  : 'bg-slate-400'
                        }`} />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white">{botInfo?.tag || config.botName || 'Komorebi Bot'}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{botInfo?.id ? `ID: ${botInfo.id}` : 'Bot simulé / hors ligne'}</p>
                        
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`w-2 h-2 rounded-full ${config.isRunning ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="text-xs text-slate-300 font-semibold">
                            {config.isRunning ? 'Connecté à Discord' : 'Bot Déconnecté'}
                          </span>
                        </div>

                        {config.guardAutomod && (
                          <div className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-wider animate-pulse">
                            🛡️ AutoMod Actif
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* High Availability System Box */}
                  <div className="mt-8 pt-6 border-t border-slate-800/60">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        ⚡ Haute Disponibilité Active
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Le bot est configuré pour rester en ligne 24h/24. Un gardien d'arrière-plan (watchdog) surveille la connexion de la passerelle Discord toutes les 30 secondes et se reconnecte automatiquement en cas de coupure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Real-time Metrics */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Serveurs Actifs', count: botInfo ? botInfo.guildsCount : '0', desc: 'Guildes Discord surveillées', icon: Server, color: 'text-emerald-400' },
                    { title: 'Membres Totaux', count: users.length || (botInfo ? botInfo.usersCount : '0'), desc: 'Utilisateurs uniques enregistrés', icon: User, color: 'text-emerald-400' },
                    { title: 'Latence API', count: botInfo ? `${botInfo.ping} ms` : 'N/A', desc: 'Temps de réponse de la passerelle', icon: Activity, color: 'text-amber-400' },
                    { title: 'Salons Connectés', count: botInfo ? botInfo.channelsCount : '0', desc: 'Salons textuels et vocaux', icon: MessageSquare, color: 'text-sky-400' }
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6 flex flex-col justify-between shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                        <m.icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <div className="mt-4">
                        <h4 className="text-3xl font-extrabold text-white">{m.count}</h4>
                        <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bot Activation & Slash Command Sync Hub */}
              <div className="bg-slate-900/60 rounded-2xl border border-emerald-500/30 p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Centre de Contrôle du Bot & Commandes
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${config.isRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                          {config.isRunning ? 'En Ligne' : 'Hors Ligne'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Pilotez le statut du bot et synchronisez instantanément l'ensemble des 100+ commandes slash Discord.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={handleTogglePower}
                      disabled={isBotLoading}
                      className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg ${
                        config.isRunning
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                      }`}
                    >
                      {isBotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                      {config.isRunning ? 'Mettre le Bot Hors Ligne' : '⚡ Mettre le Bot en Ligne'}
                    </button>

                    <button
                      onClick={handleRedeployCommands}
                      disabled={isSaving || isBotLoading}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                      ⚡ Mettre à jour les Commandes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      Token Secret Discord Bot
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={config.token}
                        onChange={(e) => setConfig({ ...config, token: e.target.value })}
                        placeholder="Insérez votre Token d'authentification Discord (MTUzMTM2...)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500/80 focus:ring-1"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Ce token permet au bot de s'authentifier auprès de l'API Discord Gateway 24h/24.
                    </p>
                  </div>

                  <div className="md:col-span-1 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nom Réseau Bot</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{config.botName || 'Komorebi Bot'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-900 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Latence Passerelle:</span>
                      <span className="font-bold text-emerald-400">{botInfo ? `${botInfo.ping} ms` : 'En attente...'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube Video Tracker & Auto-Publisher System */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Système de Publication Vidéos YouTube ("Fais ton travail !")
                      </h3>
                      <p className="text-xs text-slate-400">Lorsqu'un membre publie une nouvelle vidéo sur sa chaîne YouTube, le dashboard alerte immédiatement le bot qui diffuse l'annonce sur Discord.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerSocialCheck}
                    disabled={socialChecking}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {socialChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                    📢 Déclencher la publication vidéo ("Fais ton travail !")
                  </button>
                </div>

                {/* Form to Register YouTube Channel */}
                <form onSubmit={handleAddSocialFeed} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID ou Lien Chaîne YouTube</label>
                    <input
                      type="text"
                      value={socialChannelName}
                      onChange={(e) => setSocialChannelName(e.target.value)}
                      placeholder="UC123... ou @chaine"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom du Créateur</label>
                    <input
                      type="text"
                      value={socialChannelTitle}
                      onChange={(e) => setSocialChannelTitle(e.target.value)}
                      placeholder="Ex: Mon Membre YouTube"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID Salon Discord Annonce</label>
                    <input
                      type="text"
                      value={socialDiscordChannelId}
                      onChange={(e) => setSocialDiscordChannelId(e.target.value)}
                      placeholder="Ex: 10101010101010"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Enregistrer la Chaîne
                    </button>
                  </div>
                </form>

                {/* Registered Channels Table */}
                {(config.socialFeeds || []).length > 0 ? (
                  <div className="space-y-2">
                    {(config.socialFeeds || []).map((feed) => (
                      <div key={feed.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs uppercase">YT</span>
                          <div>
                            <span className="text-xs font-bold text-white block">{feed.channelTitle}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{feed.channelNameOrId} • Salon: #{feed.discordChannelId || 'Défaut'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSocialFeed(feed.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${feed.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}
                          >
                            {feed.enabled ? 'Actif' : 'Inactif'}
                          </button>
                          <button
                            onClick={() => handleRemoveSocialFeed(feed.id)}
                            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-4 border border-dashed border-slate-800 rounded-xl">
                    Aucune chaîne YouTube enregistrée. Ajoutez-en une ci-dessus pour activer les annonces automatiques du Bot !
                  </p>
                )}
              </div>

              {/* Music Streaming Transmitter Dashboard -> Bot */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Transmetteur Musique Dashboard ➔ Bot Discord
                      </h3>
                      <p className="text-xs text-slate-400">Entrez un nom ou lien audio et envoyez directement la musique sur le bot pour qu'il la joue en vocal sur Discord !</p>
                    </div>
                  </div>

                  {musicSession?.isPlaying && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                      <Volume2 className="w-4 h-4" />
                      En cours de diffusion dans le salon vocal
                    </div>
                  )}
                </div>

                {/* Play Track Form */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={musicInput}
                    onChange={(e) => setMusicInput(e.target.value)}
                    placeholder="Rechercher un morceau ou coller un lien YouTube / MP3..."
                    className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => {
                      if (!musicInput.trim()) return showAlert('error', 'Entrez un nom de morceau ou un lien YouTube !');
                      handleMusicControl('add', { query: musicInput });
                    }}
                    disabled={musicLoading || !musicInput.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    {musicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    ▶️ Transmettre & Jouer sur le Bot
                  </button>
                </div>

                {/* Player Controls */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleMusicControl('play_pause')}
                      className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg cursor-pointer transition-all"
                    >
                      {musicSession?.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleMusicControl('skip')}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-all"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMusicControl('stop')}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 cursor-pointer transition-all"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={musicSession?.volume || 100}
                      onChange={(e) => handleMusicControl('volume', { volume: e.target.value })}
                      className="w-32 accent-purple-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-slate-400">{musicSession?.volume || 100}%</span>
                  </div>
                </div>

                {/* Track Queue */}
                {musicSession?.songs && musicSession.songs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">File d'attente ({musicSession.songs.length} morceaux)</h4>
                    {musicSession.songs.map((song: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          index === musicSession.currentSongIndex
                            ? 'bg-purple-950/30 border-purple-500/50 text-white font-bold'
                            : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-purple-400">#{index + 1}</span>
                          <span className="text-xs truncate max-w-md">{song.title}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-500">{song.duration || 'Live'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Code du Site & Lien d'Invitation Box */}
              <div className="bg-slate-900/60 rounded-2xl border border-purple-500/30 p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Lien d'Invitation & Code Source du Site Web</h3>
                      <p className="text-xs text-slate-400">Copiez le lien direct d'invitation Discord ou tout le code HTML du site d'invitation.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      {copiedInviteCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      {copiedInviteCode ? 'Lien Copié !' : 'Copier le Lien d\'Invitation'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopySiteCode}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-purple-600/20"
                    >
                      {copiedSiteCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Code className="w-4 h-4" />}
                      {copiedSiteCode ? 'Code Copié !' : 'Copier Tout le Code du Site'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                      🌐 Lien Direct du Site de Présentation Vitrine
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={siteDirectUrl}
                        className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-purple-300 font-mono font-bold"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopySiteUrl}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-md flex items-center gap-1.5"
                        >
                          {copiedSiteUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedSiteUrl ? 'Lien Copié !' : 'Copier le Lien'}
                        </button>
                        <a
                          href={siteDirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border border-slate-700 flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                          Ouvrir le Site
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Lien d'invitation Direct Discord (OAuth2)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono"
                      />
                      <a
                        href="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border border-slate-700"
                      >
                        Tester le Lien
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Code Source HTML Complet du Site (Autonome)
                      </label>
                      <span className="text-[11px] text-slate-500 font-mono">index.html</span>
                    </div>
                    <textarea
                      readOnly
                      rows={6}
                      value={`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Komorebi Bot - Bot Discord Officiel</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
  <!-- Header -->
  <header class="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xl">K</div>
      <span class="font-extrabold text-xl text-white">Komorebi Bot</span>
    </div>
    <a href="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot" target="_blank" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30">Inviter le Bot</a>
  </header>

  <!-- Hero Section -->
  <main class="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
    <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight">
      Le Bot Discord Ultime pour <span class="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Gérer, Protéger & Animer</span> votre Serveur.
    </h1>
    <p class="text-lg text-slate-300 max-w-2xl mx-auto">
      Système de tickets multilingue, modération Guard renforcée, mini-jeux RPG et économie complète. Un seul bot pour tout faire.
    </p>
    <div>
      <a href="https://discord.com/oauth2/authorize?client_id=1532724006535303238&permissions=8&integration_type=0&scope=bot" target="_blank" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105">
        Ajouter Komorebi à Discord 🚀
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500">
    Komorebi Bot © 2026 — Tous droits réservés.
  </footer>
</body>
</html>`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500/80 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <div id="ai-view" className="space-y-8">
              
              {/* AI Enable Toggle Card */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Intégration d'Intelligence Artificielle
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xl">
                    Activez les réponses autonomes du bot par IA dans les salons de tickets, par mention, ou en réponse directe de message.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${config.aiEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {config.aiEnabled ? 'Activée' : 'Désactivée'}
                  </span>
                  <button
                    onClick={() => {
                      const updated = { ...config, aiEnabled: !config.aiEnabled };
                      setConfig(updated);
                      showAlert('info', updated.aiEnabled ? 'IA activée !' : 'IA désactivée !');
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${config.aiEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${config.aiEnabled ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </div>

              {/* AI Models and API Keys Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* AI Configuration Panel */}
                <div className="lg:col-span-2 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
                  <h4 className="text-base font-semibold text-white">Paramètres et Personnalité de l'IA</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Directives de Personnalité (Prompt Système)</label>
                    <textarea
                      rows={4}
                      value={config.systemPrompt}
                      onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                      placeholder="Comment l'IA doit-elle se comporter sur le serveur ?"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveConfig()}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold cursor-pointer shadow-lg transition-all"
                    >
                      Sauvegarder l'IA
                    </button>
                  </div>
                </div>

                {/* AI Interactive Feature List */}
                <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h4 className="text-base font-semibold text-white">Capacités IA d'Hébergement</h4>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></span>
                      <div>
                        <h5 className="text-xs font-bold text-white">Recherche sur le Web</h5>
                        <p className="text-[11px] text-slate-400">Le bot effectue des recherches automatiques sur Google pour donner des réponses réelles et à jour.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></span>
                      <div>
                        <h5 className="text-xs font-bold text-white">Mémoire Durable</h5>
                        <p className="text-[11px] text-slate-400">Le bot conserve l'historique complet des discussions par salon dans Firestore pour s'en rappeler plus tard.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                      <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><Check className="w-4 h-4" /></span>
                      <div>
                        <h5 className="text-xs font-bold text-white">Discussion de Ticket</h5>
                        <p className="text-[11px] text-slate-400">Dans un salon ticket, nul besoin de mentionner le bot, il répond comme un vrai agent support humain.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Module de Traduction Instantanée (ZenTranslate) */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Module de Traduction Instantanée (ZenTranslate)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Gérez la fonctionnalité de traduction en temps réel de votre bot Discord. Les utilisateurs peuvent utiliser <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 text-[10px] font-mono">/traduction</code> ou réagir aux messages pour traduire automatiquement.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Enable Translation Toggle */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Activer ZenTranslate</h4>
                      <p className="text-[10px] text-slate-500">Autoriser les membres à traduire les messages en temps réel.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config, translationEnabled: !config.translationEnabled };
                        setConfig(updated);
                        showAlert('info', updated.translationEnabled ? 'Traduction en temps réel activée !' : 'Traduction en temps réel désactivée !');
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${config.translationEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${config.translationEnabled ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>

                  {/* Auto-Delete Translation Toggle */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Suppression Auto (30s)</h4>
                      <p className="text-[10px] text-slate-500">Supprimer automatiquement les traductions après 30 secondes pour ne pas polluer les salons.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...config, translationAutoDelete: !config.translationAutoDelete };
                        setConfig(updated);
                        showAlert('info', updated.translationAutoDelete ? 'Suppression automatique activée !' : 'Suppression automatique désactivée !');
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${config.translationAutoDelete ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${config.translationAutoDelete ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveConfig()}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                  >
                    Enregistrer les options de traduction
                  </button>
                </div>
              </div>

              {/* Bot Custom Rules Training Station ("Entraîner le bot sur des trucs précis") */}
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                    Entraînement Exclusif de l'Assistant
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Éduquez l'intelligence artificielle sur des réponses incontournables. Si l'utilisateur évoque le déclencheur, l'IA l'adoptera scrupuleusement.
                  </p>
                </div>

                <form onSubmit={handleAddTraining} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Si l'utilisateur évoque (Déclencheur / Clé)</label>
                    <input
                      type="text"
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="Exemple: conditions de remboursement"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">L'IA doit obligatoirement répondre</label>
                    <input
                      type="text"
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Exemple: Les remboursements se font sous 7 jours."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isTrainingSubmitting}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 h-10"
                  >
                    <Plus className="w-4 h-4" />
                    Enregistrer la Consigne
                  </button>
                </form>

                {/* Training items list */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consignes de respect programmées ({training.length})</h5>
                  {training.length === 0 ? (
                    <div className="text-center py-8 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
                      Aucune consigne d'entraînement enregistrée pour le moment.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {training.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4 p-3.5 bg-slate-950/35 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-all group">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              SI : "{item.trigger}"
                            </span>
                            <p className="text-xs text-slate-300 font-medium">👉 {item.response}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteTraining(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer la règle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* GUARD TAB */}
          {activeTab === 'guard' && (
            <div id="guard-view" className="space-y-6">
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Module Guard : Modération & Sécurité Anti-Raid
                    </h3>
                    <p className="text-sm text-slate-400">Interceptez les comportements toxiques et sécurisez le serveur de manière automatique.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fortress Mode (Verrouillage Total)</span>
                    <button
                      onClick={() => {
                        const updated = { ...config, fortressMode: !config.fortressMode };
                        setConfig(updated);
                        showAlert('info', updated.fortressMode ? 'Fortress Mode Activé ! Verrouillage total.' : 'Fortress Mode Désactivé.');
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${config.fortressMode ? 'bg-rose-500' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${config.fortressMode ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { key: 'guardAntiraid', label: 'Anti-Raid', desc: 'Bloque les arrivées massives suspectes', color: 'text-rose-400' },
                    { key: 'guardAntispam', label: 'Anti-Spam', desc: 'Limite les messages consécutifs rapides', color: 'text-amber-400' },
                    { key: 'guardAntilink', label: 'Anti-Link', desc: 'Interdit les liens publicitaires non autorisés', color: 'text-emerald-400' },
                    { key: 'guardCaptcha', label: 'Captcha de Sécurité', desc: 'Exige un captcha de bienvenue', color: 'text-emerald-400' }
                  ].map((g) => (
                    <div key={g.key} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                      <div>
                        <h4 className={`text-sm font-bold ${g.color}`}>{g.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{g.desc}</p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => {
                            const updated = { ...config, [g.key]: !config[g.key as keyof BotConfig] };
                            setConfig(updated);
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            config[g.key as keyof BotConfig]
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          {config[g.key as keyof BotConfig] ? 'ACTIVÉ' : 'DESACTIVÉ'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/20 p-5 rounded-xl border border-slate-800/50 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-slate-400" /> Sensibilité et Limiteurs
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Max messages de spam consécutifs</label>
                        <input
                          type="number"
                          value={config.guardLimitSpam}
                          onChange={(e) => setConfig({ ...config, guardLimitSpam: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Période d'évaluation du spam (secondes)</label>
                        <input
                          type="number"
                          value={config.guardLimitSpamTime}
                          onChange={(e) => setConfig({ ...config, guardLimitSpamTime: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Sanction Spam</label>
                        <select
                          value={config.guardSanctionSpam}
                          onChange={(e) => setConfig({ ...config, guardSanctionSpam: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        >
                          <option value="warn">Avertissement (Warn)</option>
                          <option value="timeout">Mettre en sourdine (Timeout)</option>
                          <option value="kick">Expulser (Kick)</option>
                          <option value="ban">Bannir définitivement (Ban)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/20 p-5 rounded-xl border border-slate-800/50 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-slate-400" /> Intégration Salons & Rôles
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Salon des logs de modération (ID)</label>
                        <input
                          type="text"
                          value={config.guardLogsChannelId}
                          onChange={(e) => setConfig({ ...config, guardLogsChannelId: e.target.value })}
                          placeholder="Ex: 1122334455667788"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Rôle Captcha Vérifié (ID)</label>
                        <input
                          type="text"
                          value={config.guardCaptchaRoleVerifiedId}
                          onChange={(e) => setConfig({ ...config, guardCaptchaRoleVerifiedId: e.target.value })}
                          placeholder="Ex: 8877665544332211"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Salon d'affichage Captcha (ID)</label>
                        <input
                          type="text"
                          value={config.guardCaptchaChannelId}
                          onChange={(e) => setConfig({ ...config, guardCaptchaChannelId: e.target.value })}
                          placeholder="Ex: 9988776655443322"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-purple-400 block mb-1">👑 Rôle Autorisé à poster des liens (ID)</label>
                          <input
                            type="text"
                            value={config.linkAllowedRoleId || ''}
                            onChange={(e) => setConfig({ ...config, linkAllowedRoleId: e.target.value })}
                            placeholder="Ex: 123456789012345678"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Les membres possédant ce rôle peuvent envoyer n'importe quel lien sans restriction.</p>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">Autoriser les GIFs & Médias (Tenor/YouTube)</span>
                            <span className="text-[10px] text-slate-400">Si désactivé, absolument TOUS les liens (y compris Tenor) seront bloqués.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setConfig({ ...config, linkAllowDefaultMedia: !(config.linkAllowDefaultMedia === true) })}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              config.linkAllowDefaultMedia
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                            }`}
                          >
                            {config.linkAllowDefaultMedia ? 'AUTORISÉS' : 'TOUT REFUSER (STRICT)'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-slate-800/40">
                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Enregistrer les paramètres de sécurité
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ECONOMY TAB */}
          {activeTab === 'economy' && (
            <div id="economy-view" className="space-y-6">
              
              {/* Broadcast / Server Announcement Banner */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/40 to-slate-900/40 rounded-2xl border border-emerald-500/20 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="text-base font-bold text-white">Annonceur de Serveur & Diffusion Discord</h3>
                    <p className="text-xs text-slate-400">Diffusez instantanément une annonce officielle avec mention de rôle dans un salon du serveur Discord.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Message de l'Annonce</label>
                      <textarea
                        value={announcementMessage}
                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                        placeholder="Écrivez le contenu de votre annonce officielle ici..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Salon de Destination (ID)</label>
                      <input
                        type="text"
                        value={announcementChannel}
                        onChange={(e) => setAnnouncementChannel(e.target.value)}
                        placeholder="Ex: 1010101010101010"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Mention de Rôle</label>
                      <select
                        value={announcementRole}
                        onChange={(e) => setAnnouncementRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="everyone">@everyone</option>
                        <option value="here">@here</option>
                        <option value="1010101010101010">Staff (Exemple ID)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleExecuteAdminAction('broadcast', 'global')}
                    disabled={isAdminActionLoading || !announcementMessage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                  >
                    {isAdminActionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Megaphone className="w-3.5 h-3.5" />}
                    Diffuser l'Annonce en Direct
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Configuration de l'économie */}
                <div className="lg:col-span-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-5 h-5 text-amber-400" />
                    Paramètres de l'Économie
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Nom de la Monnaie</label>
                      <input
                        type="text"
                        value={config.currencyName}
                        onChange={(e) => setConfig({ ...config, currencyName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Emoji de la Monnaie</label>
                      <input
                        type="text"
                        value={config.currencyEmoji}
                        onChange={(e) => setConfig({ ...config, currencyEmoji: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Travail Min</label>
                        <input
                          type="number"
                          value={config.salaryWorkMin}
                          onChange={(e) => setConfig({ ...config, salaryWorkMin: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Travail Max</label>
                        <input
                          type="number"
                          value={config.salaryWorkMax}
                          onChange={(e) => setConfig({ ...config, salaryWorkMax: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Crime Min</label>
                        <input
                          type="number"
                          value={config.salaryCrimeMin}
                          onChange={(e) => setConfig({ ...config, salaryCrimeMin: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Crime Max</label>
                        <input
                          type="number"
                          value={config.salaryCrimeMax}
                          onChange={(e) => setConfig({ ...config, salaryCrimeMax: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Taux de succès du Vol (Rob) (%)</label>
                      <input
                        type="number"
                        value={config.robSuccessRate}
                        onChange={(e) => setConfig({ ...config, robSuccessRate: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={isSaving}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white transition-all cursor-pointer mt-4"
                  >
                    Sauvegarder les salaires
                  </button>
                </div>

                {/* Base des membres / Fortune / RPG / Modération */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          <User className="w-5 h-5 text-emerald-400" />
                          Base de Données des Comptes Membres ({users.length})
                        </h3>
                        <p className="text-[11px] text-slate-400">Cliquez sur un membre pour modifier ses stats RPG, son solde, ou appliquer des sanctions.</p>
                      </div>

                      {/* Search box */}
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Rechercher un membre..."
                        className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {users.length === 0 ? (
                      <div className="text-center py-16 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        Aucun membre n'a encore interagi avec le système d'économie.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                        {users.filter(u => u.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.id.includes(userSearchQuery)).map((u) => {
                          const isSelected = selectedUser?.id === u.id;
                          return (
                            <div
                              key={u.id}
                              onClick={() => setSelectedUser(u)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                                isSelected 
                                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/5' 
                                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 uppercase">
                                  {u.username ? u.username.slice(0, 2) : 'M'}
                                </div>
                                <div className="truncate">
                                  <span className="text-xs font-bold text-slate-200 block truncate">@{u.username || u.id}</span>
                                  <span className="text-[10px] text-slate-500 font-mono block">ID: {u.id.split('_')[1] || u.id}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-2 rounded-lg border border-slate-800/40 text-center">
                                <div>
                                  <span className="text-[10px] font-bold text-amber-400 block">{u.wallet} {config.currencyEmoji}</span>
                                  <span className="text-[8px] text-slate-400 uppercase">Wallet</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-emerald-400 block">{u.bank} {config.currencyEmoji}</span>
                                  <span className="text-[8px] text-slate-400 uppercase">Banque</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-emerald-400 block">Lvl {u.level || 1}</span>
                                  <span className="text-[8px] text-slate-400 uppercase">{u.xp || 0} XP</span>
                                </div>
                              </div>

                              {/* Small badges for Warns & RPG Level */}
                              <div className="flex items-center justify-between text-[10px]">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${u.warnsCount && u.warnsCount > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-900 text-slate-500'}`}>
                                  {u.warnsCount || 0} Avertissement(s)
                                </span>
                                <span className="text-slate-400 font-medium">
                                  RPG Lvl: <strong className="text-amber-500">{u.rpgLevel || 1}</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* COLLAPSIBLE / DETAIL COMPONENT FOR SELECTED MEMBER */}
                  {selectedUser && (
                    <div className="bg-slate-900/40 rounded-2xl border border-emerald-500/30 p-6 shadow-2xl space-y-6">
                      
                      {/* Header with profile name */}
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 uppercase">
                            {selectedUser.username ? selectedUser.username.slice(0, 2) : 'M'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              Modifier le Profil d'Élite : @{selectedUser.username}
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">Joueur</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">ID Unique Document: {selectedUser.id}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedUser(null)} 
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Character Stats & RPG Display Card */}
                      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950/60 to-slate-950/60 p-4 rounded-xl border border-emerald-500/20 space-y-3">
                        <div className="flex justify-between items-center text-xs text-emerald-300 font-bold tracking-wider uppercase">
                          <span>🛡️ Fiche de Personnage RPG</span>
                          <span className="text-amber-400">Weapon: {selectedUser.rpgWeapon || "Aucune"}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                            <span className="text-xs text-slate-400 block font-semibold">Niveau RPG</span>
                            <span className="text-sm font-bold text-amber-400">{selectedUser.rpgLevel || 1}</span>
                          </div>
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                            <span className="text-xs text-slate-400 block font-semibold">Points de Vie (HP)</span>
                            <span className="text-sm font-bold text-rose-500">{selectedUser.rpgHp || 100} HP</span>
                          </div>
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                            <span className="text-xs text-slate-400 block font-semibold">Attaque / Défense</span>
                            <span className="text-sm font-bold text-slate-200">{selectedUser.rpgAttack || 15} / {selectedUser.rpgDefense || 5}</span>
                          </div>
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                            <span className="text-xs text-slate-400 block font-semibold">Pièces d'Or RPG</span>
                            <span className="text-sm font-bold text-yellow-500">{selectedUser.rpgCoins || 0} 🟡</span>
                          </div>
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/60">
                            <span className="text-xs text-slate-400 block font-semibold">Rapport Combat</span>
                            <span className="text-[11px] font-bold text-emerald-400">{selectedUser.rpgWins || 0} V / {selectedUser.rpgLosses || 0} D</span>
                          </div>
                        </div>
                      </div>

                      {/* Editors Side by Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 1. Global & Wallet Editor */}
                        <div className="space-y-4">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider text-emerald-400">Économie & Progression Générale</h5>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Portefeuille ({config.currencyEmoji})</label>
                              <input
                                type="number"
                                value={selectedUser.wallet}
                                onChange={(e) => setSelectedUser({ ...selectedUser, wallet: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Banque ({config.currencyEmoji})</label>
                              <input
                                type="number"
                                value={selectedUser.bank}
                                onChange={(e) => setSelectedUser({ ...selectedUser, bank: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Niveau d'XP Chat</label>
                              <input
                                type="number"
                                value={selectedUser.level}
                                onChange={(e) => setSelectedUser({ ...selectedUser, level: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">XP Total</label>
                              <input
                                type="number"
                                value={selectedUser.xp}
                                onChange={(e) => setSelectedUser({ ...selectedUser, xp: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">Nombre d'Avertissements (Warns)</label>
                            <input
                              type="number"
                              value={selectedUser.warnsCount || 0}
                              onChange={(e) => setSelectedUser({ ...selectedUser, warnsCount: Number(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        {/* 2. RPG Editor */}
                        <div className="space-y-4">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">Statistiques de Combat RPG</h5>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Niveau RPG</label>
                              <input
                                type="number"
                                value={selectedUser.rpgLevel || 1}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgLevel: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Pièces d'Or RPG</label>
                              <input
                                type="number"
                                value={selectedUser.rpgCoins || 0}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgCoins: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Points de Vie (HP)</label>
                              <input
                                type="number"
                                value={selectedUser.rpgHp || 100}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgHp: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Attaque (ATK)</label>
                              <input
                                type="number"
                                value={selectedUser.rpgAttack || 15}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgAttack: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Défense (DEF)</label>
                              <input
                                type="number"
                                value={selectedUser.rpgDefense || 5}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgDefense: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Arme RPG</label>
                              <input
                                type="text"
                                value={selectedUser.rpgWeapon || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgWeapon: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">Potions Magiques</label>
                              <input
                                type="number"
                                value={selectedUser.rpgPotions || 0}
                                onChange={(e) => setSelectedUser({ ...selectedUser, rpgPotions: Number(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Admin Quick remote commands (Clear warns, deban, demute, set level, set xp) */}
                      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-left">🛠️ Outils de Modération Rapide (Lancer sur Discord)</span>
                        <div className="flex flex-wrap gap-2.5">
                          
                          <button
                            onClick={() => handleExecuteAdminAction('clear-warns', selectedUser.id)}
                            disabled={isAdminActionLoading}
                            className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            Effacer Avertissements
                          </button>

                          <button
                            onClick={() => handleExecuteAdminAction('demute', selectedUser.id.split('_')[1] || selectedUser.id)}
                            disabled={isAdminActionLoading}
                            className="px-3 py-1.5 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/20 text-yellow-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <Shield className="w-3 h-3" />
                            Démuter (Timeout null)
                          </button>

                          <button
                            onClick={() => handleExecuteAdminAction('deban', selectedUser.id.split('_')[1] || selectedUser.id)}
                            disabled={isAdminActionLoading}
                            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3 h-3" />
                            Débannir
                          </button>

                          <button
                            onClick={() => handleExecuteAdminAction('set-xp', selectedUser.id, selectedUser.xp)}
                            disabled={isAdminActionLoading}
                            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <TrendingUp className="w-3 h-3" />
                            Définir XP Actuelle
                          </button>

                          <button
                            onClick={() => handleExecuteAdminAction('set-level', selectedUser.id, selectedUser.level)}
                            disabled={isAdminActionLoading}
                            className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/20 text-cyan-400 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            Définir Niveau Actuel
                          </button>

                        </div>
                      </div>

                      {/* Action trigger button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleUpdateUserProfile(selectedUser)}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-colors"
                        >
                          {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Enregistrer les Modifications du Profil
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* LEVELING TAB */}
          {activeTab === 'leveling' && (
            <div id="leveling-view" className="space-y-6">
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Module Leveling : XP, Progression & Récompenses de Rôles
                    </h3>
                    <p className="text-sm text-slate-400">Gérez le taux de gain d'expérience textuel, vocal et configurez les récompenses de rôles par niveau.</p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activer le module de progression</span>
                    <button
                      onClick={() => {
                        const updated = { ...config, levelXpStatus: !config.levelXpStatus };
                        setConfig(updated);
                      }}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${config.levelXpStatus ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${config.levelXpStatus ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/20 p-5 rounded-xl border border-slate-800/50 space-y-4">
                    <h4 className="text-sm font-bold text-white">Ratio & Cooldowns de l'XP</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">XP Minimum par message</label>
                        <input
                          type="number"
                          value={config.xpRateMin}
                          onChange={(e) => setConfig({ ...config, xpRateMin: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">XP Maximum par message</label>
                        <input
                          type="number"
                          value={config.xpRateMax}
                          onChange={(e) => setConfig({ ...config, xpRateMax: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Cooldown de gain d'XP (secondes)</label>
                      <input
                        type="number"
                        value={config.xpRateCooldown}
                        onChange={(e) => setConfig({ ...config, xpRateCooldown: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">XP Vocal attribué</label>
                        <input
                          type="number"
                          value={config.vocalXpAmount}
                          onChange={(e) => setConfig({ ...config, vocalXpAmount: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Toutes les (minutes)</label>
                        <input
                          type="number"
                          value={config.vocalXpMinutes}
                          onChange={(e) => setConfig({ ...config, vocalXpMinutes: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/20 p-5 rounded-xl border border-slate-800/50 space-y-4">
                    <h4 className="text-sm font-bold text-white">Annonce de Level-Up & Primes</h4>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Type d'annonce de gain de niveau</label>
                      <select
                        value={config.levelAnnouncement}
                        onChange={(e) => setConfig({ ...config, levelAnnouncement: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      >
                        <option value="current">Salon courant du message</option>
                        <option value="channel">Salon configuré dédié</option>
                        <option value="dm">Message Privé (MP)</option>
                        <option value="off">Désactiver l'annonce de level-up</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Salon dédié pour annonces (ID)</label>
                      <input
                        type="text"
                        value={config.levelAnnouncementChannelId}
                        onChange={(e) => setConfig({ ...config, levelAnnouncementChannelId: e.target.value })}
                        placeholder="Ex: 1122334455667788"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>

                    <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <div>
                        <h5 className="text-xs font-bold text-white">Argent de bienvenue au Level-up</h5>
                        <p className="text-[10px] text-slate-400">Attribue une prime économique à chaque niveau.</p>
                      </div>
                      <button
                        onClick={() => setConfig({ ...config, levelMoneyStatus: !config.levelMoneyStatus })}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                          config.levelMoneyStatus ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {config.levelMoneyStatus ? 'PRIME ACTIVE' : 'PRIME DESACTIVÉE'}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Montant de la prime par niveau ({config.currencyName})</label>
                      <input
                        type="number"
                        value={config.levelMoneyRewardAmount}
                        onChange={(e) => setConfig({ ...config, levelMoneyRewardAmount: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-slate-800/40">
                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Sauvegarder les récompenses et paliers d'expérience
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GIFTCARDS TAB */}
          {activeTab === 'giftcards' && (
            <div id="giftcards-view" className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Créateur de cartes cadeaux */}
                <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Gift className="w-5 h-5 text-emerald-400" />
                    Générateur de Code Cadeau (GiftCard)
                  </h3>

                  <form onSubmit={handleCreateGiftcard} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Code Secret de la Carte</label>
                      <input
                        type="text"
                        value={newCardCode}
                        onChange={(e) => setNewCardCode(e.target.value)}
                        placeholder="Ex: WELCOMEKOMOREBI"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gain ({config.currencyEmoji})</label>
                        <input
                          type="number"
                          value={newCardValue}
                          onChange={(e) => setNewCardValue(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rareté / Tier</label>
                        <select
                          value={newCardTier}
                          onChange={(e) => setNewCardTier(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        >
                          <option value="commun">Commun</option>
                          <option value="rare">Rare</option>
                          <option value="epique">Épique</option>
                          <option value="legendaire">Légendaire</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Max Utilisations</label>
                        <input
                          type="text"
                          value={newCardMaxUses}
                          onChange={(e) => setNewCardMaxUses(e.target.value)}
                          placeholder="Ex: infini ou 5"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiration</label>
                        <input
                          type="text"
                          value={newCardExp}
                          onChange={(e) => setNewCardExp(e.target.value)}
                          placeholder="Ex: off ou 31-12-2026"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                    >
                      Générer le code cadeau
                    </button>
                  </form>
                </div>

                {/* Liste des cartes cadeaux actives */}
                <div className="lg:col-span-2 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    Base des Cartes Cadeaux Configurées ({giftcards.length})
                  </h3>

                  {giftcards.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Aucune carte cadeau n'a été créée pour l'économie.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto">
                      {giftcards.map((c) => (
                        <div key={c.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-mono text-xs font-bold text-emerald-300 block">CODE: {c.id}</span>
                              <span className="text-[10px] text-slate-400 mt-1 block">Gain : <strong className="text-amber-400">{c.value} {config.currencyEmoji}</strong></span>
                            </div>
                            
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              c.tier === 'commun' ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                              c.tier === 'rare' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              c.tier === 'epique' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {c.tier}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900">
                            <span className="text-[10px] text-slate-400">
                              Utilisations: {c.currentUses}/{c.maxUses}
                            </span>
                            
                            <button
                              onClick={() => handleDeleteGiftcard(c.id)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Retirer le code"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* EGGS TAB */}
          {activeTab === 'eggs' && (
            <div id="eggs-view" className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Configuration d'oeufs */}
                <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    Ajouter un ZenEgg à la Boutique
                  </h3>

                  <form onSubmit={handleCreateEgg} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nom de l'Œuf (ZenEgg)</label>
                      <input
                        type="text"
                        value={newEggName}
                        onChange={(e) => setNewEggName(e.target.value)}
                        placeholder="Ex: Œuf Cosmique"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prix d'achat ({config.currencyEmoji})</label>
                      <input
                        type="number"
                        value={newEggPrice}
                        onChange={(e) => setNewEggPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type de Gain</label>
                        <select
                          value={newEggRewardType}
                          onChange={(e) => setNewEggRewardType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        >
                          <option value="eco">Économie</option>
                          <option value="xp">Progression XP</option>
                          <option value="role">Rôle Exclusif</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Valeur Gain</label>
                        <input
                          type="text"
                          value={newEggRewardValue}
                          onChange={(e) => setNewEggRewardValue(e.target.value)}
                          placeholder="Ex: 5000 ou VIP"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                    >
                      Enregistrer l'œuf en boutique
                    </button>
                  </form>
                </div>

                {/* Boutique d'oeufs configurés */}
                <div className="lg:col-span-2 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    Oeufs de boutique configurés ({eggs.length})
                  </h3>

                  {eggs.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Aucun ZenEgg n'a été enregistré pour le moment.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto">
                      {eggs.map((e) => (
                        <div key={e.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-200 block">🥚 {e.id}</span>
                              <span className="text-[10px] text-slate-400 block mt-1">Achat : <strong className="text-amber-400">{e.price} {config.currencyEmoji}</strong></span>
                            </div>

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              e.rewardType === 'eco' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              e.rewardType === 'xp' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {e.rewardType.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-900">
                            <span className="text-[10px] text-slate-400">
                              Bénéfice : <strong className="text-slate-300">{e.rewardValue}</strong>
                            </span>

                            <button
                              onClick={() => handleDeleteEgg(e.id)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Retirer de la boutique"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div id="tickets-view" className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TicketIcon className="w-5 h-5 text-sky-400" />
                    Base de Données des Tickets Actifs
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Pilotez et analysez à distance les tickets d'assistance ouverts sur vos serveurs Discord.
                  </p>
                </div>
              </div>

              {/* Ticket Buttons Configuration */}
              <div className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configuration des Boutons du Panneau de Tickets</h4>
                    <p className="text-xs text-slate-400 mt-1">Cochez les catégories que vous souhaitez voir apparaître sur le panneau de tickets généré par la commande Discord `/ticket`.</p>
                  </div>
                  <button
                    onClick={() => handleSaveConfig()}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Enregistrer les boutons
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: 'support', label: '💬 Support Général', desc: 'Demandes simples' },
                    { id: 'complaint', label: '🛡️ Plainte / Staff', desc: 'Signaler un problème / Staff' },
                    { id: 'partner', label: '🤝 Partenariat', desc: 'Échanges et partenariats' },
                    { id: 'billing', label: '💳 Facturation', desc: 'Achats et dons' },
                    { id: 'tiktok', label: '🎬 TikTok / Médias', desc: 'Collaborations médias' },
                    { id: 'recruitment', label: '📝 Recrutement Staff', desc: 'Postuler dans l\'équipe' },
                    { id: 'question', label: '❓ Question / FAQ', desc: 'Règles et explications' },
                    { id: 'admin', label: '👑 Parler à l\'Admin', desc: 'Contacter la direction' },
                    { id: 'other', label: '🌟 Autre Demande', desc: 'Sujets divers' }
                  ].map((cat) => {
                    const isEnabled = config.ticketButtons?.includes(cat.id) ?? ['support', 'complaint', 'partner', 'other'].includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          const currentButtons = config.ticketButtons && config.ticketButtons.length > 0
                            ? [...config.ticketButtons]
                            : ['support', 'complaint', 'partner', 'other'];
                          
                          let newButtons: string[];
                          if (currentButtons.includes(cat.id)) {
                            if (currentButtons.length <= 1) {
                              return showAlert('error', 'Vous devez laisser au moins une catégorie active !');
                            }
                            newButtons = currentButtons.filter(b => b !== cat.id);
                          } else {
                            newButtons = [...currentButtons, cat.id];
                          }
                          setConfig({ ...config, ticketButtons: newButtons });
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isEnabled
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isEnabled ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{cat.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
                  Aucun ticket de support n'a été ouvert pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Salon ID</th>
                        <th className="py-3 px-4">Membre Discord</th>
                        <th className="py-3 px-4">Catégorie</th>
                        <th className="py-3 px-4">Date de Création</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-emerald-300">#{ticket.id.substring(0, 8)}...</td>
                          <td className="py-4 px-4 font-semibold text-slate-200">@{ticket.username}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              ticket.category === 'support'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : ticket.category === 'billing'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700/40'
                            }`}>
                              {ticket.category.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-400 font-mono">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              ticket.status === 'open' ? 'text-emerald-400' : 'text-slate-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                              {ticket.status === 'open' ? 'Actif / Ouvert' : 'Clôturé'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {ticket.status === 'open' ? (
                              <button
                                onClick={() => handleCloseTicket(ticket.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold cursor-pointer transition-all border border-rose-500/20"
                              >
                                Fermer à distance
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500 italic">Supprimé de Discord</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div id="logs-view" className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-amber-400" />
                    Console des Événements Discord
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Suivez en direct absolu les requêtes d'intelligence artificielle, les logs de modération, et l'activité du bot.
                  </p>
                </div>

                <button
                  onClick={handleClearLogs}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 text-slate-400 text-xs font-bold cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vider l'historique
                </button>
              </div>

              {/* Terminal Container */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-inner h-[550px] overflow-y-auto space-y-4">
                {logs.length === 0 ? (
                  <div className="text-slate-600 text-center py-20 italic">
                    [CONSOLE] En attente de nouveaux paquets d'événements Discord...
                  </div>
                ) : (
                  logs.slice().reverse().map((log) => {
                    // Helper to compute colors and icons for Discord Embed style logs
                    const getLogStyles = (type: string) => {
                      switch (type) {
                        case 'success':
                          return {
                            bgStrip: 'bg-emerald-500',
                            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                            icon: <Check className="w-3.5 h-3.5 text-emerald-400" />
                          };
                        case 'error':
                          return {
                            bgStrip: 'bg-rose-500',
                            badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                            icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          };
                        case 'warning':
                          return {
                            bgStrip: 'bg-amber-500',
                            badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                            icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          };
                        case 'command':
                          return {
                            bgStrip: 'bg-emerald-500',
                            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                            icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          };
                        case 'moderation':
                          return {
                            bgStrip: 'bg-sky-500',
                            badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
                            icon: <Shield className="w-3.5 h-3.5 text-sky-400" />
                          };
                        case 'ai':
                          return {
                            bgStrip: 'bg-purple-500',
                            badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
                            icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          };
                        case 'economy':
                          return {
                            bgStrip: 'bg-yellow-500',
                            badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
                            icon: <Coins className="w-3.5 h-3.5 text-yellow-400" />
                          };
                        default:
                          return {
                            bgStrip: 'bg-slate-500',
                            badge: 'bg-slate-800 text-slate-400 border border-slate-700',
                            icon: <Activity className="w-3.5 h-3.5 text-slate-400" />
                          };
                      }
                    };

                    const styles = getLogStyles(log.type);
                    return (
                      <div 
                        key={log.id} 
                        className="relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 rounded-xl p-4.5 pl-6 shadow-md transition-all space-y-3 overflow-hidden text-left"
                      >
                        {/* Discord-style Left Color Strip */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${styles.bgStrip}`} />

                        {/* Top Metadata Row */}
                        <div className="flex items-center justify-between gap-2 select-none">
                          <span className={`flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${styles.badge}`}>
                            {styles.icon}
                            {log.type}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Log Text Message */}
                        <div className="text-sm text-slate-200 font-sans leading-relaxed break-words whitespace-pre-wrap">
                          {log.message}
                        </div>

                        {/* Footer details (author/server tags) */}
                        {(log.user || log.guild) && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-950/40 text-[11px]">
                            {log.user && (
                              <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md text-slate-400 font-medium">
                                <User className="w-3 h-3 text-emerald-400" />
                                <span className="text-slate-500">Exécuteur :</span>
                                <strong className="text-slate-300">@{log.user}</strong>
                              </span>
                            )}
                            {log.guild && (
                              <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-md text-slate-400 font-medium">
                                <Server className="w-3 h-3 text-emerald-400" />
                                <span className="text-slate-500">Serveur :</span>
                                <strong className="text-slate-300">{log.guild}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          {/* HOSTING TAB */}
          {activeTab === 'hosting' && (
            <div id="hosting-view" className="space-y-8 animate-fade-in">
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-emerald-400" />
                      🚀 Guide d'Hébergement Continu 24h/24 & 7j/7
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Gardez votre bot Komorebi connecté en permanence sur Discord, même lorsque vous fermez cet éditeur.
                    </p>
                  </div>
                  <span className="self-start md:self-center bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 animate-pulse">
                    🟢 Production Ready
                  </span>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Warning Info */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
                    ⚠️ <strong>IMPORTANT :</strong> Le panneau de développement actuel est parfait pour les tests et la personnalisation, mais s'éteint automatiquement après quelques minutes d'inactivité. Pour votre communauté Discord active, vous devez utiliser l'une des solutions de déploiement ci-dessous.
                  </div>

                  {/* Two Main Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cloud Platform hosting */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Option 1 : Hébergeurs Cloud (Render, Railway, Heroku)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ces plateformes gèrent l'exécution continue de l'application à chaque mise à jour. C'est l'option recommandée pour sa simplicité.
                      </p>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3 font-mono text-xs">
                        <div className="text-slate-300 font-bold text-[11px] pb-1 border-b border-slate-800 flex items-center justify-between">
                          <span>📦 ÉTAPES DE CONFIGURATION</span>
                          <span className="text-emerald-400">Simple</span>
                        </div>
                        <ul className="space-y-2 text-slate-400 list-decimal pl-4 leading-relaxed">
                          <li>Exportez le projet ou associez votre dépôt GitHub.</li>
                          <li>Créez un nouveau service sur <strong>Railway.app</strong> ou <strong>Render.com</strong>.</li>
                          <li>Choisissez l'environnement <strong>Node.js</strong>.</li>
                          <li>Configurez les variables d'environnement listées à droite.</li>
                          <li>
                            Commande de build : <code className="text-emerald-300 font-bold bg-slate-900 px-1 py-0.5 rounded">npm run build</code>
                          </li>
                          <li>
                            Commande de démarrage : <code className="text-emerald-300 font-bold bg-slate-900 px-1 py-0.5 rounded">npm start</code>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* VPS / Dedicated hosting */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Option 2 : Serveur Dédié / VPS (Linux, Ubuntu, Debian)
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pour un contrôle absolu et un coût minimal, exécutez le bot sur votre propre serveur avec le gestionnaire de processus <strong>PM2</strong>.
                      </p>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3 font-mono text-xs">
                        <div className="text-slate-300 font-bold text-[11px] pb-1 border-b border-slate-800 flex items-center justify-between">
                          <span>💻 PM2 PRODUCTION SHELL</span>
                          <span className="text-emerald-400">Avancé</span>
                        </div>
                        <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed select-all bg-slate-900/60 p-2.5 rounded border border-slate-800">
                          <p className="text-slate-500"># 1. Installer Node et PM2</p>
                          <p>sudo apt update && sudo apt install nodejs npm -y</p>
                          <p>sudo npm install -g pm2</p>
                          
                          <p className="text-slate-500 mt-2"># 2. Installer et Compiler le Projet</p>
                          <p>npm install</p>
                          <p>npm run build</p>
                          
                          <p className="text-slate-500 mt-2"># 3. Lancer en arrière-plan continu</p>
                          <p>pm2 start dist/server.cjs --name "komorebi-bot"</p>
                          <p>pm2 save</p>
                          <p>pm2 startup</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environment Variables Table */}
                  <div className="border-t border-slate-800/60 pt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                      🔑 Variables d'Environnement Requises (Secrets)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ajoutez obligatoirement ces variables dans les paramètres de votre hébergeur pour que le bot s'initialise correctement.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-800/60">
                      <table className="w-full text-left text-xs text-slate-400 font-sans">
                        <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                          <tr>
                            <th className="p-3.5">Variable</th>
                            <th className="p-3.5">Usage & Rôle</th>
                            <th className="p-3.5">Exemple de Valeur</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 bg-slate-950/20">
                          <tr>
                            <td className="p-3.5 font-mono text-emerald-400 font-bold">DISCORD_TOKEN</td>
                            <td className="p-3.5">Le jeton d'authentification officiel de votre bot Discord.</td>
                            <td className="p-3.5 font-mono text-slate-500 select-all">MTIyMzQ1Njc4OTAx...</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono text-emerald-400 font-bold">GEMINI_API_KEY</td>
                            <td className="p-3.5">Requis pour l'intelligence artificielle (génération de texte, trivia, réponses automatisées).</td>
                            <td className="p-3.5 font-mono text-slate-500 select-all">AIzaSyBwS...</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono text-slate-400 font-bold">NODE_ENV</td>
                            <td className="p-3.5">Indique que l'application s'exécute en mode optimisé de production.</td>
                            <td className="p-3.5 font-mono text-emerald-500">production</td>
                          </tr>
                          <tr>
                            <td className="p-3.5 font-mono text-slate-400 font-bold">PORT</td>
                            <td className="p-3.5">Le port web d'écoute réseau. Par défaut, l'hébergeur le configure automatiquement.</td>
                            <td className="p-3.5 font-mono text-emerald-500">3000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Keep Alive Tool Section */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        Simulateur d'Activité Continu (Keep-Alive)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Activez cette option pour simuler des requêtes régulières de maintien d'activité de l'application pendant vos tests de développement.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-400">
                        {isAutoKeepAlive ? '🟢 ACTIVÉ' : '⚪ DÉSACTIVÉ'}
                      </span>
                      <button
                        onClick={() => {
                          const updated = !isAutoKeepAlive;
                          setIsAutoKeepAlive(updated);
                          localStorage.setItem('komorebi_auto_keep_alive', String(updated));
                          showAlert('success', updated ? 'Maintien d\'activité automatique activé !' : 'Maintien d\'activité désactivé.');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          isAutoKeepAlive
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        Basculer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL TAB (POLITIQUE DE CONFIDENTIALITÉ & CGU) */}
          {activeTab === 'legal' && (
            <div id="legal-view" className="space-y-8 animate-fade-in">
              <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Scale className="w-5 h-5 text-emerald-400" />
                      📜 Politique de Confidentialité & Conditions d'Utilisation (CGU)
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Consultez et copiez facilement les documents légaux officiels pour votre bot Discord {config.botName || 'Komorebi'}.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Conforme RGPD & Discord ToS
                    </span>
                  </div>
                </div>

                {/* Grid layout for legal cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* CARD 1: POLITIQUE DE CONFIDENTIALITÉ */}
                  <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-lg hover:border-slate-700 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <FileText className="w-5 h-5" />
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-white">Politique de Confidentialité</h4>
                            <p className="text-[11px] text-slate-400">RGPD & Rétention 14j automatique</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          v4.0 • 2026
                        </span>
                      </div>

                      {/* Content Preview Box */}
                      <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed max-h-80 overflow-y-auto space-y-3 whitespace-pre-wrap select-text custom-scrollbar">
                        {privacyPolicyText}
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopyPrivacy}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                        copiedPrivacy
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                      }`}
                    >
                      {copiedPrivacy ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Confidentialité Copiée !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span>Copier la Confidentialité</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CARD 2: CONDITIONS D'UTILISATION (CGU) */}
                  <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-lg hover:border-slate-700 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Scale className="w-5 h-5" />
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-white">Conditions d'Utilisation (CGU)</h4>
                            <p className="text-[11px] text-slate-400">Règles d'utilisation du bot Discord</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          v4.0 • 2026
                        </span>
                      </div>

                      {/* Content Preview Box */}
                      <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed max-h-80 overflow-y-auto space-y-3 whitespace-pre-wrap select-text custom-scrollbar">
                        {termsOfServiceText}
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopyTos}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                        copiedTos
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      {copiedTos ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>CGU Copiées !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span>Copier les CGU Officielles</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CARD 3: RÈGLEMENT DU SERVEUR SUPPORT */}
                  <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-lg hover:border-slate-700 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <ShieldAlert className="w-5 h-5" />
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-white">Règlement du Serveur Support</h4>
                            <p className="text-[11px] text-slate-400">Règles du serveur Discord de support</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          v1.0 • 2026
                        </span>
                      </div>

                      {/* Content Preview Box */}
                      <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed max-h-80 overflow-y-auto space-y-3 whitespace-pre-wrap select-text custom-scrollbar">
                        {supportRulesText}
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopySupportRules}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                        copiedSupportRules
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                      }`}
                    >
                      {copiedSupportRules ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Règlement Support Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span>Copier le Règlement Support</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Footer Notice */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ces textes peuvent être partagés dans un salon Discord <code>#cgu-et-confidentialite</code> ou sur le site vitrine du bot.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyPrivacy}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Copier Confidentialité
                    </button>
                    <button
                      onClick={handleCopyTos}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Copier CGU
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SOCIAL FEEDS TAB */}
          {activeTab === 'social' && (
            <div id="social-view" className="space-y-8">
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Share2 className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-white">Annonces Automatiques & Réseaux Sociaux</h3>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Détectez automatiquement les nouvelles vidéos et publications (YouTube, Twitch, Twitter, TikTok) et postez une alerte sur Discord !
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerSocialCheck}
                    disabled={socialChecking}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${socialChecking ? 'animate-spin' : ''}`} />
                    <span>⚡ Déclencher la Vérification</span>
                  </button>
                </div>

                {/* Form to Add Feed */}
                <form onSubmit={handleAddSocialFeed} className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    Ajouter une nouvelle chaîne à suivre
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Platform Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Plateforme</label>
                      <select
                        value={socialPlatform}
                        onChange={(e) => setSocialPlatform(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-red-500 outline-none"
                      >
                        <option value="youtube">🔴 YouTube (Chaîne ID / Nom)</option>
                        <option value="twitch">💜 Twitch Live Stream</option>
                        <option value="twitter">🩵 Twitter / X Posts</option>
                        <option value="tiktok">🎵 TikTok Videos</option>
                      </select>
                    </div>

                    {/* ID or Channel Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">ID / Pseudo de la Chaîne</label>
                      <input
                        type="text"
                        value={socialChannelName}
                        onChange={(e) => setSocialChannelName(e.target.value)}
                        placeholder={socialPlatform === 'youtube' ? 'ex: UCX6OQ3DkcsbYNE6H8uQQuVA' : 'ex: @Inoxtag'}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
                      />
                    </div>

                    {/* Channel Display Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Nom d'affichage (Optionnel)</label>
                      <input
                        type="text"
                        value={socialChannelTitle}
                        onChange={(e) => setSocialChannelTitle(e.target.value)}
                        placeholder="ex: MrBeast / Inoxtag"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
                      />
                    </div>

                    {/* Discord Channel ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">ID Salon Discord de destination</label>
                      <input
                        type="text"
                        value={socialDiscordChannelId}
                        onChange={(e) => setSocialDiscordChannelId(e.target.value)}
                        placeholder={config.channelAnnoncesId || 'ex: 123456789098765432'}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Message personnalisé d'annonce (Optionnel)</label>
                    <input
                      type="text"
                      value={socialCustomMessage}
                      onChange={(e) => setSocialCustomMessage(e.target.value)}
                      placeholder="ex: 🔥 @everyone Nouvelle vidéo incroyable disponible ! Laissez un pouce bleu !"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-red-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter au suivi automatique</span>
                    </button>
                  </div>
                </form>

                {/* List of Feeds */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Chaînes actuellement suivies ({config.socialFeeds?.length || 0})</span>
                  </h4>

                  {(!config.socialFeeds || config.socialFeeds.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
                      <Tv className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">Aucune chaîne enregistrée pour l'instant.</p>
                      <p className="text-[11px] text-slate-500">Ajoutez une chaîne YouTube ou Twitch ci-dessus ou utilisez la commande <code>/social add</code> sur Discord.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {config.socialFeeds.map((feed) => (
                        <div key={feed.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${
                                feed.platform === 'youtube' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                feed.platform === 'twitch' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                feed.platform === 'twitter' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                                'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                              }`}>
                                {feed.platform}
                              </span>
                              <h5 className="text-xs font-bold text-white truncate">{feed.channelTitle || feed.channelNameOrId}</h5>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono truncate">ID: {feed.channelNameOrId}</p>
                            <p className="text-[10px] text-slate-500">Salon Discord: <code>#{feed.discordChannelId}</code></p>
                            {feed.lastVideoId && (
                              <p className="text-[10px] text-emerald-400 truncate">Dernière vidéo: {feed.lastVideoId}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleSocialFeed(feed.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                feed.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {feed.enabled ? 'Actif' : 'Inactif'}
                            </button>
                            <button
                              onClick={() => handleRemoveSocialFeed(feed.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Supprimer la chaîne"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* MUSIC PLAYER TAB */}
          {activeTab === 'music' && (
            <div id="music-view" className="space-y-8">
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Music className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-xl font-bold text-white">Lecteur Musique Live & File d'Attente Vocal</h3>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Contrôlez la musique diffusée dans les salons vocaux Discord en direct depuis le tableau de bord !
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                      musicSession?.isPlaying
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <Radio className="w-3.5 h-3.5" />
                      {musicSession?.isPlaying ? 'En Lecture Live' : 'Lecteur en Pause / Inactif'}
                    </span>
                  </div>
                </div>

                {/* Main Player Display */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  
                  {/* Track Info & Art */}
                  <div className="lg:col-span-2 flex items-center gap-5">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative group shrink-0 shadow-lg">
                      {musicSession?.songs && musicSession.songs.length > 0 && musicSession.songs[musicSession.currentSongIndex]?.thumbnail ? (
                        <img
                          src={musicSession.songs[musicSession.currentSongIndex].thumbnail}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950/40 to-slate-900">
                          <Music className="w-10 h-10 text-emerald-500/40" />
                        </div>
                      )}
                      {musicSession?.isPlaying && (
                        <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[2px] flex items-center justify-center">
                          <Activity className="w-8 h-8 text-emerald-400 animate-bounce" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {musicSession?.isPlaying ? '▶️ En ce moment' : '⏸️ Morceau Sélectionné'}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white truncate">
                        {musicSession?.songs && musicSession.songs.length > 0
                          ? musicSession.songs[musicSession.currentSongIndex]?.title
                          : 'Aucun morceau en cours de lecture'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span>⏱️ Durée : {musicSession?.songs && musicSession.songs.length > 0 ? (musicSession.songs[musicSession.currentSongIndex]?.duration || 'En continu') : '00:00'}</span>
                        <span>👤 Ajouté par : {musicSession?.songs && musicSession.songs.length > 0 ? (musicSession.songs[musicSession.currentSongIndex]?.requestedBy || 'Dashboard Admin') : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls & Volume */}
                  <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                    <div className="flex items-center justify-center gap-3">
                      {/* Shuffle */}
                      <button
                        onClick={() => handleMusicControl('shuffle')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          musicSession?.isShuffle ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="Lecture Aléatoire"
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>

                      {/* Play / Pause */}
                      <button
                        onClick={() => handleMusicControl('play_pause')}
                        disabled={musicLoading}
                        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                        title={musicSession?.isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
                      >
                        {musicSession?.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>

                      {/* Skip */}
                      <button
                        onClick={() => handleMusicControl('skip')}
                        disabled={musicLoading || !musicSession?.songs || musicSession.songs.length === 0}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                        title="Morceau Suivant"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      {/* Loop */}
                      <button
                        onClick={() => handleMusicControl('loop')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          musicSession?.isLoop ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="Répéter la liste"
                      >
                        <Repeat className="w-4 h-4" />
                      </button>

                      {/* Stop */}
                      <button
                        onClick={() => handleMusicControl('stop')}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="Arrêter et déconnecter du vocal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Volume</span>
                        <span className="text-white font-mono">{musicSession?.volume || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        value={musicSession?.volume || 100}
                        onChange={(e) => handleMusicControl('volume', { volume: e.target.value })}
                        className="w-full accent-emerald-500 bg-slate-900 rounded-lg h-2 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>

                {/* Add Track Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (musicInput.trim()) {
                      handleMusicControl('add', { query: musicInput.trim() });
                    }
                  }}
                  className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3"
                >
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    Lancer une chanson ou ajouter un lien YouTube / titre
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={musicInput}
                      onChange={(e) => setMusicInput(e.target.value)}
                      placeholder="ex: https://www.youtube.com/watch?v=... ou Daft Punk Get Lucky"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={musicLoading || !musicInput.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {musicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span>Lancer / Ajouter</span>
                    </button>
                  </div>
                </form>

                {/* Quick Preset Song Buttons */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">⚡ Suggestions Rapides & Hits Populaires</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Daft Punk - Get Lucky',
                      'The Weeknd - Blinding Lights',
                      'Queen - Bohemian Rhapsody',
                      'Imagine Dragons - Believer',
                      'Eminem - Lose Yourself',
                      'Lo-Fi Chill Beats Radio'
                    ].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleMusicControl('add', { query: preset })}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Music className="w-3 h-3 text-emerald-400" />
                        <span>{preset}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Queue List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      File d'attente ({musicSession?.songs?.length || 0} morceau{musicSession?.songs?.length && musicSession.songs.length > 1 ? 'x' : ''})
                    </h4>
                    {musicSession?.songs && musicSession.songs.length > 0 && (
                      <button
                        onClick={() => handleMusicControl('clear_queue')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Vider la file
                      </button>
                    )}
                  </div>

                  {(!musicSession?.songs || musicSession.songs.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
                      <Music className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">La file d'attente est actuellement vide.</p>
                      <p className="text-[11px] text-slate-500">Ajoutez des chansons ci-dessus ou utilisez la commande Discord <code>/play [titre/lien]</code> dans un salon vocal.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                      {musicSession.songs.map((track, idx) => (
                        <div
                          key={`${track.id}_${idx}`}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                            idx === musicSession.currentSongIndex
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                              {idx === musicSession.currentSongIndex ? '▶️' : `#${idx + 1}`}
                            </span>
                            <div className="min-w-0">
                              <h5 className={`text-xs font-bold truncate ${idx === musicSession.currentSongIndex ? 'text-emerald-400' : 'text-white'}`}>
                                {track.title}
                              </h5>
                              <p className="text-[10px] text-slate-400">⏱️ {track.duration || 'N/A'} • Ajouté par {track.requestedBy || 'Utilisateur'}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleMusicControl('remove_track', { index: idx })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Retirer de la file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIDEO TUTORIAL TAB */}
          {activeTab === 'tutorial' && (
            <div id="tutorial-view" className="space-y-8">
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Tv className="w-6 h-6 text-indigo-400" />
                      <h3 className="text-xl font-bold text-white">Guide Vidéo Officiel & Tutoriel Komorebi Bot</h3>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Apprenez à configurer et maîtriser l'intégralité des fonctionnalités de votre bot Komorebi pas à pas !
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Tutoriel HD 1080p • 2026
                    </span>
                  </div>
                </div>

                {/* Video Player Card */}
                <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                  
                  {/* Video Screen Area */}
                  <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center border-b border-slate-800/80 overflow-hidden group">
                    <img
                      src="/src/assets/images/komorebi_phone_ui_1783686936150.jpg"
                      alt="Thumbnail Tutoriel Komorebi"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                    {/* Animated Playing Content or Thumbnail */}
                    <div className="relative z-10 text-center p-6 max-w-xl space-y-4">
                      {tutorialPlaying ? (
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            LECTURE VIDÉO EN COURS...
                          </div>
                          <h4 className="text-lg sm:text-2xl font-black text-white tracking-wide">
                            {[
                              "Chapitre 1 : Introduction & Prise en main de Komorebi Bot",
                              "Chapitre 2 : Configuration Intelligente des Logs & Audits",
                              "Chapitre 3 : Protection Anti-Raid, Automod & Système Captcha",
                              "Chapitre 4 : Musique Vocale, Playlists & Commandes /musique",
                              "Chapitre 5 : Économie, Niveaux XP, ZenEggs & Tickets"
                            ][activeChapter]}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {[
                              "Découvrez l'interface du bot, comment l'inviter sur votre serveur et lui donner les permissions adéquates.",
                              "Apprenez à installer la catégorie 'COMPTES ET LOGS' et surveiller les messages, membres et modérations.",
                              "Sécurisez votre serveur contre les raids, le spam de liens et les utilisateurs malveillants.",
                              "Connectez le bot dans un salon vocal, jouez de la musique haute qualité et gérez la file d'attente.",
                              "Configurez la boutique d'œufs virtuels, l'XP textuel/vocal et le support par tickets."
                            ][activeChapter]}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-400 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
                            <Video className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold text-white">Tutoriel Complet de Komorebi Bot (Vidéo & Démo)</h4>
                          <p className="text-xs text-slate-400">Cliquez sur le bouton ci-dessous pour démarrer la lecture du guide vidéo interactif.</p>
                        </div>
                      )}

                      <button
                        onClick={() => setTutorialPlaying(!tutorialPlaying)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        <span>{tutorialPlaying ? 'Mettre en pause' : 'Lancer le Tutoriel Vidéo'}</span>
                      </button>
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur-md p-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 z-20 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setTutorialPlaying(!tutorialPlaying)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <span className="text-slate-300 font-mono text-[11px]">
                          {tutorialPlaying ? '03:45 / 15:00' : '00:00 / 15:00'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex-1 mx-2 h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: tutorialPlaying ? `${(activeChapter + 1) * 20}%` : '0%' }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">1080p HD</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-[10px] font-bold text-indigo-300 border border-indigo-800">Français 🇫🇷</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapters Selection Menu */}
                  <div className="p-6 bg-slate-900/60 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Chapitres de la Vidéo & Sommaire Interactif
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {[
                        { time: '00:00', title: '1. Introduction & Setup', desc: 'Prise en main & rôles' },
                        { time: '02:15', title: '2. Salons de Logs', desc: 'Audit & Surveillance' },
                        { time: '05:30', title: '3. Sécurité Anti-Raid', desc: 'Automod & Captcha' },
                        { time: '08:45', title: '4. Musique & Vocal', desc: '/musique & lecteur' },
                        { time: '12:10', title: '5. Économie & Tickets', desc: 'Boutique & Niveaux' }
                      ].map((chap, idx) => (
                        <button
                          key={chap.title}
                          onClick={() => {
                            setActiveChapter(idx);
                            setTutorialPlaying(true);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            activeChapter === idx
                              ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-900/40 px-1.5 py-0.5 rounded border border-indigo-500/20">
                              ⏱️ {chap.time}
                            </span>
                            {activeChapter === idx && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </div>
                          <h5 className="text-xs font-bold text-white mt-2 truncate">{chap.title}</h5>
                          <p className="text-[10px] text-slate-400 truncate">{chap.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Step by Step Text Guide Cards */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Guide Étape par Étape pour Bien Démarrer
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          1
                        </div>
                        <h5 className="text-sm font-bold text-white">Permissions & Emplacement du Rôle</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pour que le bot puisse expulser/bannir les spammers et gérer les salons vocaux, placez le rôle <strong>Komorebi</strong> tout en haut de la liste de vos rôles dans <code>Paramètres du serveur &gt; Rôles</code>.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          2
                        </div>
                        <h5 className="text-sm font-bold text-white">Installation des Salons de Logs</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Sur le dashboard (onglet <em>Vue d'ensemble</em>), cliquez sur <strong>"Installer la catégorie des logs"</strong> pour que le bot génère la catégorie sécurisée <code>📁╎COMPTES ET LOGS</code> avec les salons dédiés aux messages, vocaux, membres et modération.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                          3
                        </div>
                        <h5 className="text-sm font-bold text-white">Musique dans les Salons Vocaux</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Rejoignez n'importe quel salon vocal de votre serveur Discord, puis tapez <code>/musique play [titre]</code>. Le bot se connecte instantanément à votre salon et lance la musique. Vous pouvez aussi tout contrôler depuis l'onglet <strong>Lecteur Musique</strong> du dashboard !
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                          4
                        </div>
                        <h5 className="text-sm font-bold text-white">Synchronisation des Commandes</h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        En haut à droite du tableau de bord, le bouton ⚡ <strong>"Mettre à jour les Commandes"</strong> permet de rafraîchir immédiatement toutes les commandes Slash sur Discord.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-500 border-t border-slate-800/40 pt-6">
          <p>© 2026 Komorebi Discord Control Panel. Propulsé par Google Cloud Run & Firebase Firestore.</p>
        </footer>

      </div>
    </div>
  );
}
