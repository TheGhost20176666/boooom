// REMOVING OR EDITING THIS FILE IS A BREACH OF THE LICENSE. LEAVE IT AS IS AND DON'T DISABLE IT! [START NO EDIT]
// © 2019 Fraffel Media. MultiBot is created by FAXES (FAXES#8655). View the license!
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {
    message.delete();
    let botembed = new Discord.RichEmbed()
    .setDescription("Faxes MultiBot Information")
    .setColor(botconfig["bot_setup"].main_embed_color)
    .setThumbnail("")
    .addField("Bot Name", `${bot.user.username} / Original Name: MultiBot`)
    .addField("Servers", bot.guilds.size)
    .addField("Credits", `This bot is made by FAXES#86552`)
    .addField("Information", `This bot (MultiBot) was created by Fraffel Media and is a packaged bot which you can obtain via the Fraffel Media Discord. This bot comes with a license which is agreed to by the product purchaser. \discord.gg`);

    message.channel.send(botembed).then(msg => msg.delete(60000));
}

module.exports.help = {
    name: "botcredits",
    name2: "credits",
    name3: "multibot"
}
// REMOVING OR EDITING THIS FILE IS A BREACH OF THE LICENSE. LEAVE IT AS IS AND DON'T DISABLE IT! [END NO EDIT]