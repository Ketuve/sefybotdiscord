const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
    .then(res => res.json())
    .then(json => message.reply(json.text))
    .catch(err => {
        message.channel.send("i can't seem to be able to give you a fact :( here is a hug for now 🤗");
        return console.error(err);
    });
},

exports.help = {
	name: "fact",
	description: "Gives you a fun, random fact.",
	usage: "fact",
	example: "fact"
};
  
exports.conf = {
	aliases: ["funfact"],
	cooldown: 3
};