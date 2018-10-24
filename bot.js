const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '!';
const help = '!today';
const tickTimeSpan = 10000; 

var guildID = '326996219782234115';
var channelIDS = ['438405492612792331','443111510764552215','447860504174657546'];

let todayTimeData = {};
var startDate;
var userIDS = [];
var onlineUsers = [];

function CheckDate(){
    var dateNow = new Date();
    if(dateNow.getDay()!=startDate.getDay()){
        startDate = new Date();
        todayTimeData={};
        userIDS={};
    }
}
function TimeTick(){
    CheckDate();
    var guild = bot.guilds.find("id", guildID);
    todayTimeData.Online="";
    onlineUsers=[];
    guild.members.forEach(function(elem){
        if(elem.voiceChannel!=null){
            for(var i=0;i<channelIDS.length;i++){
                if(elem.voiceChannel.id==channelIDS[i]){
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
            
        }
                 
    });
}


bot.on('ready', async()=>{
    console.log("\x1b[42m%s\x1b[0m", `Connected to ${bot.user.tag}!`);
     bot.user.setStatus("online", "!help");
     startDate=new Date();
    TimeTick();
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
        var string, i, temp, name, timeType, time, emdText, emd;
        switch(cmd){
            case prefix+"help":
            message.reply(help);
            break;

            case prefix+"today":
                if(userIDS.length==0)
                    return;
            i, name;
            timeType, time;
            emdText = "";     
             temp = [];   
            while(userIDS.length>0){
            i=userIDS.pop();
            temp.push(i);
            name = bot.users.find('id', i);
            time = todayTimeData[i];
            
            timeType="seconds";
            if(time>60){
                time=time/60;
                timeType="minutes";
                if(time>60){
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
            message.channel.sendEmbed(emd);       
            
            userIDS=temp;
            break;

            default:
            message.reply(help);
            break;
        }
    }
 
});
bot.login(process.env.BOT_TOKEN);
