const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    const num = Math.floor(Math.random() * 100000);
    const embed = new Discord.MessageEmbed().setColor('#DAF7A6').setTimestamp(new Date()).setDescription(`powered by bell's homework folder`).setTitle("i created this..").setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true })).setImage(`https://www.thiswaifudoesnotexist.net/example-${num}.jpg`)
    message.channel.send(embed)
}



exports.help = {
	name: "freepfp",
	description: "base on bell's *homework* folder, i will generate a pfp for you 😂\n*no clickbait*",
	usage: "freepfp",
	example: "freepfp"
};
  
exports.conf = {
	aliases: [],
	cooldown: 4
};
