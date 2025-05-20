const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registrar')
    .setDescription('Registra jugadores o alianzas válidas')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('¿Qué deseas registrar?')
        .setRequired(true)
        .addChoices(
          { name: 'jugadores', value: 'jugadores' },
          { name: 'alianzas', value: 'alianzas' }
        ))
    .addStringOption(option =>
      option.setName('valores')
        .setDescription('Lista separada por comas (ej: Juanito,Pedro)')
        .setRequired(true)),

  async execute(interaction, context) {
    const tipo = interaction.options.getString('tipo');
    const valores = interaction.options.getString('valores').split(',').map(v => v.trim());

    if (tipo === 'jugadores') {
      valores.forEach(v => context.validPlayers.add(v.toLowerCase()));
    } else {
      valores.forEach(v => context.validAlliances.add(v.toLowerCase()));
    }

    context.saveDataToFirebase();

    return interaction.reply(`✅ ${tipo} registrados: ${valores.join(', ')}`);
  }
};
