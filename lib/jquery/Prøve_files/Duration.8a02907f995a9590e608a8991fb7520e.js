var Fronter=Fronter||{};if(typeof Fronter.Format==='undefined'){Fronter.Format={};}
Fronter.Format.Duration={};Fronter.Format.Duration.format=function(duration,cldr_string)
{var seconds=Fronter.Format.Duration.calculateSeconds(duration);var mins,hours;hours=Math.floor(seconds/60/60);seconds-=hours*3600;mins=Math.floor(seconds/60);seconds-=mins*60;var index=0;var returnstring='';var inquotes=false;var char_array=cldr_string.split('');while(index<=char_array.length)
{var char=char_array[index];if(char=="'")
{inquotes=!inquotes;}
else if(inquotes)
{returnstring=returnstring+ char;}
else if(char=='s'&&char_array[index+1]=='s')
{if(seconds.toString().length<2)
{returnstring=returnstring+'0';}
returnstring=returnstring+ seconds;index++;}
else if(char=='s')
{returnstring=returnstring+ seconds;}
else if(char=='m'&&char_array[index+1]=='m')
{if(mins.toString().length<2)
{returnstring=returnstring+'0';}
returnstring=returnstring+ mins;index++;}
else if(char=='m')
{returnstring=returnstring+ mins;}
else if(char=='H'&&char_array[index+1]=='H')
{if(hours.toString().length<2)
{returnstring=returnstring+'0';}
returnstring=returnstring+ hours;index++;}
else if(char=='H')
{returnstring=returnstring+ hours;}
else if(typeof(char)!='undefined')
{returnstring=returnstring+ char;}
index++;}
return returnstring;}
Fronter.Format.Duration.calculateSeconds=function(duration)
{var seconds,mins,hours;var result=duration.match(/(\d+)s/);seconds=(result&&result[1])?result[1]*1:0;result=duration.match(/(\d+)m/);mins=(result&&result[1])?result[1]*1:0;seconds=seconds+(mins*60);result=duration.match(/(\d+)h/);hours=(result&&result[1])?result[1]*1:0;seconds=seconds+(hours*60*60);return seconds;}