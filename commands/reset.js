const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reinicia las cuentas en caso de fallo.'),

  async execute(interaction) {
        // Envía la solicitud al webhook
    const webhookURL = 'https://hook.pablaken.com/hooks/restart'; // Reemplaza con tu URL real

    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'El comando /reset fue ejecutado desde Discord.',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        await interaction.reply(`❌ Hubo un error al intentar reiniciar las cuentas.`);
        console.error(`Error al enviar webhook: ${response.statusText}`);
      }
      await interaction.reply(`✅ Reinicio ejecutado correctamente.`);
    } catch (error) {
      await interaction.reply(`❌ Hubo un error al intentar reiniciar las cuentas.`);
      console.error('Error al hacer la solicitud al webhook:', error);
    }
  }
};
