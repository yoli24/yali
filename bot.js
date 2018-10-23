const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const prefix = '!';
const help = '!total, !today';
const tickTimeSpan = 10000; //10 seconds
const totalTimePath = './totalTime.json';
const totalTimeUsersPath = './totalTimeUsers.json';
const todayTimePath = './todayTime.json';
const todayTimeUsersPath = './todayTimeUsers.json';

var guildID = '326996219782234115';
var channelIDS = ['438405492612792331','443111510764552215','447860504174657546'];
let totalTimeData = require(totalTimePath);
let totalTimeUsersData = require(totalTimeUsersPath);
let todayTimeData = require(todayTimePath);
let todayTimeUsersData = require(todayTimeUsersPath);
var startDate;


function UpdateJsonFile(path, data){
    fs.writeFileSync(path, JSON.stringify(data));
}

function CheckDate(){
    var dateNow = new Date();
    if(true){//if(dateNow.getDay()!=dateNow.getDay()){
        startDate = new Date();
        todayTimeUsersData={"Users":""};
        todayTimeData={"Online":""};
        UpdateJsonFile(todayTimePath, todayTimeData);
        UpdateJsonFile(todayTimeUsersPath, todayTimeUsersData);
    }
}
var x =0;
function TimeTick(){
    if(x==0)
    CheckDate();
    x++
    var guild = bot.guilds.find("id", guildID);
    totalTimeData.Online="";
    todayTimeData.Online="";
    guild.members.forEach(function(elem){
        if(elem.voiceChannel!=null){
            for(var i=0;i<channelIDS.length;i++){
                
                if(elem.voiceChannel.id==channelIDS[i]){
                    if(!todayTimeUsersData.Users.includes(elem.id)){
                        if(todayTimeUsersData.Users.split(',').length>1){
                        todayTimeUsersData.Users +=","+elem.id;
                        }
                        else{
                           todayTimeUsersData.Users = elem.id;
                        }
                        UpdateJsonFile(todayTimeUsersPath, todayTimeUsersData);
                    }
                    if(!totalTimeUsersData.Users.includes(elem.id)){
                       if(totalTimeUsersData.Users.split(',').length>1){
                       totalTimeUsersData.Users +=","+elem.id;
                       }
                       else{
                          totalTimeUsersData.Users = elem.id;
                       }
                       UpdateJsonFile(totalTimeUsersPath, totalTimeUsersData);
                   }
                   if(!totalTimeData[elem.id]){
                       totalTimeData[elem.id]=0;
                   }
                   if(!todayTimeData[elem.id]){
                       todayTimeData[elem.id]=0;
                   }
        
                   todayTimeData[elem.id]+=tickTimeSpan/1000;
                   UpdateJsonFile(todayTimePath, todayTimeData);
                   totalTimeData[elem.id]+=tickTimeSpan/1000;
                   UpdateJsonFile(totalTimePath, totalTimeData);

                   if(totalTimeData.Online.split(',').length>1){
                    totalTimeData.Online +=","+elem.id;
                    }
                    else{
                       totalTimeData.Online = elem.id;
                    }
                    if(todayTimeData.Online.split(',').length>1){
                        todayTimeData.Online +=","+elem.id;
                        }
                        else{
                           todayTimeData.Online = elem.id;
                        }
                   break;
                }
            }
            
        }
                 
    });
}


bot.on('ready', async()=>{
    console.log("\x1b[42m%s\x1b[0m", `Connected to ${bot.user.tag}!`);
    bot.user.setStatus("online", "!help");
    //bot.user.setActivity("!help");
    TimeTick();
    bot.setInterval(TimeTick, tickTimeSpan);
    startDate=new Date();
    if(totalTimeUsersData.StartDate==0){
        totalTimeUsersData.StartDate=startDate.toDateString();
        UpdateJsonFile(totalTimeUsersPath, totalTimeUsersData);
    }
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
        var string, i, name, timeType, time, emdText, emd;
        switch(cmd){
            case prefix+"help":
            message.reply(help);
            break;
                
            case prefix+"total":
            
            string = totalTimeUsersData.Users.split(',');
            i, name;
            timeType, time;
            emdText = "";     
                console.log(string);
            while(string.length>0){
            i=string.pop();
            name = bot.users.find('id', i);
            time = totalTimeData[i];
            
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
            if(totalTimeData.Users>1&&!totalTimeData.Users.includes(i)){
                emdText+=name+" time: "+time+" "+timeType+"\n";

            }
            else{
                emdText+="[Online]"+name+" time: "+time+" "+timeType+"\n";
            }            }
            try{
            emd = new Discord.RichEmbed();
            emd.addField("Total time since: "+startDate.toDateString(), emdText);
            message.channel.sendEmbed(emd);

            }
            catch(err){
            }    
            break;
            case prefix+"today":
            string = todayTimeUsersData.Users.split(',');
            i, name;
            timeType, time;
            emdText = "";     
                
            while(string.length>0){
            i=string.pop();
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
            if(todayTimeData.length>1&&!todayTimeData.Users.includes(i)){
                emdText+=name+" time: "+time+" "+timeType+"\n";

            }
            else{
                emdText+="[Online]"+name+" time: "+time+" "+timeType+"\n";
            }
            }
            try{
            emd = new Discord.RichEmbed();
            emd.addField("Activity for today: "+startDate.toDateString(), emdText);
            message.channel.sendEmbed(emd);

            }
            catch(err){
            }               break;
            default:
            message.reply(help);
            break;
        }
    }
 
});
bot.login(process.env.BOT_TOKEN);
