const Discord = require('discord.js');
var guild; 
var guildID = '507098979314434048';
var databaseJSON = {"Channel": '507100643761061898',
"Users": [],
"Values": []
};
class DataBaseClass {
static DataToText(bot, channel){
    var text = "";
    var time, user, timeType;
    for(var i = 0; i < databaseJSON.Users.length; i++){
        user = bot.users.find(user => user.id == databaseJSON.Users[i]);
        
        time = databaseJSON.Values[i];
        timeType="seconds";
        if(time>=60){
            time=time/60;
            timeType="minutes";
                if(time>=60){
                    time=time/60;
                    timeType="hours";
                    if(time>=24){
                        time=time/24;
                        timeType="days";
                    }
                }
            }
            time = parseFloat(Math.round(time * 100) / 100).toFixed(2);
          
        text += user + " " + time+ " "+timeType;
    }
    var emb = new Discord.RichEmbed();
    emb.addField("Total Time", text);
    channel.sendEmbed(emb);
}
static AddValue(bot, userID, value){
    if(!databaseJSON.Users.includes(userID)){
        databaseJSON.Users.push(userID);
        databaseJSON.Values.push(0);
    }
    databaseJSON.Values[databaseJSON.Users.indexOf(userID)]+=value;
    this.UpdateData(bot);
}
static UpdateData(bot){
    guild = bot.guilds.find(guild => guild.id==guildID);
    var channel = guild.channels.find(channel => channel.id === '507100643761061898');
    
    var messageID = channel.lastMessageID;
    channel.fetchMessage(messageID)
    .then(message =>{
        message.edit(JSON.stringify(databaseJSON));
    })
    .catch(err=>{
        console.error;
        channel.send(JSON.stringify(databaseJSON));
    });   
}
static DownloadData(bot){
    guild = bot.guilds.find(guild => guild.id==guildID);
    var channel = guild.channels.find(channel => channel.id === '507100643761061898');
    
    var messageID = channel.lastMessageID;

    channel.fetchMessage(messageID)
    .then(message =>{
        databaseJSON = JSON.parse(message.content);
    })
    .catch(err=>{
        channel.send(JSON.stringify(databaseJSON));
    });   
}
}
module.exports = DataBaseClass;
