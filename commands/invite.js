const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invita a un jugador a una alianza')
    .addStringOption(option =>
      option.setName('jugador')
        .setDescription('Nombre del jugador')
        .setRequired(true)
        .setAutocomplete(true))
    .addStringOption(option =>
      option.setName('alianza')
        .setDescription('Nombre de la alianza')
        .setRequired(true)
        .setAutocomplete(true)),

  async execute(interaction, context) {
    const jugador = interaction.options.getString('jugador');
    const alianza = interaction.options.getString('alianza');

    const validPlayers = context.validPlayers;
    const validAlliances = context.validAlliances;
    const commandQueue = context.commandQueue;

    if (!validPlayers.has(jugador.toLowerCase())) {
      return interaction.reply({ content: `❌ Jugador no autorizado: "${jugador}"`, ephemeral: true });
    }

    if (!validAlliances.has(alianza.toLowerCase())) {
      return interaction.reply({ content: `❌ Alianza no autorizada: "${alianza}"`, ephemeral: true });
    }


    context.pushCommandToFirebase({
      command: 'invite',
      args: [jugador, alianza],
    });

    return interaction.reply(`✅ Comando registrado para invitar a ${jugador} en "${alianza}"`);
  }
};
