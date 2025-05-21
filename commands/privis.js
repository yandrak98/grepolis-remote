const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('privis')
    .setDescription('Actualiza los privilegios de las alianzas.')
    .addStringOption(option =>
      option.setName('alianza')
        .setDescription('Nombre de la alianza')
        .setRequired(true)
        .setAutocomplete(true)),

  async execute(interaction, context) {
    const alianza = interaction.options.getString('alianza');
    const validAlliances = context.validAlliances;

    if (!validAlliances.has(alianza.toLowerCase())) {
      return interaction.reply({ content: `❌ Alianza no autorizada: "${alianza}"`, ephemeral: true });
    }

    context.pushCommandToFirebase({
      command: 'privis',
      args: [alianza]
    });
    await interaction.reply(`✅ Comando registrado para modificar privilegios en "${alianza}"`);
  }
};
