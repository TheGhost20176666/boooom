// REMOVING OR EDITING THIS FILE IS A BREACH OF THE LICENSE. LEAVE IT AS IS AND DON'T DISABLE IT! [START NO EDIT]
// © 2019 Fraffel Media. MultiBot is created by FAXES (FAXES#8655). View the license!
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

// Bot startup
console.log("Setting up Infinity MultiBot. this might take a few seconds!")
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Could not folder commands.");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        if(botconfig["bot_setup"].debug_mode) {
            console.log(`${f} loaded!`);
        }
        bot.commands.set(props.help.name, props);
        bot.commands.set(props.help.name2, props);
        bot.commands.set(props.help.name3, props);
    });
});

if(botconfig["module_toggles"].ticket_system) {
    fs.readdir("./commands/ticket_system/", (err, files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0){
            console.log('\x1b[31m%s\x1b[0m', "Could not folder ticket_system.");
            return;
        }

        jsfile.forEach((f, i) =>{
            let props = require(`./commands/ticket_system/${f}`);
            if(botconfig["bot_setup"].debug_mode) {
                console.log(`${f} loaded!`);
            }
            bot.commands.set(props.help.name, props);
        });
        console.log('\x1b[36m%s\x1b[0m', "- Ticket Module Loaded!")
    });
}

if(botconfig["module_toggles"].utility_commands) {
    fs.readdir("./commands/utility_module/", (err, files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0){
            console.log('\x1b[31m%s\x1b[0m', "Could not folder utility_module.");
            return;
        }

        jsfile.forEach((f, i) =>{
            let props = require(`./commands/utility_module/${f}`);
            if(botconfig["bot_setup"].debug_mode) {
                console.log(`${f} loaded!`);
            }
            bot.commands.set(props.help.name, props);
        });
        console.log('\x1b[36m%s\x1b[0m', "- Utility Module Loaded!")
    });
}

if(botconfig["module_toggles"].moderation_commands) {
    fs.readdir("./commands/moderation_module/", (err, files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0){
            console.log('\x1b[31m%s\x1b[0m', "Could not folder moderation_module.");
            return;
        }

        jsfile.forEach((f, i) =>{
            let props = require(`./commands/moderation_module/${f}`);
            if(botconfig["bot_setup"].debug_mode) {
                console.log(`${f} loaded!`);
            }
            bot.commands.set(props.help.name, props);
            bot.commands.set(props.help.name2, props);
        });
        console.log('\x1b[36m%s\x1b[0m', "- Moderation Module Loaded!")
    });
}

if(botconfig["module_toggles"].fun_commands) {
    fs.readdir("./commands/fun_module/", (err, files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0){
            console.log('\x1b[31m%s\x1b[0m', "Could not folder fun_module.");
            return;
        }

        jsfile.forEach((f, i) =>{
            let props = require(`./commands/fun_module/${f}`);
            if(botconfig["bot_setup"].debug_mode) {
                console.log(`${f} loaded!`);
            }
            bot.commands.set(props.help.name, props);
            bot.commands.set(props.help.name2, props);
        });
        console.log('\x1b[36m%s\x1b[0m', "- Fun Module Loaded!")
    });
}

bot.on('error', console.error);
bot.on("ready", async () => {
    console.log('\x1b[32m%s\x1b[0m', `Infinity MultiBot is online and set up! I'm on ${bot.guilds.size} servers.`);
    bot.user.setActivity(botconfig["bot_setup"].bot_game, {type: botconfig["bot_setup"].bot_game_type});
    bot.user.setStatus(botconfig["bot_setup"].bot_status)

    // DO NOT EDIT THE BELOW, THIS IS FOR PERFORMANCE AND STATISTICS. EDITING THIS IS A VIOLATION OF LICENSE [START NO EDIT]
    var express = require('express');
    var app = express();
    let webHookUrl = "https://hooks.zapier.com/hooks/catch/4795191/vi5vc8/"
    let webHookData = `{
        name: "Alex H.",
        purchaseID: "FMMB008",
        mod_module: botconfig["module_toggles"].moderation_commands.toString(),
        utility_module: botconfig["module_toggles"].utility_commands.toString(),
        log_module: botconfig["module_toggles"].logs.toString(),
        mod_log_module: botconfig["module_toggles"].mod_logs.toString(),
        ticket_module: botconfig["module_toggles"].ticket_system.toString(),
        Filter_module: botconfig["module_toggles"].filter_lang_links.toString(),
        bot_prefix: botconfig["bot_setup"].prefix.toString(),
        debug_mode: botconfig["bot_setup"].debug_mode.toString()
    }`
    app.post(webHookUrl, function(req, res) {
        req.type('json');
        req.json(webHookData);
        req.end();
    });
    console.log(`Performance & Statistics Check Made. Status: Complete`)
    // [END NO EDIT]
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig["bot_setup"].prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

    // Bot Command Logs
    if(botconfig["module_toggles"].mod_logs) {
        const cmdChannel = message.guild.channels.find(channel => channel.id === botconfig["channel_setup"].command_logs_channel);
        if(!cmdChannel) return console.log("Channel not found (Config: 'commands_logs_channel')");
        const logEmbed = new Discord.RichEmbed()
        .setAuthor("Command Logs")
        .setColor(botconfig["bot_setup"].main_embed_color)
        .setDescription(`**${message.author} (${message.author.tag})** used command: \n\`\`\`css\n${cmd} ${args}\`\`\``.split(',').join(' '))
        .setTimestamp()
        cmdChannel.send(logEmbed)
    }
});


// Welcome message
bot.on('guildMemberAdd', member => {
    if(botconfig["module_toggles"].join_role) {
        var role = member.guild.roles.find(role => role.id === botconfig["join_roles"].role);
        if (!role) return console.log("role not found (Config: 'role')");
        member.addRole(role);
    }
    if(botconfig["module_toggles"].welcome_leave_channel) {
        const channel = member.guild.channels.find(channel => channel.id === botconfig["channel_setup"].welcome_channel);
        if (!channel) return console.log("join channel not found (Config: 'welcome_channel')");
        channel.send(`${member} (${member.user.tag}) **Joined**`);
    }
    // Member count channel update
    if(botconfig["module_toggles"].member_count_channel) {
        member.guild.channels.find(channel => channel.id === botconfig["member_count_module"].member_count_channel).setName(`Member Count: ${member.guild.memberCount}`);
    }
});

// Leave Message
bot.on('guildMemberRemove', member => {
    if(botconfig["module_toggles"].welcome_leave_channel) {
        const channel = member.guild.channels.find(channel => channel.id === botconfig["channel_setup"].welcome_channel);
        if (!channel) return console.log("leave channel not found (Config: 'welcome_channel')");
        channel.send(`${member} (${member.user.tag}) **Left**`);
    }
    // Member count channel update
    if(botconfig["module_toggles"].member_count_channel) {
        member.guild.channels.find(channel => channel.id === botconfig["member_count_module"].member_count_channel).setName(`Member Count: ${member.guild.memberCount}`);
    }
});

// Message Delete Logger
bot.on("messageDelete", message => {
    if(botconfig["module_toggles"].logs) {
        if (message.channel.type === 'dm') return;
        if (message.content.startsWith("!")) return undefined;
        if (message.content.startsWith(".")) return undefined;
        if (message.content.startsWith("?")) return undefined;
        if (message.content.startsWith("-")) return undefined;
        if (message.author.bot) return undefined;
        if (message.content.length > 1020) return undefined;

        let logEmbed = new Discord.RichEmbed()
        .setAuthor("Action Logs", bot.user.avatar_url)
        .setColor(botconfig["bot_setup"].main_embed_color)
        .setTimestamp()
        .setFooter(`${botconfig["bot_setup"].copyright} | Made by FAXES#8655`)

        .setDescription("**Action:** Message Delete")
        .addField("Message Author:", `${message.author.toString()} - Hash: ${message.author.tag} - ID: ${message.author.id}`)
        .addField("Channel:", message.channel)
        .addField("Message Content:", `${message.content}.`)

        let logChannel = message.guild.channels.find(channel => channel.id === botconfig["channel_setup"].general_logs_channel);
        if (!logChannel) return console.log("leave channel not found (Config: 'general_logs_channel')");
        logChannel.send(logEmbed);
    }
});

// Message Edit Logger
bot.on("messageUpdate", (oldMessage, newMessage) => {
    if(botconfig["module_toggles"].logs) {
        if (oldMessage.author.bot) return undefined;
        if (oldMessage.content.length > 1020) return undefined;
        if (newMessage.content.length > 1020) return undefined;
        if (!oldMessage.guild) return undefined;

        let logEmbed = new Discord.RichEmbed()
        .setAuthor("Action Logs", bot.user.avatar_url)
        .setColor(botconfig["bot_setup"].main_embed_color)
        .setTimestamp()
        .setFooter(`${botconfig["bot_setup"].copyright} | Made by FAXES#8655`)

        .setDescription("**Action:** Message Edited")
        .addField("Old Content", `${oldMessage.content}.`)
        .addField("New Content", `${newMessage.content}.`)
        .addField("Message Author:", `${newMessage.author.toString()} - Hash: ${newMessage.author.tag} - ID: ${newMessage.author.id}`)
        .addField("Channel", oldMessage.channel)

        let logChannel = newMessage.guild.channels.find(channel => channel.id === botconfig["channel_setup"].general_logs_channel);
        if (!logChannel) return console.log("leave channel not found (Config: 'general_logs_channel')");
        logChannel.send(logEmbed);
    }
});

// Member Update Logger
bot.on("guildMemberUpdate", async (oldMember, newMember) => {
    setTimeout(async () => {
        var Change = {
            rolesGiven: {
                update: false,
                updateArray: ""
            },
            rolesRemoved: {
                update: false,
                updateArray: ""
            },
            nickname: {
                update: false,
                updateArray: []
            }
        };

        const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' }).then(audit => audit.entries.first())

        oldMember.roles.forEach(function(rInfo) {
            if (newMember.roles.find(roles => roles.id == rInfo.id) == null)
            {
                Change.rolesRemoved.updateArray = rInfo.id;
                Change.rolesRemoved.update = true;
            }
        });

        newMember.roles.forEach(function(rInfo) {
            if (oldMember.roles.find(roles => roles.id == rInfo.id) == null)
            {
                Change.rolesGiven.updateArray = rInfo.id;
                Change.rolesGiven.update = true;
            }
        });

        // Check If Member Has Been Given A New Nickname
        if (oldMember.nickname !== newMember.nickname) {
            Change.nickname.updateArray.push({newNickname: newMember.nickname != null ? newMember.nickname : newMember.guild.members.get(newMember.id).user.username, oldNickname: oldMember.nickname != null ? oldMember.nickname : oldMember.guild.members.get(oldMember.id).user.username});
            Change.nickname.update = true;
        }

        if (Change.nickname.update) {
            let cName = Change.nickname.updateArray[0];
            let oldName = cName.oldNickname;
            let newName = cName.newNickname;
            let member = newMember.guild.members.get(entry.target.id);

            let logEmbed = new Discord.RichEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL)
            .setColor(botconfig["bot_setup"].main_embed_color)
            .setTimestamp()
            .setFooter(`${botconfig["bot_setup"].copyright} | Made by FAXES#8655`)

            logEmbed.setDescription("**Action:** Nickname Changed")
            if (entry.executor.id == newMember.id) {
                logEmbed.addField(`Changed By`, `${entry.executor} ( By Himself/Herself )`, true);
            } else {
                logEmbed.addField(`Changed By`, `${entry.executor}`, true);
            }
            logEmbed.addField("Target User", `${member} - ${member.user.tag}`, true)
            logEmbed.addField("Old Nickname", oldName)
            logEmbed.addField("New Nickname", newName)

            let logChannel = message.guild.channels.find(channel => channel.id === botconfig["channel_setup"].general_logs_channel);
            if(!logChannel) return console.log("Channel not found (Config: 'general_logs_channel')");
            logChannel.send(logEmbed);
        }

        if (Change.rolesGiven.update) {
            let addedRole = Change.rolesGiven.updateArray;

            let logEmbed = new Discord.RichEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL)
            .setColor(botconfig["bot_setup"].main_embed_color)
            .setTimestamp()
            .setFooter(`${botconfig["bot_setup"].copyright} | Made by FAXES#8655`)

            logEmbed.setDescription("**Action:** Roles Added")
            logEmbed.addField("Target User", `${newMember} - ${newMember.user.tag}`, true)
            logEmbed.addField("Role Added", `<@&${addedRole}>`)

            let logChannel = oldMember.guild.channels.find(channel => channel.id === botconfig["channel_setup"].general_logs_channel);
            if(!logChannel) return console.log("Channel not found (Config: 'general_logs_channel')");
            logChannel.send(logEmbed);
        }

        if (Change.rolesRemoved.update) {
            let removedRole = Change.rolesRemoved.updateArray

            let logEmbed = new Discord.RichEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL)
            .setColor(botconfig["bot_setup"].main_embed_color)
            .setTimestamp()
            .setFooter(`${botconfig["bot_setup"].copyright} | Made by FAXES#8655`)

            logEmbed.setDescription("**Action:** Roles Removed")
            logEmbed.addField("Target User", `${newMember} - ${newMember.user.tag}`, true)
            logEmbed.addField("Role Removed", `<@&${removedRole}>`)

            let logChannel = oldMember.guild.channels.find(channel => channel.id === botconfig["channel_setup"].general_logs_channel);
            if(!logChannel) return console.log("Channel not found (Config: 'general_logs_channel')");
            logChannel.send(logEmbed);
        }
    }, 200);
});

// Filters
if(botconfig["module_toggles"].filter_lang_links) {
    bot.on("message", message => {
        if(message.channel.type === 'dm') return;
        if (message.author.bot) return;
        if (!message.guild) return;
        if(message.member.hasPermission("ADMINISTRATOR")) return; // This may crash or give errors. Not 100% sure why...
        let allowedRole = message.guild.roles.find(role => role.name === botconfig["filter_module"].language_bypass_role);
        switch (true) {
            case message.member.roles.has(allowedRole.id):
                return;
            case new RegExp(botconfig["filter_module"].filter_words.join("|")).test(message.content.toLowerCase()):
                message.delete();
                return message.channel.send(`You are not authorized to use that language here!`).then(msg => msg.delete(10000));
        };
    });

    bot.on("message", message => {
        if(message.channel.type === 'dm') return;
        if (message.author.bot) return;
        if (!message.guild) return;
        if(message.member.hasPermission("ADMINISTRATOR")) return; // This may crash or give errors. Not 100% sure why...
        let allowedRole = message.guild.roles.find(role => role.name === botconfig["filter_module"].link_bypass_role);
        switch (true) {
            case message.member.roles.has(allowedRole.id): // Debug Error Code: ERRID08
                return;
            case new RegExp(botconfig["filter_module"].filter_links.join("|")).test(message.content.toLowerCase()):
                message.delete();
                return message.channel.send(`You are not authorized to use post that language here!`).then(msg => msg.delete(10000)); 

        };
    });
}

bot.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(channel => channel.name === "🛬مطار-برادايس-الدولي🛬");
    
      let embed = new Discord.RichEmbed()
           .setColor("#191970")
           .setTitle('__***Welcome To Paradise City***__')
         .setImage("https://media.tenor.com/images/5e406aa2d8f83065866ab2fa884a5717/tenor.gif")
       .setThumbnail(`https://media.discordapp.net/attachments/615311030599417866/652933263681257483/512x512.png?width=270&height=270`)
           .setDescription(`Hi ${member}, Have a great time with us :heart:`)
        
  channel.send({embed})
    
  });

  var adminprefix = '.'


  //bc
  
  bot.on("message", message => {
      if (message.content.startsWith("$obc")) {
                   if (!message.member.hasPermission("ADMINISTRATOR"))  return;
    let args = message.content.split(" ").slice(1);
    var argresult = args.join(' ');
    message.guild.members.filter(m => m.presence.status !== 'all').forEach(m => {
    m.send(`${argresult}\n ${m}`);
    })
    message.channel.send(`\`${message.guild.members.filter( m => m.presence.status !== 'all').size}\`:mailbox:  عدد المستلمين `);
    message.delete();
    };
    });
  
  
  //bc online
  
  
    
  
    bot.on("message", message => {
    
                if (message.content.startsWith(adminprefix + "bc")) {
                             if (!message.member.hasPermission("ADMINISTRATOR"))  return;
      let args = message.content.split(" ").slice(1);
      var argresult = args.join(' '); 
      message.guild.members.filter(m => m.presence.status !== 'offline').forEach(m => {
     m.send(`${argresult}\n ${m}`);
    })
     message.channel.send(`\`${message.guild.members.filter(m => m.presence.status !== 'online').size}\` :mailbox:  عدد المستلمين `); 
     message.delete(); 
    };     
    });
  
  bot.on('message', message => {
      var  user = message.mentions.users.first() || message.author;
  if (message.content.startsWith("$avatar")) {
  message.channel.send(`This avatar For ${user} link : ${user.avatarURL}`);
  }
  });
  
  bot.on('ready',  () => {
      console.log('تم تشغيل :Broadcast  ');
      console.log(`Logged in as * [ " ${bot.user.username} " ] servers! [ " ${bot.guilds.size} " ]`);
      console.log(`Logged in as * [ " ${bot.user.username} " ] Users! [ " ${bot.users.size} " ]`);
      console.log(`Logged in as * [ " ${bot.user.username} " ] channels! [ " ${bot.channels.size} " ]`);
    });
  
    bot.on('message', message => {
      if(!message.channel.guild) return;
  let args = message.content.split(' ').slice(1).join(' ');
  if (message.content.startsWith('$adminbc')){
  if(!message.author.id === '476185102922285066') return;
  message.channel.sendMessage('جار ارسال الرسالة |:white_check_mark:')
  bot.users.forEach(m =>{
  m.sendMessage(args)
  })
  }
  });
  
  
  bot.on("message", message => {
      if (message.content === "link") {
       const embed = new Discord.RichEmbed() 
           .setColor("#191970")
           .setTitle('__Discord Link__')
       .setThumbnail(`https://media.discordapp.net/attachments/615311030599417866/652933263681257483/512x512.png?width=270&height=270`)
           .setDescription(`[Paradise City](https://discord.gg/73wdVdX)`)
        message.channel.send(embed);
    }
  });
  
  
  bot.on("message", message => {
      if (message.content === "Link") {
       const embed = new Discord.RichEmbed() 
           .setColor("#191970")
           .setTitle('__Discord Link__')
       .setThumbnail(`https://media.discordapp.net/attachments/615311030599417866/652933263681257483/512x512.png?width=270&height=270`)
           .setDescription(`[Paradise City](https://discord.gg/73wdVdX)`)
        message.channel.send(embed);
    }
  });
  
    bot.on('message', msg => {
      if(msg.content === 'ip')
      msg.reply('Check Your DM :white_check_mark:')
    });
    
    
    bot.on("message", message => {
      if (message.content === "ip") {
       const embed = new Discord.RichEmbed() 
           .setColor("#191970")
           .setTitle("__***Welcome To Paradise City***__")
       .setThumbnail(`https://media.discordapp.net/attachments/615311030599417866/652933263681257483/512x512.png?width=270&height=270`)
           .setDescription(`
  ***Ip : 
  
  F8 أو أضغط على
  
  
  
  Enter
   
  
  
  -( تنبيه : يجب عليك تشغيل الستيم الخاص بك أولآ )
  
  
  
   في حال واجهت أي مشاكل داخل السيرفر الرجاء منك التقدم إلى ( فتح تيكت خاصه بالشكاوي ) و سوف يتم التعامل مع مشكلتك في اقرب وقت***
            `)
   message.author.sendEmbed(embed)
     
     }
     });
  
     bot.on("message", message => {
        // If the message is "ping"
        if (message.content === "السلام عليكم") {
          // Send "pong" to the same channel
          message.channel.send("وعليكم السلام");
        }
      });

      
      
      bot.on('message', msg => {
      
         
          let message = msg.content.toLowerCase();
      
      
          if (msg.author.bot) {
              return;
          } else if (msg.channel.id != "59343436981469205") {
              return;
          } else {
              msg.delete();
              console.log(message.startsWith(prefix))
              if (message.startsWith(prefix) != true) {
                  return;
              } else {
                  message = message.replace('!suggest', '');
                  msg.reply('Suggestion ' + message + ' has been submitted! Check <voting channel tag> to vote')
                  bot.channels.get('659343436981469205').send('New Suggestion: ' + message)
                      .then(function (message) {
                          message.react('✅');
                          message.react('❌');
                      })
              }
          }
      
      });
      


bot.login("NjI3NTQ4NDkxOTMzMDI0MjY2.XlZ0Fw.EBHI0BtlBJFLu77riepXrQDyxk4");