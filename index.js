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

  // Comando help
  if (message.content === '!help') {
    const helpText = `🛠️ Comandos disponibles:
- \`!invite "nombreJugador" "alianza"\`: Envía una invitación al jugador especificado.
- \`!help\`: Muestra esta lista de comandos.`;
    return message.reply(helpText);
  }

  // Comando invite con argumentos entre comillas
  if (message.content.startsWith('!invite ')) {
    const regex = /^!invite\s+"([^"]+)"\s+"([^"]+)"$/;
    const match = message.content.match(regex);

    if (!match) {
      return message.reply('❌ Formato incorrecto. Usa: `!invite "nombreJugador" "alianza"`');
    }

    const [, nombreJugador, alianza] = match;
    commandQueue.push({
      command: "invite",
      args: [nombreJugador, alianza],
      timestamp: Date.now()
    });

    return message.reply(`✅ Invitación registrada: ${nombreJugador} a la alianza "${alianza}"`);
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
