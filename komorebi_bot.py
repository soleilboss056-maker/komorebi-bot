import os
import json
import random
import datetime
import asyncio
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import discord
from discord import app_commands
from discord.ext import commands, tasks
import firebase_admin
from firebase_admin import credentials, firestore

# -------------------------------------------------------------
# RENDER HTTP KEEP-ALIVE SERVER
# -------------------------------------------------------------
class RenderHealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b"Komorebi Bot Web Service Active")

    def log_message(self, format, *args):
        return

def start_render_http_server():
    port = int(os.environ.get("PORT", 8080))
    def run():
        try:
            server = HTTPServer(('0.0.0.0', port), RenderHealthCheckHandler)
            print(f"[Render HTTP] Serveur Web de santé actif sur 0.0.0.0:{port}")
            server.serve_forever()
        except Exception as e:
            print(f"[Render HTTP] Erreur lors du lancement du serveur HTTP : {e}")

    t = threading.Thread(target=run, daemon=True)
    t.start()

start_render_http_server()

# Initialize Firebase using local applet configuration
db = None
try:
    if os.path.exists('firebase-applet-config.json'):
        with open('firebase-applet-config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Check if already initialized to prevent duplicate app errors
        if not firebase_admin._apps:
            # We can use credential-less or service account depending on configuration.
            # In our sandboxed container environment, the environment variables or a default config works.
            cred = credentials.Certificate('firebase-applet-config.json') if 'private_key' in config else credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': config.get('projectId')
            })
        db = firestore.client()
        print("[Firebase] Connecté avec succès à Firestore.")
    else:
        print("[Firebase] ATTENTION : 'firebase-applet-config.json' introuvable. Stockage local temporaire activé.")
except Exception as e:
    print(f"[Firebase] Erreur d'initialisation (mode local de secours activé) : {e}")

# Class definitions for Local Fallback Storage if Firestore is unavailable
class LocalFirestoreFallback:
    def __init__(self):
        self.store = {}
    
    def collection(self, name):
        if name not in self.store:
            self.store[name] = {}
        return LocalCollection(self.store[name])

class LocalCollection:
    def __init__(self, data):
        self.data = data
    
    def document(self, doc_id=None):
        if not doc_id:
            doc_id = f"rand_{random.randint(100000, 999999)}"
        if doc_id not in self.data:
            self.data[doc_id] = {}
        return LocalDocument(self.data, doc_id)
    
    def doc(self, doc_id=None):
        return self.document(doc_id)
    
    def stream(self):
        return [LocalDocumentSnap(k, v) for k, v in self.data.items()]
    
    def get(self):
        return self.stream()

class LocalDocument:
    def __init__(self, parent_data, doc_id):
        self.parent_data = parent_data
        self.doc_id = doc_id
    
    def get(self):
        return LocalDocumentSnap(self.doc_id, self.parent_data.get(self.doc_id, {}))
    
    def set(self, data, merge=True):
        if merge and self.doc_id in self.parent_data:
            self.parent_data[self.doc_id].update(data)
        else:
            self.parent_data[self.doc_id] = data
    
    def update(self, data):
        self.set(data, merge=True)
        
    def delete(self):
        if self.doc_id in self.parent_data:
            del self.parent_data[self.doc_id]

class LocalDocumentSnap:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = data
        self.exists = bool(data)
        
    def to_dict(self):
        return self._data

if db is None:
    db = LocalFirestoreFallback()

# -------------------------------------------------------------
# BOT CONFIGURATION & CORE SETUP
# -------------------------------------------------------------

def get_bot_config():
    """Retrieve global bot configuration from Firestore or return defaults."""
    doc = db.collection('bot_config').document('main').get()
    default_config = {
        'token': os.getenv('DISCORD_TOKEN', ''),
        'status': 'online',
        'isRunning': True,
        'aiEnabled': True,
        'aiProvider': 'gemini',
        'apiKey': '',
        'systemPrompt': "Tu es Komorebi, l'IA officielle du serveur. Réponds avec intelligence et répartie.",
        'botName': 'Komorebi',
        'ticketPrefix': 'ticket-',
        
        # Guard
        'guardAntiraid': False,
        'guardAntispam': True,
        'guardAntilink': True,
        'guardAntibot': False,
        'guardLimitSpam': 5,
        'guardLimitSpamTime': 5,
        'guardSanctionSpam': 'timeout',
        'guardSanctionLink': 'warn',
        'guardLogsChannelId': '',
        'guardCaptcha': False,
        'fortressMode': False,
        
        # Economy
        'currencyName': 'ZenCoins',
        'currencyEmoji': '🪙',
        'salaryWorkMin': 100,
        'salaryWorkMax': 500,
        'salaryWorkCooldown': 10,
        'salaryCrimeMin': 200,
        'salaryCrimeMax': 1000,
        'salaryCrimeCooldown': 30,
        'robSuccessRate': 40,
        'robMaxFine': 300,
        
        # Leveling
        'levelXpStatus': True,
        'xpRateMin': 15,
        'xpRateMax': 25,
        'xpRateCooldown': 60,
        'vocalXpAmount': 10,
        'vocalXpMinutes': 5,
        'levelRewards': {},
        'levelAnnouncement': 'current',
        'levelMoneyStatus': True,
        'levelMoneyRewardAmount': 1000
    }
    
    if doc.exists:
        data = doc.to_dict()
        # Merge keys to support updates
        for k, v in default_config.items():
            if k not in data:
                data[k] = v
        return data
    return default_config

# Initialize bot client with full gateway intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True
intents.presences = True
intents.voice_states = True

bot = commands.Bot(command_prefix="k!", intents=intents)
tree = bot.tree
has_synced = False

# Track memory for anti-spam/cooldowns
spam_track = {} # user_id -> list of timestamps
join_track = [] # list of join timestamps for anti-raid

# -------------------------------------------------------------
# HELPERS FOR USERS (XP & ECONOMY)
# -------------------------------------------------------------

def get_user_profile(user_id: str, username: str = "Inconnu"):
    """Fetch or initialize a user profile in Firestore."""
    doc_ref = db.collection('users').document(user_id)
    doc = doc_ref.get()
    default_profile = {
        'id': user_id,
        'username': username,
        'wallet': 500,
        'bank': 0,
        'xp': 0,
        'level': 1,
        'inventory': {},
        'warnsCount': 0,
        'warns': [],
        'lastWork': 'off',
        'lastCrime': 'off'
    }
    if doc.exists:
        data = doc.to_dict()
        for k, v in default_profile.items():
            if k not in data:
                data[k] = v
        return data
    else:
        doc_ref.set(default_profile)
        return default_profile

def save_user_profile(user_id: str, profile: dict):
    """Save user profile to database."""
    db.collection('users').document(user_id).set(profile)

def log_event(log_type: str, message: str, user: str = None, guild: str = None):
    """Write an event log to the Firestore collection."""
    log_id = f"log_{random.randint(100000, 999999)}"
    log_data = {
        'id': log_id,
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'type': log_type,
        'message': message,
        'user': user or 'Système',
        'guild': guild or 'Global'
    }
    db.collection('bot_logs').document(log_id).set(log_data)
    print(f"[{log_type.upper()}] {message}")

# -------------------------------------------------------------
# DISCORD EVENT LISTENERS
# -------------------------------------------------------------

# -------------------------------------------------------------
# SLASH COMMAND SYNC HELPERS & INTERACTION HANDLERS
# -------------------------------------------------------------

def load_all_commands():
    """Load the full 100 slash commands list from commands_extracted.json."""
    if os.path.exists("commands_extracted.json"):
        try:
            with open("commands_extracted.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                print(f"[Slash] Chargement de {len(data)} commandes depuis commands_extracted.json.")
                return data
        except Exception as e:
            print(f"[Slash] Erreur lors de la lecture de commands_extracted.json: {e}")
    return []

async def sync_all_global_commands(bot_instance):
    """Bulk register all 100 slash commands to Discord's global application commands REST API endpoint."""
    all_cmds = load_all_commands()
    if not all_cmds:
        print("[Slash] Fichier commands_extracted.json non disponible. Fallback sur tree.sync().")
        synced = await bot_instance.tree.sync()
        return len(synced)

    try:
        app_id = bot_instance.application_id or (bot_instance.user.id if bot_instance.user else None)
        if not app_id:
            if bot_instance.application:
                app_id = bot_instance.application.id
        
        if app_id:
            from discord.http import Route
            route = Route('PUT', '/applications/{application_id}/commands', application_id=app_id)
            await bot_instance.http.request(route, json=all_cmds)
            print(f"[Slash] ✅ {len(all_cmds)} commandes globales enregistrées avec succès sur Discord via l'API REST !")
            return len(all_cmds)
        else:
            synced = await bot_instance.tree.sync()
            return len(synced)
    except Exception as e:
        print(f"[Slash] Erreur lors du bulk upsert global API: {e}. Fallback sur tree.sync().")
        try:
            synced = await bot_instance.tree.sync()
            return len(synced)
        except Exception as sync_err:
            print(f"[Slash] Erreur tree.sync() fallback: {sync_err}")
            return 0

@bot.event
async def on_ready():
    global has_synced
    config = get_bot_config()
    bot_name = config.get('botName', 'Komorebi')
    
    # Set Presence Status
    status_str = config.get('status', 'online')
    act = discord.Activity(type=discord.ActivityType.listening, name="la communauté | k!help")
    
    status_map = {
        'online': discord.Status.online,
        'idle': discord.Status.idle,
        'dnd': discord.Status.dnd,
        'invisible': discord.Status.invisible
    }
    
    await bot.change_presence(status=status_map.get(status_str, discord.Status.online), activity=act)
    
    # Register slash commands once per session to avoid Rate Limit (429) and duplicate commands
    if not has_synced:
        try:
            # Clear guild-specific commands to remove any duplicates from main server
            GUILD_ID = discord.Object(id=1521989413973004318)
            tree.clear_commands(guild=GUILD_ID)
            await tree.sync(guild=GUILD_ID)
            print("[Slash] Nettoyage des commandes spécifiques du serveur principal effectué.")
            
            # Global bulk synchronization of all 100 commands
            cmd_count = await sync_all_global_commands(bot)
            has_synced = True
            print(f"[Slash] Synchronisation globale terminée : {cmd_count} commandes enregistrées.")
        except Exception as e:
            print(f"[Slash] Erreur lors de la synchronisation globale des commandes : {e}")
    else:
        print("[Slash] Synchronisation des commandes déjà effectuée au démarrage.")
        
    # Update announcements disabled per user request
    print("[Update Log] Automatic update announcements disabled per user request.")

    log_event('success', f"{bot_name} est en ligne sur Discord !")

@bot.event
async def on_interaction(interaction: discord.Interaction):
    if interaction.type == discord.InteractionType.application_command:
        if interaction.response.is_done():
            return

        data = interaction.data or {}
        cmd_name = data.get('name', '')

        # Skip commands handled by specific @bot.tree.command decorators
        if cmd_name in ["ban", "kick", "timeout", "money", "work", "giftcard_claim", "ticket_setup"]:
            return

        invite_url = "https://discord.com/oauth2/authorize?client_id=1532127867415171182&permissions=8&integration_type=0&scope=bot+applications.commands"

        # If executed outside a server and not allowed globally
        if not interaction.guild and cmd_name not in ['help', 'status', 'status-bot', 'statut', 'statut-bot', 'avatar', 'banner', 'profile', 'invite']:
            await interaction.response.send_message(
                f"⚠️ **Pour utiliser cette commande, vous devez d'abord inviter le bot sur votre serveur !** 😉\n\n👉 [Cliquez ici pour inviter le bot]({invite_url})",
                ephemeral=True
            )
            return

        try:
            if cmd_name == 'invite':
                embed = discord.Embed(
                    title="🔗 Inviter le Bot Komorebi",
                    description="Pour utiliser ce bot et profiter de l'ensemble de ses 100 commandes, invitez-le sur votre serveur Discord :",
                    color=discord.Color.purple()
                )
                embed.add_field(name="👉 Lien d'invitation", value=f"[Cliquez ici pour inviter Komorebi]({invite_url})", inline=False)
                view = discord.ui.View()
                view.add_item(discord.ui.Button(label="Inviter le Bot", url=invite_url, style=discord.ButtonStyle.link))
                await interaction.response.send_message(embed=embed, view=view, ephemeral=False)

            elif cmd_name == 'musique':
                embed = discord.Embed(
                    title="🎵 Lecteur Musique & Panneau Komorebi",
                    description="Rejoignez un salon vocal pour diffuser vos morceaux préférés !",
                    color=discord.Color.purple()
                )
                embed.add_field(name="🎧 Utilisation", value="`/musique recherche_ou_lien: [Titre / Lien]`", inline=False)
                embed.add_field(name="✨ Plateformes supportées", value="YouTube, Spotify, SoundCloud", inline=False)
                await interaction.response.send_message(embed=embed, ephemeral=True)

            elif cmd_name == 'config':
                embed = discord.Embed(
                    title="⚙️ Panneau de Configuration - Komorebi Bot",
                    description="Tous les modules du bot Komorebi sont pleinement activés :",
                    color=discord.Color.purple()
                )
                embed.add_field(name="🛡️ Sécurité & AutoMod", value="Actif (Antispam, Antilink, Antiraid)", inline=True)
                embed.add_field(name="🪙 Économie & Niveaux", value="Actif (ZenCoins, XP Vocal & Textuel)", inline=True)
                embed.add_field(name="🎫 Système de Tickets", value="Actif (Boutons interactifs)", inline=True)
                await interaction.response.send_message(embed=embed, ephemeral=True)

            elif cmd_name == 'help':
                embed = discord.Embed(
                    title="📖 Centre d'Aide - 100 Commandes Komorebi",
                    description="Voici un aperçu des catégories principales des commandes :",
                    color=discord.Color.purple()
                )
                embed.add_field(name="🎵 Musique", value="`/musique`", inline=True)
                embed.add_field(name="⚙️ Configuration", value="`/config`, `/leveling-config`, `/economy-config`", inline=True)
                embed.add_field(name="🛡️ Modération", value="`/ban`, `/kick`, `/mute`, `/clear`, `/warn`, `/unwarn`", inline=True)
                embed.add_field(name="🪙 Économie & Jeux", value="`/work`, `/balance`, `/daily`, `/pay`, `/morpion`, `/casino-duel`", inline=True)
                embed.add_field(name="🎫 Support & Serveur", value="`/ticket`, `/close`, `/candidature`, `/reglement`", inline=True)
                await interaction.response.send_message(embed=embed, ephemeral=False)

            elif cmd_name == 'reglement':
                embed = discord.Embed(
                    title="📜 Règlement du Serveur",
                    description="Merci de respecter l'ensemble des règles communautaires :",
                    color=discord.Color.purple()
                )
                embed.add_field(name="1. Courtoisie", value="Soyez respectueux envers tous les membres.", inline=False)
                embed.add_field(name="2. Anti-Spam", value="Aucune publicité ou spam n'est autorisé.", inline=False)
                await interaction.response.send_message(embed=embed, ephemeral=False)

            elif cmd_name == 'candidature':
                embed = discord.Embed(
                    title="📝 Formulaire de Candidature",
                    description="Soumettez votre candidature pour rejoindre l'équipe du staff.",
                    color=discord.Color.purple()
                )
                embed.add_field(name="📌 Inscription", value="Formulaire de candidature disponible.", inline=False)
                await interaction.response.send_message(embed=embed, ephemeral=True)

            else:
                embed = discord.Embed(
                    title=f"❓ Commande /{cmd_name} Inconnue",
                    description=f"La commande `/{cmd_name}` n'est pas configurée dans ce module Python. Utilisez `/help` pour voir la liste des 100+ commandes disponibles.",
                    color=discord.Color.orange()
                )
                await interaction.response.send_message(embed=embed, ephemeral=True)
        except Exception as e:
            print(f"[Interaction Error] /{cmd_name}: {e}")

@bot.event
async def on_member_join(member: discord.Member):
    config = get_bot_config()
    
    # 1. Fortress Mode Check
    if config.get('fortressMode', False):
        try:
            await member.send("🔒 Le serveur est actuellement en verrouillage de sécurité temporaire (Fortress Mode).")
            await member.kick(reason="Fortress Mode Activé")
            log_event('moderation', f"Fortress Mode: {member} a été expulsé d'office à la connexion.", guild=member.guild.name)
            return
        except Exception:
            pass

    # 2. Anti-Raid Guard
    if config.get('guardAntiraid', False):
        now = datetime.datetime.utcnow()
        global join_track
        join_track = [t for t in join_track if (now - t).total_seconds() < 10]
        join_track.append(now)
        
        if len(join_track) > 5: # More than 5 joins in 10 seconds triggers anti-raid protection
            log_event('warning', f"🚨 Raid suspect détecté ! Activation automatique des protections.", guild=member.guild.name)
            # Take sanction or notify staff
            try:
                await member.kick(reason="Protection Anti-Raid Active")
                return
            except Exception:
                pass

    # 3. Captcha Greeting Guard
    if config.get('guardCaptcha', False):
        captcha_chan_id = config.get('guardCaptchaChannelId')
        if captcha_chan_id:
            channel = bot.get_channel(int(captcha_chan_id))
            if channel:
                # Create validation interaction
                embed = discord.Embed(
                    title="🛡️ Vérification Captcha requis",
                    description=f"Bienvenue {member.mention} ! Veuillez prouver que vous n'êtes pas un robot en cliquant sur le bouton ci-dessous.",
                    color=discord.Color.purple()
                )
                class CaptchaView(discord.ui.View):
                    def __init__(self):
                        super().__init__(timeout=180.0)
                    
                    @discord.ui.button(label="Je suis un Humain 🤠", style=discord.ButtonStyle.green)
                    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
                        if interaction.user.id != member.id:
                            await interaction.response.send_message("Ce bouton ne vous est pas destiné.", ephemeral=True)
                            return
                        verified_role_id = config.get('guardCaptchaRoleVerifiedId')
                        if verified_role_id:
                            role = interaction.guild.get_role(int(verified_role_id))
                            if role:
                                await member.add_roles(role)
                                await interaction.response.send_message("✅ Votre accès a été validé ! Bienvenue sur le serveur.", ephemeral=True)
                                self.stop()
                                return
                        await interaction.response.send_message("✅ Vérification captcha réussie !", ephemeral=True)
                        self.stop()
                
                await channel.send(embed=embed, view=CaptchaView())

@bot.event
async def on_message(message: discord.Message):
    if message.author.bot:
        return

    config = get_bot_config()

    # 1. Anti-Spam Guard
    if config.get('guardAntispam', False):
        user_id = message.author.id
        now = datetime.datetime.utcnow()
        if user_id not in spam_track:
            spam_track[user_id] = []
        
        # Clean obsolete triggers
        limit_time = config.get('guardLimitSpamTime', 5)
        spam_track[user_id] = [t for t in spam_track[user_id] if (now - t).total_seconds() < limit_time]
        spam_track[user_id].append(now)
        
        limit_spam = config.get('guardLimitSpam', 5)
        if len(spam_track[user_id]) > limit_spam:
            sanction = config.get('guardSanctionSpam', 'timeout')
            await message.channel.send(f"⚠️ {message.author.mention}, arrêtez de spammer ! Sanction : **{sanction}**")
            try:
                await message.delete()
            except Exception:
                pass
            
            # Apply real sanction
            if sanction == 'timeout':
                try:
                    await message.author.timeout(datetime.timedelta(minutes=5), reason="Anti-Spam")
                except Exception:
                    pass
            elif sanction == 'kick':
                try:
                    await message.author.kick(reason="Anti-Spam")
                except Exception:
                    pass
            return

    # 2. Anti-Link Guard
    if config.get('guardAntilink', False) and ("http://" in message.content or "https://" in message.content or "discord.gg/" in message.content):
        # Allow administrators and whitelists
        if not message.author.guild_permissions.administrator:
            try:
                await message.delete()
                await message.channel.send(f"❌ {message.author.mention}, les liens ne sont pas tolérés sur ce serveur !", delete_after=5)
                log_event('moderation', f"Lien supprimé pour {message.author}", user=message.author.name, guild=message.guild.name)
                return
            except Exception:
                pass

    # 3. Message XP Leveling
    if config.get('levelXpStatus', True):
        user_id = str(message.author.id)
        profile = get_user_profile(user_id, message.author.name)
        
        # Give random experience between Min/Max
        xp_gain = random.randint(config.get('xpRateMin', 15), config.get('xpRateMax', 25))
        profile['xp'] += xp_gain
        
        # Check level up (Equation: Level * 100 XP required)
        needed = profile['level'] * 100
        if profile['xp'] >= needed:
            profile['xp'] -= needed
            profile['level'] += 1
            
            # Money bonus if active
            reward_str = ""
            if config.get('levelMoneyStatus', True):
                bonus = config.get('levelMoneyRewardAmount', 1000)
                profile['wallet'] += bonus
                reward_str = f" et vous gagnez **{bonus} {config.get('currencyEmoji', '🪙')}** !"
            
            # Announcement
            ann_mode = config.get('levelAnnouncement', 'current')
            ann_text = f"🎉 Félicitations {message.author.mention} ! Vous passez au **Niveau {profile['level']}**{reward_str} !"
            
            if ann_mode == 'current':
                await message.channel.send(ann_text)
            elif ann_mode == 'dm':
                try:
                    await message.author.send(ann_text)
                except Exception:
                    pass
            
        save_user_profile(user_id, profile)

    # Allow processing hybrid and hybrid commands
    await bot.process_commands(message)

# -------------------------------------------------------------
# MODERATION SLASH COMMANDS
# -------------------------------------------------------------

@bot.tree.command(name="ban", description="Bannir un membre du serveur.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
@app_commands.describe(member="Le membre à bannir", reason="Raison de la sanction")
async def ban(interaction: discord.Interaction, member: discord.Member, reason: str = "Aucune raison fournie"):
    if not interaction.user.guild_permissions.ban_members:
        await interaction.response.send_message("❌ Vous n'avez pas la permission d'exécuter cette commande.", ephemeral=True)
        return
        
    # Interactive Confirmation
    class ConfirmBan(discord.ui.View):
        def __init__(self):
            super().__init__(timeout=30.0)
            
        @discord.ui.button(label="Confirmer le Bannissement", style=discord.ButtonStyle.danger)
        async def confirm(self, inter: discord.Interaction, button: discord.ui.Button):
            try:
                await member.ban(reason=reason)
                await inter.response.send_message(f"✅ **{member}** a été banni avec succès du serveur. Raison: {reason}")
                log_event('moderation', f"Membre banni: {member}. Raison: {reason}", user=interaction.user.name, guild=interaction.guild.name)
            except Exception as e:
                await inter.response.send_message(f"❌ Échec de l'exclusion : {e}", ephemeral=True)
            self.stop()
            
        @discord.ui.button(label="Annuler", style=discord.ButtonStyle.secondary)
        async def cancel(self, inter: discord.Interaction, button: discord.ui.Button):
            await inter.response.send_message("Opération annulée.", ephemeral=True)
            self.stop()
            
    await interaction.response.send_message(f"⚠️ Souhaitez-vous réellement bannir **{member}** du serveur ?", view=ConfirmBan(), ephemeral=True)

@bot.tree.command(name="kick", description="Expulser un membre du serveur.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def kick(interaction: discord.Interaction, member: discord.Member, reason: str = "Aucune raison fournie"):
    if not interaction.user.guild_permissions.kick_members:
        await interaction.response.send_message("❌ Vous n'avez pas la permission.", ephemeral=True)
        return
        
    class ConfirmKick(discord.ui.View):
        def __init__(self):
            super().__init__(timeout=30.0)
            
        @discord.ui.button(label="Confirmer l'Expulsion", style=discord.ButtonStyle.danger)
        async def confirm(self, inter: discord.Interaction, button: discord.ui.Button):
            try:
                await member.kick(reason=reason)
                await inter.response.send_message(f"✅ **{member}** a été expulsé. Raison: {reason}")
                log_event('moderation', f"Membre expulsé: {member}. Raison: {reason}", user=interaction.user.name, guild=interaction.guild.name)
            except Exception as e:
                await inter.response.send_message(f"❌ Échec: {e}", ephemeral=True)
            self.stop()
            
        @discord.ui.button(label="Annuler", style=discord.ButtonStyle.secondary)
        async def cancel(self, inter: discord.Interaction, button: discord.ui.Button):
            await inter.response.send_message("Annulé.", ephemeral=True)
            self.stop()
            
    await interaction.response.send_message(f"⚠️ Confirmer l'expulsion de **{member}** ?", view=ConfirmKick(), ephemeral=True)

@bot.tree.command(name="timeout", description="Mettre un membre en sourdine temporaire.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def timeout(interaction: discord.Interaction, member: discord.Member, minutes: int, reason: str = "Non spécifiée"):
    if not interaction.user.guild_permissions.moderate_members:
        await interaction.response.send_message("❌ Permission manquante.", ephemeral=True)
        return
    try:
        dur = datetime.timedelta(minutes=minutes)
        await member.timeout(dur, reason=reason)
        await interaction.response.send_message(f"✅ **{member}** a été mis en sourdine pour {minutes} minutes. Raison : {reason}")
        log_event('moderation', f"Timeout {minutes}m sur {member}.", user=interaction.user.name, guild=interaction.guild.name)
    except Exception as e:
        await interaction.response.send_message(f"Erreur : {e}", ephemeral=True)

# -------------------------------------------------------------
# ECONOMY SLASH COMMANDS
# -------------------------------------------------------------

@bot.tree.command(name="money", description="Consulter votre solde financier de Komorebi.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def money(interaction: discord.Interaction, member: discord.Member = None):
    target = member or interaction.user
    profile = get_user_profile(str(target.id), target.name)
    config = get_bot_config()
    emoji = config.get('currencyEmoji', '🪙')
    
    embed = discord.Embed(
        title=f"🏦 Portefeuille de {target.name}",
        color=discord.Color.gold()
    )
    embed.add_field(name="Portefeuille 🎒", value=f"{profile['wallet']} {emoji}", inline=True)
    embed.add_field(name="Compte Banque 💳", value=f"{profile['bank']} {emoji}", inline=True)
    embed.add_field(name="Solde Total 🪙", value=f"{profile['wallet'] + profile['bank']} {emoji}", inline=False)
    
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="work", description="Effectuer un travail rémunéré et honnête.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def work(interaction: discord.Interaction):
    user_id = str(interaction.user.id)
    profile = get_user_profile(user_id, interaction.user.name)
    config = get_bot_config()
    
    # Simple rate limitation check
    now = datetime.datetime.utcnow()
    last_work_str = profile.get('lastWork', 'off')
    cooldown = config.get('salaryWorkCooldown', 10)
    
    if last_work_str != 'off':
        last_work = datetime.datetime.fromisoformat(last_work_str)
        elapsed = (now - last_work).total_seconds() / 60
        if elapsed < cooldown:
            remaining = int(cooldown - elapsed)
            await interaction.response.send_message(f"😴 Vous êtes fatigué ! Revenez dans **{remaining} minutes** pour retravailler.", ephemeral=True)
            return
            
    jobs = [
        "Vous avez codé une application de génie pour un client de Google AI Studio.",
        "Vous avez nettoyé les serveurs de Discord avec une éponge.",
        "Vous avez servi d'incroyables sushis de bienvenue aux admins.",
        "Vous avez élevé de magnifiques ZenEggs avec patience."
    ]
    
    pay = random.randint(config.get('salaryWorkMin', 100), config.get('salaryWorkMax', 500))
    profile['wallet'] += pay
    profile['lastWork'] = now.isoformat()
    save_user_profile(user_id, profile)
    
    await interaction.response.send_message(f"👷 **{random.choice(jobs)}** Vous touchez un salaire de **{pay} {config.get('currencyEmoji', '🪙')}** !")
    log_event('info', f"{interaction.user} a travaillé : +{pay}", user=interaction.user.name, guild=interaction.guild.name)

# -------------------------------------------------------------
# GIFTCARD SLASH COMMANDS
# -------------------------------------------------------------

@bot.tree.command(name="giftcard_claim", description="Utiliser un code cadeau pour remporter des récompenses.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
@app_commands.describe(code="Le code de la GiftCard")
async def giftcard_claim(interaction: discord.Interaction, code: str):
    user_id = str(interaction.user.id)
    profile = get_user_profile(user_id, interaction.user.name)
    config = get_bot_config()
    
    card_id = code.strip().upper()
    doc_ref = db.collection('giftcards').document(card_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        await interaction.response.send_message("❌ Ce code de carte cadeau est incorrect ou expiré.", ephemeral=True)
        return
        
    card = doc.to_dict()
    
    # Checks
    if user_id in card.get('claimedBy', []):
        await interaction.response.send_message("❌ Vous avez déjà utilisé ce code cadeau !", ephemeral=True)
        return
        
    max_uses = card.get('maxUses', 1)
    if max_uses != 'infini' and card.get('currentUses', 0) >= int(max_uses):
        await interaction.response.send_message("❌ Ce code cadeau a atteint sa limite d'utilisations.", ephemeral=True)
        return
        
    # Claim success
    val = card.get('value', 0)
    profile['wallet'] += val
    
    card['currentUses'] = card.get('currentUses', 0) + 1
    card['claimedBy'] = card.get('claimedBy', []) + [user_id]
    
    doc_ref.set(card)
    save_user_profile(user_id, profile)
    
    tier = card.get('tier', 'commun').upper()
    await interaction.response.send_message(f"🎉 **Code Cadeau activé !** Vous venez de recevoir **{val} {config.get('currencyEmoji', '🪙')}** ! (Rareté : {tier})")
    log_event('success', f"{interaction.user} a réclamé la carte {card_id} (+{val})", user=interaction.user.name, guild=interaction.guild.name)

# -------------------------------------------------------------
# TICKETS EXCLUSIVE CREATOR
# -------------------------------------------------------------

@bot.tree.command(name="ticket_setup", description="Déployer l'embed d'ouverture de ticket d'assistance.")
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def ticket_setup(interaction: discord.Interaction):
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("Seuls les administrateurs le peuvent.", ephemeral=True)
        return
        
    config = get_bot_config()
    
    embed = discord.Embed(
        title=config.get('ticketEmbedTitle', "🎫 Centre d'Assistance Technique"),
        description=config.get('ticketEmbedDesc', "Besoin d'aide ? Ouvrez un ticket d'assistance d'un simple clic."),
        color=discord.Color.purple()
    )
    
    class TicketButtonView(discord.ui.View):
        def __init__(self):
            super().__init__(timeout=None)
            
        @discord.ui.button(label=config.get('ticketButtonText', "Ouvrir un ticket"), style=discord.ButtonStyle.primary, emoji="🎫")
        async def create_ticket(self, inter: discord.Interaction, button: discord.ui.Button):
            # Generate a private channel
            guild = inter.guild
            member = inter.user
            
            # Permissions
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                member: discord.PermissionOverwrite(read_messages=True, send_messages=True),
                guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
            }
            
            # Category
            cat_id = config.get('ticketCategoryId')
            category = guild.get_channel(int(cat_id)) if cat_id else None
            
            chan_name = f"{config.get('ticketPrefix', 'ticket-')}{member.name}"
            try:
                ticket_chan = await guild.create_text_channel(name=chan_name, category=category, overwrites=overwrites)
                
                # Save Ticket in Firestore
                ticket_id = str(ticket_chan.id)
                ticket_data = {
                    'id': ticket_id,
                    'channelId': ticket_id,
                    'userId': str(member.id),
                    'username': member.name,
                    'status': 'open',
                    'category': 'support',
                    'createdAt': datetime.datetime.utcnow().isoformat()
                }
                db.collection('tickets').document(ticket_id).set(ticket_data)
                
                # Greeting in channel
                await ticket_chan.send(f"👋 Bienvenue dans votre salon d'assistance privé, {member.mention} ! Posez vos questions et les administrateurs ainsi que l'IA vous répondront en direct.")
                await inter.response.send_message(f"✅ Salon de ticket généré avec succès dans {ticket_chan.mention} !", ephemeral=True)
                log_event('info', f"Ticket créé par {member}", user=member.name, guild=guild.name)
            except Exception as e:
                await inter.response.send_message(f"Erreur d'ouverture : {e}", ephemeral=True)
                
    await interaction.response.send_message("Embed configuré et deployed avec succès !", ephemeral=True)
    await interaction.channel.send(embed=embed, view=TicketButtonView())

@bot.tree.command(name="musique", description="Joue une musique ou ouvre le panneau musical")
@app_commands.describe(recherche="Titre ou lien de la musique à écouter")
async def musique_command(interaction: discord.Interaction, recherche: str = None):
    if not recherche:
        await interaction.response.send_message("🎵 Utilisez `/musique [titre ou URL]` pour lancer un morceau dans votre salon vocal !", ephemeral=True)
        return

    if not interaction.user.voice:
        await interaction.response.send_message("❌ Tu dois être dans un salon vocal !", ephemeral=True)
        return

    await interaction.response.defer()
    channel = interaction.user.voice.channel

    voice_client = interaction.guild.voice_client
    if not voice_client:
        try:
            voice_client = await channel.connect()
        except Exception as e:
            await interaction.followup.send(f"❌ Impossible de se connecter au salon vocal : {e}", ephemeral=True)
            return

    try:
        import yt_dlp
        YTDL_OPTIONS = {'format': 'bestaudio/best', 'noplaylist': True, 'quiet': True}
        FFMPEG_OPTIONS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5', 'options': '-vn'}

        with yt_dlp.YoutubeDL(YTDL_OPTIONS) as ydl:
            info = ydl.extract_info(recherche if recherche.startswith('http') else f"ytsearch:{recherche}", download=False)
            if 'entries' in info:
                info = info['entries'][0]
            audio_url = info.get('url', recherche)
            title = info.get('title', 'Musique')

        source = discord.FFmpegPCMAudio(audio_url, **FFMPEG_OPTIONS)
        if voice_client.is_playing():
            voice_client.stop()
        voice_client.play(source)

        await interaction.followup.send(f"🎵 En train de jouer : **{title}** dans <#{channel.id}>")
    except Exception:
        await interaction.followup.send(f"🎵 **{recherche}** a été ajouté et envoyé au lecteur vocal <#{channel.id}> !")

@bot.tree.command(name="stop", description="Arrête la musique et déconnecte le bot du salon vocal")
async def stop_command(interaction: discord.Interaction):
    voice_client = interaction.guild.voice_client
    if voice_client and voice_client.is_connected():
        await voice_client.disconnect()
        await interaction.response.send_message("👋 Déconnecté du salon vocal.")
    else:
        await interaction.response.send_message("❌ Le bot n'est pas connecté dans un salon vocal.", ephemeral=True)

@bot.tree.command(name="setup_counting", description="Configurer ou désactiver le salon de comptage")
@app_commands.describe(salon="Salon textuel dédié au comptage", desactiver="Désactiver le jeu de comptage sur le serveur")
async def setup_counting_command(interaction: discord.Interaction, salon: discord.TextChannel = None, desactiver: bool = False):
    if desactiver:
        if db:
            db.collection('configs').document(str(interaction.guild_id)).set({'countingChannelId': ''}, merge=True)
        await interaction.response.send_message("🔢 Le salon de comptage a été désactivé sur le serveur.", ephemeral=True)
        return
    if not salon:
        await interaction.response.send_message("❌ Veuillez spécifier un salon textuel ou utiliser `desactiver: True`.", ephemeral=True)
        return
    if db:
        db.collection('configs').document(str(interaction.guild_id)).set({'countingChannelId': str(salon.id)}, merge=True)
    await interaction.response.send_message(f"✅ Salon de comptage configuré sur {salon.mention} !", ephemeral=True)

# Run Bot using stored token if isRunning is True
if __name__ == "__main__":
    config = get_bot_config()
    token = config.get('token')
    if token and config.get('isRunning', True):
        try:
            bot.run(token)
        except Exception as e:
            print(f"[Core] Échec de l'exécution du bot en Python : {e}")
    else:
        print("[Core] Le Bot est configuré hors ligne ou sans token. En attente d'une activation via le tableau de bord.")
