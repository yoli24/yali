var guild; 
var guildID = '507098979314434048';
var databaseJSON = {"Channel": '507100643761061898',
"Users": [],
"Values": []
};
class DataBaseClass {
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