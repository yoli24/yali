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

function CheckDate(){
    var dateNow = new Date();
    if(dateNow.getDay()!=dateNow.getDay()){
        startDate = new Date();
        usersIDS=[];
        data={};
    }
}
function TimeTick(){
    //totalTime[0]={
    //    "test":3
    //};
    //fs.writeFile('./totalTime.json', JSON.stringify(totalTime));
    CheckDate();
    var guild = bot.guilds.find("id", guildID);
    guild.members.forEach(function(elem){
        if(elem.voiceChannel!=null || elem.id=='242360233593274369'){
            if(elem.id=='242360233593274369')
            {
                if(!usersIDS.includes(elem.id)){
                        usersIDS.push(elem.id);
                    }  
                    if(!data[elem.id]){
                        data[elem.id]=0;
                    }
                    data[elem.id]+=tickTimeSpan/1000;
            }
            else{
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
                if(usersIDS.length==0)
                    return;
            var x = [];
            var i, name;
            var timeType, time;
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
            //message.channel.send(name+" time: "+time+" "+timeType);
            x.push(i);
            }
            try{
            var emd = new Discord.RichEmbed();
            emd.addField(startDate, emdText);
            message.channel.sendEmbed(emd);

            //message.channel.send("```cs"+"\n"+emdText+"\n```");
            }
            catch(err){
            }    
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
