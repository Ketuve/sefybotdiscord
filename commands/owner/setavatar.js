const { MessageCollector } = require('discord.js')
exports.run = async (client, message, args) => {
    if (!client.config.owners.includes(message.author.id)) return message.message.reply('only coco or bell can execute this command!');
    const yes = "y";
    let attachments = message.attachments.array()
    if (attachments.length === 0) return message.reply("please upload some images!");
    message.reply('this action is irreversible :( do you want to continue? \`y/n\`')

    const collector = new MessageCollector(message.channel, msg => {
        if (!msg.author.bot) return true;
    }, { time: 15000 });

    collector.on('collect', async msg => {

        try {
            if (yes.includes(msg.content.trim().toLowerCase())) {
                await client.user.setAvatar(attachments[0].url)
                await collector.stop()
                return message.channel.send(`my avatar has been changed to ${attachments[0].url}`);
            } else {
                return message.channel.send('gotcha.')
            }
        } catch (error) {
            message.channel.send('i couldn\'t set my avatar with that image. can you check the image format?')
        }
    });
}

exports.help = {
	name: "setavatar",
	description: "change the way i look. 😔",
	usage: "setavatar `<image attachment>`",
	example: "setavatar `<insert random image here>`"
};
  
exports.conf = {
	aliases: [],
    cooldown: 2,
    guildOnly: true,
    userPerms: [],
	clientPerms: ["SEND_MESSAGES"]
};
  
