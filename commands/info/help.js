const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  const setting = await client.dbguilds.findOne({
    guildID: message.guild.id
  });

  const prefix = setting.prefix;
  
  if (!args[0]) {
    // This will turn the folder (category) into array.
    let module = client.helps.array();
    
    // This will hide a folder from display that includes "hide: true" in their module.json
    if (!client.config.owners.includes(message.author.id)) module = client.helps.array().filter(x => !x.hide);
    const embed = new Discord.MessageEmbed()
    .setColor('#DAF7A6')
    .setTimestamp(new Date())
    .setDescription(`use \`${prefix}help [command]\` to get more specific information about a command 😄`)
    .setTitle("hey, how can i help?")
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    
    for (const mod of module) {
      // You can change the .join(" | ") to commas, dots or every symbol.
      embed.addField(`${mod.name}`, mod.cmds.map(x => `\`${x}\``).join(" | "));
    }
    
    return message.channel.send(embed);
  } else {
    let cmd = args[0];
    
    // If the user type the [command], also with the aliases.
    if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
      let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      let name = command.help.name; // The command name.
      let desc = command.help.description; // The command description.
      let cooldown = command.conf.cooldown + " second(s)"; // The command cooldown.
      let aliases = command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "no aliases provided.";
      let usage = command.help.usage ? command.help.usage : "no usage provided.";
      let example = command.help.example ? command.help.example : "no example provided.";
      
      let embed = new Discord.MessageEmbed()
      .setColor('#DAF7A6')
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setTitle(`${prefix}${name}`)
      .setDescription(desc)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter("[] optional, <> required. don't includes these things while typing a command.")
      .addField("cooldown", cooldown)
      .addField("aliases", aliases, true)
      .addField("usage", usage, true)
      .addField("example", example, true)
      .setImage('https://i.imgur.com/nq0IYHX.png')
      
      return message.channel.send(embed);
    } else {
      // If the user type the wrong command.
      return message.channel.send({embed: {color: "RED", description: "Unknown command."}});
    }
  }
}

exports.help = {
  name: "help",
  description: "show my command list with its description and usage",
  usage: "help [command]",
  example: "help verify"
}

exports.conf = {
  aliases: ["?"],
  cooldown: 5
}
