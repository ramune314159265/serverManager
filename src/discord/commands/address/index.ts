import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { discordBotConfig } from '../../../config/discord'

export default {
	data: {
		name: "address",
		description: "サーバーのアドレスを確認します",
	},
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true })
		const ip = await (await fetch('https://ipinfo.io/ip')).text()
		const embed = new EmbedBuilder()
			.setTitle('サーバーアドレス')
			.setAuthor({ name: 'ラムネサーバー' })
			.setDescription('入れない時は2,3種類のうちの別のアドレスを試してみてください')
			.setColor('#58b058')
			.addFields(
				{ name: '統合版', value: `アドレス(address): \`${ip}\` ポート: \`19132\`\n\nアドレス(address): \`${discordBotConfig.addresses.serverAddress1}\` ポート: \`19132\`` },
				{ name: 'JAVA版', value: `\`${discordBotConfig.addresses.serverAddress1}\`\n\n\`${ip}\`\n\n\`${discordBotConfig.addresses.serverAddress2}\`` },
				{ name: 'サバイバルサーバーマップ', value: `https://${discordBotConfig.addresses.serverAddress1}/map/` },
				{ name: 'データパックサーバーマップ', value: `https://${discordBotConfig.addresses.serverAddress1}/` },
			)
		await interaction.editReply({ embeds: [embed] })
	}
}
