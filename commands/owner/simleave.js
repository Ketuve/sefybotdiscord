exports.run = async (client, message, args) => {
	if (!client.config.owners.includes(message.author.id)) return message.message.reply('only coco or bell can execute this command!');
	const member = message.guild.members.cache.get(args[0]) || message.member;
    client.emit('guildMemberRemove', member);
}
exports.help = {
	name: "simleave",
	description: "Simulates a leave",
	usage: "simleave",
	example: "simleave"
};
  
exports.conf = {
	aliases: [],
	cooldown: 2,
	guildOnly: true,
	userPerms: [],
	clientPerms: []
};