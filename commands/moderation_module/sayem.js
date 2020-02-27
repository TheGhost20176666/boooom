// © 2019 Fraffel Media. MultiBot is created by FAXES (FAXES#8655). View the license!
const Discord = require("discord.js")
const botconfig = require("../../botconfig.json");

module.exports.run = async (bot, message, args) => {
message.delete();
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Invalid permissions.").then(msg => msg.delete(10000));
    let botmessage = args.join(" ");
        let sayEmbed = new Discord.RichEmbed()
        .setAuthor(`Notification From Paradise City`, `https://images-ext-1.discordapp.net/external/KSr_NwKEwDL066cnrwiZTTEwVwobrKTMXFuTM4P4bPI/%3Fwidth%3D270%26height%3D270/https/media.discordapp.net/attachments/615311030599417866/652933263681257483/512x512.png`)
        .setColor(botconfig["bot_setup"].main_embed_color)
        .setDescription(`${botmessage}.`)
        .setTimestamp()
        .setFooter(``)
        
        try{
            
            message.channel.send(sayEmbed);
            
            return
        }catch(e){
            // console.log(e.stack);
            console.log('\x1b[33m%s\x1b[0m', "Say Embed Error Occurred. Crash Prevented.");
            return
        }
}


module.exports.help = {
    name: "sayem"
}