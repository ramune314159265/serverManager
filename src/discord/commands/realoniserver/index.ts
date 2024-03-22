import {
	ApplicationCommandOptionType,
	CommandInteraction
} from 'discord.js'

export default {
	data: {
		name: "rsvr",
		description: "リアル鬼ごっこサバイバルサーバーの管理が出来ます",
		options: [
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "count",
				description: "物資の数を返信します(チャンクが読み込まれている範囲のみ)",
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "add",
				description: "物資の数を追加します(プレイヤーがサーバーに入っている方が物資が宙に浮く可能性が低いです)",
				options: [{
					type: ApplicationCommandOptionType.Integer,
					name: "resourcecount",
					description: "入力した数字だけ物資を追加します",
					required: true
				}],
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "start",
				description: "サーバーを起動します",
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "stop",
				description: "サーバーを停止します",
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "exec",
				description: "サーバーコマンドを実行します",
				options: [{
					type: ApplicationCommandOptionType.String,
					name: "execcommand",
					description: "入力したコマンドを実行します(先頭の / はなしで)",
					required: true
				}],
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "list",
				description: "サーバーに居るプレイヤーを返します",
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: "seed",
				description: "Seed値を返します。またバイオームファインダーのURLも返します",
			},
		]
	},
	async execute(interaction: CommandInteraction) {
		interaction.reply('test')
	}
}
