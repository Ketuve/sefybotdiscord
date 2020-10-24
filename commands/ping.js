module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    cooldown: 2,
    guildOnly: true,
    execute(message, args){
        message.channel.send('pong!');
    }
}