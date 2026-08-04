import os
import asyncio
import discord
from discord import app_commands
from discord.ext import commands

# ==============================================================================
# CONFIGURATION ET INITIALISATION DU BOT DISCORD (discord.py v2.4+)
# ==============================================================================

# 1. Configuration des Intents de base
intents = discord.Intents.default()
intents.message_content = True  # Nécessaire si vous traitez aussi des messages texte

# 2. Initialisation du bot avec commands.Bot
bot = commands.Bot(command_prefix="!", intents=intents)


# ==============================================================================
# COMMANDES SLASH AVEC EXÉCUTION UNIVERSELLE (USER INSTALL & CONTEXTES ÉTENDUS)
# ==============================================================================

# Exemple 1 : Commande d'information /profil utilisable partout (Serveurs, MP, Salons Privés)
@bot.tree.command(
    name="profil",
    description="Affiche des informations sur l'utilisateur, utilisable n'importe où sur Discord !"
)
@app_commands.allowed_installs(guilds=True, users=True)  # Installez sur votre compte ou sur des serveurs
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)  # Exécutez en MP, Groupe, Serveurs
async def profil(interaction: discord.Interaction, membre: discord.User = None):
    target = membre or interaction.user
    
    embed = discord.Embed(
        title=f"👤 Profil de {target.name}",
        color=discord.Color.blurple()
    )
    embed.set_thumbnail(url=target.display_avatar.url)
    embed.add_field(name="ID Utilisateur", value=f"`{target.id}`", inline=True)
    embed.add_field(name="Nom complet", value=f"{target.global_name or target.name}", inline=True)
    embed.set_footer(text="Commande Application User-Install • Komorebi Bot")
    
    await interaction.response.send_message(embed=embed, ephemeral=True)


# Exemple 2 : Commande de calcul /calculatrice utilisable en message privé ou groupe
@bot.tree.command(
    name="calcul",
    description="Effectue une opération mathématique rapide (Ex: 12 + 8)."
)
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
@app_commands.describe(expression="L'expression mathématique à évaluer (ex: 25 * 4)")
async def calcul(interaction: discord.Interaction, expression: str):
    try:
        # Sécurisation minimale de l'évaluation
        allowed_chars = "0123456789+-*/(). "
        if not all(char in allowed_chars for char in expression):
            await interaction.response.send_message("❌ Caractères non autorisés dans l'expression mathématique.", ephemeral=True)
            return
            
        resultat = eval(expression, {"__builtins__": None}, {})
        await interaction.response.send_message(f"🔢 **Résultat :** `{expression}` = **{resultat}**", ephemeral=False)
    except Exception as e:
        await interaction.response.send_message(f"❌ Erreur de calcul : `{e}`", ephemeral=True)


# Exemple 3 : Commande /ping de test de latence
@bot.tree.command(
    name="ping",
    description="Vérifie la latence du bot Discord."
)
@app_commands.allowed_installs(guilds=True, users=True)
@app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
async def ping(interaction: discord.Interaction):
    latency_ms = round(bot.latency * 1000)
    await interaction.response.send_message(f"🏓 **Pong !** Latence actuelle : `{latency_ms}ms`", ephemeral=True)


# ==============================================================================
# ÉVÉNEMENTS DU BOT & SYNCHRONISATION DES COMMANDES SLASH (tree.sync())
# ==============================================================================

@bot.event
async def on_ready():
    print(f"✅ Connecté avec succès en tant que {bot.user} (ID: {bot.user.id})")
    
    try:
        # Synchronisation globale de l'arbre de commandes avec l'API Discord
        print("⚡ Synchronisation globale des commandes Slash en cours...")
        synced_commands = await bot.tree.sync()
        print(f"🎉 Synchronisation réussie ! {len(synced_commands)} commande(s) globale(s) enregistrée(s).")
    except Exception as e:
        print(f"❌ Erreur lors de la synchronisation des commandes : {e}")

    # Statut du bot
    activity = discord.Activity(type=discord.ActivityType.listening, name="vos commandes partout sur Discord")
    await bot.change_presence(activity=activity, status=discord.Status.online)


# ==============================================================================
# POINT D'ENTRÉE & EXÉCUTION
# ==============================================================================

if __name__ == "__main__":
    # Récupération du Token depuis les variables d'environnement ou direct
    TOKEN = os.getenv("DISCORD_TOKEN", "VOTRE_TOKEN_DISCORD_ICI")
    
    if TOKEN and TOKEN != "VOTRE_TOKEN_DISCORD_ICI":
        bot.run(TOKEN)
    else:
        print("⚠️ Veuillez renseigner un TOKEN Discord valide dans la variable d'environnement DISCORD_TOKEN.")
