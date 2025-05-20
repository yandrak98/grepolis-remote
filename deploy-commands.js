const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);


(async () => {
  try {
    console.log('🔁 Actualizando slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: [] }
);
    console.log('✅ Comandos registrados correctamente.');
  } catch (error) {
    console.error(error);
  }
})();
