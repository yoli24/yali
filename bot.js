const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '!';
const help = '!today';
const tickTimeSpan = 10000; 

var guildID = '326996219782234115';
var notifications = ['242360233593274369', '331103748376100897'];
let todayTimeData = {};
var startDate;
var userIDS = [];
var onlineUsers = [];

function SendNotification(){
    for(var i =0; i<notifications.length;i++){
        var user = bot.users.find("id", notifications[i]);
        user.sendMessage("Sum for today:");
        GenerateTodayMessage(user.dmChannel);

        //user.sendMessage(GenerateTodayMessage());
    }
}

function CheckDate(){
    var dateNow = new Date();
    if(dateNow.getDay()!=startDate.getDay()){
        SendNotification();
        startDate = new Date();
        todayTimeData={};
        userIDS={};
    }
}

function TimeTick(){
    CheckDate();
    var guild = bot.guilds.find("id", guildID);
    onlineUsers=[];
    guild.members.forEach(function(elem){
        if(elem.voiceChannel!=null){
                if(elem.voiceChannel.name.includes("NV Squad")){
                    if(!userIDS.includes(elem.id)){
                        userIDS.push(elem.id);
                    }
                   if(!todayTimeData[elem.id]){
                       todayTimeData[elem.id]=0;
                   }
                   onlineUsers.push(elem.id);
                   todayTimeData[elem.id]+=tickTimeSpan/1000;              
                }
            
        }   
    });
}


bot.on('ready', async()=>{
    console.log("\x1b[42m%s\x1b[0m", `Connected to ${bot.user.tag}!`);
     //bot.user.setStatus("online", "!help");
     startDate=new Date();
    //TimeTick();
    bot.setInterval(TimeTick, tickTimeSpan);

});
bot.on('message', (message)=>{
    if(!(message.channel.type=="dm")) return;
    if(message.author.id=='265205555075743754') return;
    if(message.author.bot) return;

    if(!message.content.startsWith(prefix)){
        message.channel.send(help);
        return;
    }
    else{
        var cmd = message.content.split(' ')[0];
        switch(cmd){
            case prefix+"help":
            message.reply(help);
            break;

            case prefix+"today":
                GenerateTodayMessage(message.channel);
              //message.reply(GenerateTodayMessage());
            break;

            default:
            message.reply(help);
            break;
        }
    }
 
});
function GenerateTodayMessage(channel){
    if(userIDS.length==0){
        channel.send('No activity today! :(');
        return;
    }
    var i, name;
    var timeType, time;
    var emdText = "";     
    for(var x = 0; x< userIDS.length;x++){
        i = userIDS[x];
        name = bot.users.find('id', i);
        time = todayTimeData[i];

        timeType="seconds";
        if(time>=60){
            time=time/60;
            timeType="minutes";
                if(time>=60){
                    time=time/60;
                    timeType="hours";
                }
            }
            time=Math.floor(time);
            if(onlineUsers.includes(i)){
                emdText+="[Online]"+name+" time: "+time+" "+timeType+"\n";
            }
            else{
                emdText+=name+" time: "+time+" "+timeType+"\n";
            }
    }
            emd = new Discord.RichEmbed();
            emd.addField("Activity for today: "+startDate.toDateString(), emdText);
            channel.sendEmbed(emd);       

            
    }
bot.login(process.env.BOT_TOKEN);
