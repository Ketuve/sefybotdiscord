exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('you don\'t have the \`MANAGE_GUILD\` permission to use this command 😔').then(m => m.delete({timeout: 5000}));

    if (!args[0] || !args[1]) return message.reply("incorrect usage bruh, it's \`<#channel | id> <role name || id>\`").then(m => m.delete({ timeout: 5000 }))

    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return message.reply('i can\'t find that channel. pls mention a channel within this guild 😔').then(m => m.delete({timeout: 5000}));
    const roleName = message.guild.roles.cache.find(r => (r.name === args[1].toString()) || (r.id === args[1].toString().replace(/[^\w\s]/gi, '')));
    if (!roleName) return message.reply('p l e a s e provide a vaild role for me to add pls').then(m => m.delete({ timeout: 5000 }));



    await client.dbguilds.findOneAndUpdate({
        guildID: message.guild.id,
    },
    {
        verifyChannelID: channel.id,
        verifyRole: roleName.id
    })
    .catch(err => console.error(err));
    message.channel.send({embed: {color: "f3f3f3", description: `☑️ the verify channel has been set to ${channel}! with the verify role \`${roleName.name}\``}});

}
        
exports.help = {
	name: "setverify",
	description: "Set the verify channel where i *verify* people",
	usage: "setverify <#channel | id> <role name || id>",
	example: "setverify #verify Verify role"
};
  
exports.conf = {
	aliases: ["svr"],
	cooldown: 5
};
  
