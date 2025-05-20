require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
let commandQueue = [];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!cmd ')) {
    const commandText = message.content.slice(5).trim();
    commandQueue.push({ command: commandText, timestamp: Date.now() });
    message.reply(`✅ Comando recibido: \`${commandText}\``);
  }

  if (message.content === '!comandos') {
    const helpText = `Comandos disponibles:\n- \`scroll\`\n- \`alerta\`\n- \`recargar\``;
    message.reply(helpText);
  }
});

app.get('/get-commands', (req, res) => {
  const toSend = [...commandQueue];
  commandQueue = [];
  res.json(toSend);
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

client.login(process.env.BOT_TOKEN);
