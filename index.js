const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Estado compartido
const commandQueue = [];
const validPlayers = new Set();
const validAlliances = new Set();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Slash command
client.once('ready', () => {
  console.log(`🤖 Bot listo como ${client.user.tag}`);
  loadDataFromFirebase();
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, { commandQueue, validPlayers, validAlliances });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Ocurrió un error ejecutando el comando.', ephemeral: true });
    }
  }

  // Autocomplete
  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);
    let choices = [];

    if (focused.name === 'jugador') {
      choices = Array.from(validPlayers);
    } else if (focused.name === 'alianza') {
      choices = Array.from(validAlliances);
    }

    const filtered = choices.filter(choice =>
      choice.toLowerCase().includes(focused.value.toLowerCase())
    );

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })).slice(0, 25)
    );
  }
});


//Firebase
const axios = require('axios');

async function loadDataFromFirebase() {
  try {
    const res = await axios.get(`${process.env.FIREBASE_URL}/grepolis.json`);
    const data = res.data || {};
    validPlayers = new Set(data.players || []);
    validAlliances = new Set(data.alliances || []);
    console.log("✅ Datos cargados desde Firebase");
  } catch (err) {
    console.error("❌ Error al cargar desde Firebase:", err);
  }
}

async function saveDataToFirebase() {
  const data = {
    players: Array.from(validPlayers),
    alliances: Array.from(validAlliances)
  };

  try {
    await axios.put(`${process.env.FIREBASE_URL}/grepolis.json`, data);
    console.log("💾 Datos guardados en Firebase");
  } catch (err) {
    console.error("❌ Error guardando en Firebase:", err);
  }
}





// API Express para Tampermonkey
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/get-commands', (req, res) => {
  const toSend = [...commandQueue];
  commandQueue.length = 0;
  res.json(toSend);
});

app.post('/report-status', async (req, res) => {
  const { message, player, status } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Falta el campo "message"' });
  }

  const fullMessage = `📢 **Reporte de Tampermonkey**
👤 **Jugador**: ${player || 'Desconocido'}
📋 **Estado**: ${status || 'Sin estado'}
📝 **Mensaje**: ${message}`;

  try {
    const channel = await client.channels.fetch(process.env.REPORT_CHANNEL_ID);
    await channel.send(fullMessage);
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("❌ Error enviando al canal:", e);
    res.status(500).json({ error: 'Error enviando al canal' });
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 API Express corriendo');
});

client.login(process.env.BOT_TOKEN);
