
exports.run = async (client, message, args) => {
	message.channel.send('boop.');
	
};



exports.help = {
  name: "beep",
  description: "extremely self-explanatory",
  usage: `beep`,
  example: `beep`
}

exports.conf = {
  aliases: [],
  cooldown: 2
}
