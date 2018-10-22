const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '!';
const help = '!total, !day';
var guildID = '326996219782234115';
var channelIDS = ['438405492612792331','443111510764552215','447860504174657546'];
var usersIDS = [];
var data = {};
const tickTimeSpan = 10000; //10 seconds
var startDate;

function TimeTick(){
    var guild = bot.guilds.find("id", guildID);
    guild.members.forEach(function(elem){
        if(elem.voiceChannel!=null){
            for(var i=0;i<channelIDS.length;i++){
                if(elem.voiceChannel.id==channelIDS[i]){
                    if(!usersIDS.includes(elem.id)){
                        usersIDS.push(elem.id);
                    }  
                    if(!data[elem.id]){
                        data[elem.id]=0;
                    }
                    data[elem.id]+=tickTimeSpan/1000;
                    
                    break;
                }
            }
        }
    });
}

bot.on('ready', async()=>{
    console.log("\x1b[42m%s\x1b[0m", `Connected to ${bot.user.tag}!`);
    //bot.user.setActivity("!help");
    TimeTick();
    bot.setInterval(TimeTick, tickTimeSpan);
    startDate=new Date();
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
            case prefix+"total":
            var x = [];
            var i, name;
            var timeType, time;
            var emd = new Discord.RichEmbed();
            var emdText = "";
            while(usersIDS.length>0){
            i = usersIDS.pop();
            name = bot.users.find('id', i);
            time = data[i];
            
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
            emdText+=name+" time: "+time+" "+timeType+"\n";
            x.push(i);
            }
            emd = emd.addField(startDate+" - "+new Date(), emdText);
            message.channel.send(emd);
            usersIDS=x;
            break;
            case prefix+"day":
            message.reply('this command is not ready yet.');
            break;
            default:
            message.reply(help);
            break;
        }
    }
 
});

bot.login(process.env.BOT_TOKEN);
