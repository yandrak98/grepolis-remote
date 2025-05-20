const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra la lista de comandos disponibles'),

  async execute(interaction) {
    await interaction.reply(`🛠️ Comandos disponibles:
/invite - Invita a un jugador a una alianza
/registrar - Añade jugadores o alianzas válidas
/help - Muestra esta lista`);
  }
};
