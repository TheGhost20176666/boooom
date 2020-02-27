// © 2019 Fraffel Media. MultiBot is created by FAXES (FAXES#8655). View the license!
const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    message.delete();
    return message.channel.send(`:ping_pong: Pong! Latency is: **${new Date().getTime() - message.createdTimestamp}ms**`).then(msg => msg.delete(5000));
}

module.exports.help = {
    name: "ping"
}