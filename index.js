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

// API Express para Tampermonkey
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/get-commands', (req, res) => {
  const toSend = [...commandQueue];
  commandQueue.length = 0;
  res.json(toSend);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 API Express corriendo');
});

client.login(process.env.BOT_TOKEN);
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

// API Express para Tampermonkey
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/get-commands', (req, res) => {
  const toSend = [...commandQueue];
  commandQueue.length = 0;
  res.json(toSend);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 API Express corriendo');
});

client.login(process.env.BOT_TOKEN);
