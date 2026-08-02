import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DiscordBotManager } from './src/bot-manager';
import { MockFirestore } from './src/local-firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Initialize MongoDB / Local Database
  console.log("🟢 [DATABASE] Initializing MongoDB database via MockFirestore...");
  const firestoreDb = new MockFirestore() as any;

  // 2. Initialize Discord Bot Manager
  const botManager = new DiscordBotManager(firestoreDb);

  // Auto-start bot on boot if token is present (non-blocking, always online)
  botManager.getOrCreateConfig().then(async (config) => {
    if (config.token) {
      console.log("Auto-starting Discord Bot in the background...");
      await botManager.startBot();
    }
  }).catch(err => {
    console.error("Failed to auto-start Discord bot:", err);
  });

  // Helper to ensure each guild has preloaded mock data to test
  async function ensureMockDataSeeded(guildId: string) {
    if (!guildId || guildId === 'main') return;
    try {
      const usersSnap = await firestoreDb.collection('users').where('guildId', '==', guildId).get();
      if (usersSnap.empty) {
        const mockUsers = [
          { 
            id: `${guildId}_user1`, 
            username: "Alexis_K", 
            wallet: 1250, 
            bank: 5000, 
            xp: 450, 
            level: 3, 
            warnsCount: 0, 
            warns: [], 
            guildId,
            rpgLevel: 2,
            rpgXp: 110,
            rpgWins: 14,
            rpgLosses: 3,
            rpgHp: 110,
            rpgAttack: 18,
            rpgDefense: 6,
            rpgWeapon: "Épée d'acier 🗡️",
            rpgCoins: 350,
            rpgPotions: 2
          },
          { 
            id: `${guildId}_user2`, 
            username: "Lucie_Neko", 
            wallet: 4500, 
            bank: 15000, 
            xp: 1200, 
            level: 8, 
            warnsCount: 1, 
            warns: [{ id: "1", reason: "Spam d'emojis", timestamp: new Date().toISOString() }], 
            guildId,
            rpgLevel: 5,
            rpgXp: 45,
            rpgWins: 32,
            rpgLosses: 8,
            rpgHp: 140,
            rpgAttack: 27,
            rpgDefense: 9,
            rpgWeapon: "Amulette Maudite 🔮",
            rpgCoins: 1250,
            rpgPotions: 5
          },
          { 
            id: `${guildId}_user3`, 
            username: "Sébastien_Dev", 
            wallet: 80, 
            bank: 350, 
            xp: 50, 
            level: 1, 
            warnsCount: 0, 
            warns: [], 
            guildId,
            rpgLevel: 1,
            rpgXp: 15,
            rpgWins: 2,
            rpgLosses: 1,
            rpgHp: 100,
            rpgAttack: 15,
            rpgDefense: 5,
            rpgWeapon: "Bâton d'initiation 🪄",
            rpgCoins: 45,
            rpgPotions: 1
          }
        ];
        for (const u of mockUsers) {
          await firestoreDb.collection('users').doc(u.id).set(u);
        }
      }

      const cardsSnap = await firestoreDb.collection('giftcards').where('guildId', '==', guildId).get();
      if (cardsSnap.empty) {
        const mockCards = [
          { id: `KOMO-START-${guildId.substring(0, 4).toUpperCase()}`, value: 1000, tier: "commun", maxUses: 50, currentUses: 5, expiration: "off", claimedBy: [], guildId },
          { id: `KOMO-LEGEND-${guildId.substring(0, 4).toUpperCase()}`, value: 5000, tier: "legendaire", maxUses: 5, currentUses: 1, expiration: "off", claimedBy: [], guildId }
        ];
        for (const c of mockCards) {
          await firestoreDb.collection('giftcards').doc(c.id).set(c);
        }
      }

      const eggsSnap = await firestoreDb.collection('eggs').where('guildId', '==', guildId).get();
      if (eggsSnap.empty) {
        const mockEggs = [
          { id: `Œuf Commingeois 🥚`, price: 500, rewardType: "eco", rewardValue: "1000", guildId },
          { id: `Œuf Mystique ✨`, price: 2500, rewardType: "xp", rewardValue: "2000", guildId },
          { id: `Œuf VIP Impérial 👑`, price: 10000, rewardType: "role", rewardValue: "Rôle_VIP_Impérial", guildId }
        ];
        for (const e of mockEggs) {
          await firestoreDb.collection('eggs').doc(e.id).set(e);
        }
      }

      const trainSnap = await firestoreDb.collection('training').where('guildId', '==', guildId).get();
      if (trainSnap.empty) {
        const mockTrain = [
          { id: `${guildId}_train1`, trigger: "bonjour", response: "Salutations ! Comment se passe votre journée sur notre serveur ?", guildId, createdAt: new Date().toISOString() },
          { id: `${guildId}_train2`, trigger: "aide", response: "Je suis Komorebi, l'assistant IA de ce serveur. Vous pouvez utiliser les commandes de tickets pour obtenir de l'aide.", guildId, createdAt: new Date().toISOString() }
        ];
        for (const t of mockTrain) {
          await firestoreDb.collection('training').doc(t.id).set(t);
        }
      }
    } catch (e) {
      console.error("Error seeding mock guild data:", e);
    }
  }

  // 3. Define REST API endpoints

  // Custom Vanity URL & Direct Invite Redirects
  const DEFAULT_INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1532127867415171182&permissions=8&integration_type=0&scope=bot+applications.commands';

  app.get('/invite', (req, res) => {
    res.redirect(302, DEFAULT_INVITE_URL);
  });

  app.get('/v/:slug', (req, res) => {
    res.redirect(302, DEFAULT_INVITE_URL);
  });

  app.get('/api/custom-url', async (req, res) => {
    try {
      const doc = await firestoreDb.collection('settings').doc('custom_url').get();
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.json({ customDomain: 'https://komorebi-bot.com', vanitySlug: 'komorebi' });
      }
    } catch (err: any) {
      res.json({ customDomain: 'https://komorebi-bot.com', vanitySlug: 'komorebi' });
    }
  });

  app.post('/api/custom-url', async (req, res) => {
    try {
      const { customDomain, vanitySlug } = req.body;
      const data = {
        customDomain: customDomain ? customDomain.trim() : 'https://komorebi-bot.com',
        vanitySlug: vanitySlug ? vanitySlug.trim() : 'komorebi',
        updatedAt: new Date().toISOString()
      };
      await firestoreDb.collection('settings').doc('custom_url').set(data);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve generated banner images
  app.get('/api/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'src', 'assets', 'images', filename);
    if (fs.existsSync(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.sendFile(filePath);
    } else {
      res.status(404).send('Image non trouvée');
    }
  });
  
  // Get active or mock Guilds
  app.get('/api/guilds', async (req, res) => {
    try {
      const guilds = botManager.getGuilds();
      res.json(guilds);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get current Bot configuration (per guild)
  app.get('/api/config', async (req, res) => {
    try {
      const guildId = (req.query.guildId as string) || 'main';
      if (guildId !== 'main') {
        await ensureMockDataSeeded(guildId);
      }
      const config = await botManager.getOrCreateConfig(guildId);
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save Bot configuration (per guild)
  app.post('/api/config', async (req, res) => {
    try {
      const guildId = (req.body.guildId as string) || 'main';
      const oldConfig = await botManager.getOrCreateConfig(guildId);
      const updates = { ...req.body };
      delete updates.guildId; // Avoid saving duplicate key
      
      await botManager.updateConfigInDb(updates, guildId);
      const newConfig = { ...oldConfig, ...updates };

      // Handle real-time presence change if the bot is running
      if (botManager.client && botManager.isConnected) {
        const presenceStatus = updates.status !== undefined ? updates.status : oldConfig.status;
        const presenceText = updates.statusActivityText !== undefined ? updates.statusActivityText : oldConfig.statusActivityText;
        const presenceType = updates.statusActivityType !== undefined ? updates.statusActivityType : oldConfig.statusActivityType;
        await botManager.updatePresence(presenceStatus, presenceText, presenceType);
      }

      // If token changed and bot is running, restart it
      if (oldConfig.isRunning && updates.token && oldConfig.token !== updates.token) {
        await botManager.logEvent('info', 'Changement de token détecté, redémarrage du bot...', 'Dashboard', undefined, guildId);
        await botManager.startBot();
      }

      res.json({ success: true, config: newConfig });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start/Stop bot trigger
  app.post('/api/bot/control', async (req, res) => {
    try {
      const { action, guildId, token } = req.body;
      const targetGuild = guildId || 'main';

      if (token && typeof token === 'string' && token.trim()) {
        await botManager.updateConfigInDb({ token: token.trim(), isRunning: action === 'start' }, targetGuild);
      }

      if (action === 'start') {
        const success = await botManager.startBot();
        if (success) {
          res.json({ success: true, isRunning: true, message: 'Le bot Discord a été démarré avec succès !' });
        } else {
          res.status(400).json({ success: false, isRunning: false, error: 'Impossible de connecter le bot. Vérifiez que votre Token Discord est valide et bien copié depuis le Discord Developer Portal.' });
        }
      } else if (action === 'stop') {
        await botManager.stopBot();
        await botManager.updateConfigInDb({ isRunning: false }, targetGuild);
        res.json({ success: true, isRunning: false, message: 'Le bot a été mis hors ligne.' });
      } else if (action === 'redeploy_commands') {
        await botManager.registerSlashCommands();
        res.json({ success: true, isRunning: botManager.getBotInfo() !== null, message: 'Commandes Slash re-déployées et synchronisées à l\'instant sur Discord !' });
      } else {
        res.status(400).json({ error: 'Action invalide. Utilisez "start", "stop" ou "redeploy_commands".' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Erreur lors du contrôle du bot.' });
    }
  });

  // Get active Bot Info (Metrics, tag, latency)
  app.get('/api/info', async (req, res) => {
    try {
      const info = botManager.getBotInfo();
      res.json({ info, isConnected: info !== null });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Bot Activity Logs (optionally per guild)
  app.get('/api/logs', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('bot_logs');
      if (guildId && guildId !== 'all') {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      const logs: any[] = [];
      snap.forEach(doc => logs.push(doc.data()));
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Clear Activity Logs (optionally per guild)
  app.post('/api/logs/clear', async (req, res) => {
    try {
      const guildId = req.body.guildId as string;
      let query: any = firestoreDb.collection('bot_logs');
      if (guildId && guildId !== 'all') {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query.get();
      const batch = firestoreDb.batch();
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      await botManager.logEvent('info', 'Historique des logs effacé par l\'administrateur.', 'Dashboard', undefined, guildId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get active tickets list (scoped per guild)
  app.get('/api/tickets', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('tickets');
      if (guildId) {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query
        .orderBy('createdAt', 'desc')
        .get();

      const tickets: any[] = [];
      snap.forEach(doc => tickets.push(doc.data()));
      res.json(tickets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Close ticket from Dashboard
  app.post('/api/tickets/:id/close', async (req, res) => {
    try {
      const { id } = req.params;
      const { guildId } = req.body;
      await firestoreDb.collection('tickets').doc(id).update({
        status: 'closed',
        closedAt: new Date().toISOString()
      });
      await botManager.logEvent('info', `Ticket #${id} fermé à distance depuis le tableau de bord.`, 'Dashboard', undefined, guildId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get custom training instructions (scoped per guild)
  app.get('/api/training', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('training');
      if (guildId) {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query
        .orderBy('createdAt', 'desc')
        .get();

      const training: any[] = [];
      snap.forEach(doc => training.push(doc.data()));
      res.json(training);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a training instruction (scoped per guild)
  app.post('/api/training', async (req, res) => {
    try {
      const { trigger, response, guildId } = req.body;
      if (!trigger || !response) {
        return res.status(400).json({ error: 'Trigger and response are required' });
      }

      const id = firestoreDb.collection('training').doc().id;
      const trainingItem = {
        id,
        trigger: trigger.trim(),
        response: response.trim(),
        guildId: guildId || 'main',
        createdAt: new Date().toISOString()
      };

      await firestoreDb.collection('training').doc(id).set(trainingItem);
      await botManager.logEvent('success', `Nouvelle consigne apprise : "${trigger.substring(0, 20)}..."`, 'Dashboard', undefined, guildId);
      res.json(trainingItem);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a training instruction
  app.delete('/api/training/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { guildId } = req.query;
      await firestoreDb.collection('training').doc(id).delete();
      await botManager.logEvent('info', 'Consigne d\'entraînement supprimée.', 'Dashboard', undefined, guildId as string);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Expanded API Endpoints for Komorebi Modules ---

  // --- Music Player Dashboard Endpoints ---
  app.get('/api/music/session', async (req, res) => {
    try {
      const guildId = (req.query.guildId as string) || 'main';
      const session = botManager.getPublicMusicSession(guildId);
      res.json(session);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/music/control', async (req, res) => {
    try {
      const { guildId = 'main', action, query, volume, index } = req.body;
      const updatedSession = await botManager.controlMusicSessionFromDashboard(guildId, action, { query, volume, index });
      res.json(updatedSession);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/music/extract-audio', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: 'Le paramètre query est requis' });
      const extracted = await botManager.extractAudioStreamInfo(query);
      res.json(extracted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Social Feeds Check Trigger Endpoint ---
  app.post('/api/social/check', async (req, res) => {
    try {
      const { guildId = 'main' } = req.body;
      const announcements = await botManager.checkSocialFeeds(guildId);
      res.json({ success: true, count: announcements.length, announcements });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get users database (XP, wallet, level) (scoped per guild)
  app.get('/api/users', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('users');
      if (guildId) {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query.get();
      const users: any[] = [];
      snap.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update specific user profile stats (scoped per guild)
  app.post('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { guildId } = req.body;
      const updates = { ...req.body };
      delete updates.id;
      delete updates.guildId;

      await firestoreDb.collection('users').doc(id).set(updates, { merge: true });
      await botManager.logEvent('success', `Profil mis à jour pour @${updates.username || id}`, 'Dashboard', undefined, guildId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Execute admin and mod tools remotely
  app.post('/api/admin/action', async (req, res) => {
    try {
      const { action, userId, guildId, value, roleId, channelId, message } = req.body;
      
      if (action === 'clear-warns') {
        const userRef = firestoreDb.collection('users').doc(userId);
        await userRef.set({ warnsCount: 0, warns: [] }, { merge: true });
        await botManager.logEvent('moderation', `Avertissements effacés pour l'utilisateur ID: ${userId}`, 'Dashboard', undefined, guildId);
        return res.json({ success: true, message: "Avertissements effacés avec succès !" });
      }

      if (action === 'deban') {
        await botManager.logEvent('moderation', `Action de débannissement initiée pour l'ID: ${userId}`, 'Dashboard', undefined, guildId);
        if (botManager.getBotInfo()) {
          const success = await botManager.unbanUser(guildId, userId);
          if (success) {
            return res.json({ success: true, message: `Utilisateur ${userId} débanni avec succès !` });
          }
        }
        return res.json({ success: true, message: `Demande de débannissement enregistrée pour l'ID ${userId} (Le bot doit être en ligne).` });
      }

      if (action === 'demute') {
        await botManager.logEvent('moderation', `Action de démute initiée pour l'ID: ${userId}`, 'Dashboard', undefined, guildId);
        if (botManager.getBotInfo()) {
          const success = await botManager.unmuteUser(guildId, userId);
          if (success) {
            return res.json({ success: true, message: `Utilisateur ${userId} démute avec succès !` });
          }
        }
        return res.json({ success: true, message: `Demande de démute enregistrée pour l'ID ${userId} (Le bot doit être en ligne).` });
      }

      if (action === 'set-xp') {
        const xpVal = Number(value);
        const userRef = firestoreDb.collection('users').doc(userId);
        await userRef.set({ xp: xpVal }, { merge: true });
        await botManager.logEvent('success', `XP défini à ${xpVal} pour l'utilisateur ID: ${userId}`, 'Dashboard', undefined, guildId);
        return res.json({ success: true, message: `XP défini à ${xpVal} avec succès !` });
      }

      if (action === 'set-level') {
        const lvlVal = Number(value);
        const userRef = firestoreDb.collection('users').doc(userId);
        await userRef.set({ level: lvlVal }, { merge: true });
        await botManager.logEvent('success', `Niveau défini à ${lvlVal} pour l'utilisateur ID: ${userId}`, 'Dashboard', undefined, guildId);
        return res.json({ success: true, message: `Niveau défini à ${lvlVal} avec succès !` });
      }

      if (action === 'broadcast') {
        await botManager.logEvent('info', `Annonce envoyée vers le salon ${channelId || 'par défaut'} avec mention du rôle ${roleId || 'everyone'}`, 'Dashboard', undefined, guildId);
        
        if (botManager.getBotInfo()) {
          const success = await botManager.sendBroadcastAnnouncement(guildId, channelId, roleId, message);
          if (success) {
            return res.json({ success: true, message: "Annonce diffusée en direct sur Discord !" });
          }
        }
        return res.json({ success: true, message: "Annonce configurée avec succès ! (Le bot doit être en ligne pour la diffuser)" });
      }

      res.status(400).json({ error: "Action administrative inconnue." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get giftcards list (scoped per guild)
  app.get('/api/giftcards', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('giftcards');
      if (guildId) {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query.get();
      const cards: any[] = [];
      snap.forEach(doc => {
        cards.push({ id: doc.id, ...doc.data() });
      });
      res.json(cards);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create or Edit a giftcard (scoped per guild)
  app.post('/api/giftcards', async (req, res) => {
    try {
      const { id, value, tier, maxUses, expiration, guildId } = req.body;
      if (!id || !value || !tier) {
        return res.status(400).json({ error: 'Code, valeur et tier sont requis.' });
      }
      const cardData = {
        id: id.trim().toUpperCase(),
        value: Number(value),
        tier,
        maxUses: maxUses === 'infini' ? 'infini' : Number(maxUses),
        expiration: expiration || 'off',
        currentUses: 0,
        claimedBy: [],
        guildId: guildId || 'main'
      };
      await firestoreDb.collection('giftcards').doc(cardData.id).set(cardData);
      await botManager.logEvent('success', `Carte cadeau créée/modifiée : ${cardData.id} (${value} ${tier})`, 'Dashboard', undefined, guildId);
      res.json(cardData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a giftcard
  app.delete('/api/giftcards/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { guildId } = req.query;
      await firestoreDb.collection('giftcards').doc(id).delete();
      await botManager.logEvent('info', `Carte cadeau supprimée : ${id}`, 'Dashboard', undefined, guildId as string);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Eggs list (Shop) (scoped per guild)
  app.get('/api/eggs', async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      let query: any = firestoreDb.collection('eggs');
      if (guildId) {
        query = query.where('guildId', '==', guildId);
      }
      const snap = await query.get();
      const eggs: any[] = [];
      snap.forEach(doc => {
        eggs.push({ id: doc.id, ...doc.data() });
      });
      res.json(eggs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create or edit egg in shop (scoped per guild)
  app.post('/api/eggs', async (req, res) => {
    try {
      const { id, price, rewardType, rewardValue, guildId } = req.body;
      if (!id || !price || !rewardType || !rewardValue) {
        return res.status(400).json({ error: 'Nom, prix, type de gain et valeur sont requis.' });
      }
      const eggData = {
        id: id.trim(),
        price: Number(price),
        rewardType,
        rewardValue: rewardValue.trim(),
        guildId: guildId || 'main'
      };
      await firestoreDb.collection('eggs').doc(eggData.id).set(eggData);
      await botManager.logEvent('success', `Œuf boutique configuré : ${eggData.id} (Prix: ${price})`, 'Dashboard', undefined, guildId);
      res.json(eggData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete an egg from shop
  app.delete('/api/eggs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { guildId } = req.query;
      await firestoreDb.collection('eggs').doc(id).delete();
      await botManager.logEvent('info', `Œuf boutique supprimé : ${id}`, 'Dashboard', undefined, guildId as string);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3.5. Keep-Alive & Self-Ping System to ensure bot stays online
  app.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });

  let lastKnownHost = '';
  app.use((req, res, next) => {
    const host = req.get('host');
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      lastKnownHost = host;
    }
    next();
  });

  setInterval(() => {
    // Local internal ping to keep event loop warm
    fetch('http://127.0.0.1:3000/ping').catch(() => null);

    // External self-ping if we have detected a public hostname (e.g. on Cloud Run)
    if (lastKnownHost) {
      const protocol = lastKnownHost.includes('europe-west2.run.app') || lastKnownHost.includes('.app') ? 'https' : 'http';
      fetch(`${protocol}://${lastKnownHost}/ping`)
        .then(() => console.log(`[KEEP-ALIVE] Pinged public server at ${protocol}://${lastKnownHost}/ping`))
        .catch(err => console.error(`[KEEP-ALIVE] Ping failed for ${lastKnownHost}:`, err.message || err));
    }
  }, 45000); // ping every 45 seconds to guarantee it stays online

  // 4. Vite Frontend Mounting
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
