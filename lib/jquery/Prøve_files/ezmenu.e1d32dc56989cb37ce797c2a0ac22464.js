var xqk=[],lkj=[],mnb=[],nbv=[],nhy=[],vfr=[],qsx=[],wsx=[],pij=[],cxz=[],cfi=[],cgz=[],cla=[],vkk=[],vhd=[],vii=[],voe=[],vqq=[],bqq=[],bww=[],brr=[],btt=[],byy=[],buu=[],nqq=[],nww=[],nrr=[],mqq=[],mww="menu",zqq=null,zrr="",ztt=[],zuu=[],xqq,xww,xrr,xuu,xpp,xqw,xdd,xjk,xgg,cwq,cwi,cyt,cff,cdd,cxq,crz,cki,nju,nku,nlq,nsq,nfq;function setup(){var fs;for(var i=0;i<ez_Menu.length;i++){for(var r=0;r<ez_root.length;r++){if(ez_root[r]- 0==i){fs=ez_fontInfo[r].split(",");xqq=fs[0];xww=fs[1];xrr=fs[2];xuu=fs[3];fs=ez_tfontInfo[r].split(",");xpp=fs[0];xqw=fs[1];xdd=fs[2];fs=ez_colInfo[r].split(",");xjk=fs[0];xgg=fs[1];cwq=fs[2];cwi=fs[3];fs=ez_borSize[r].split(",");cyt=fs[0]- 0;cff=fs[1]- 0;cdd=ez_txtPad[r]- 0;fs=ez_arrow[r].split(",");cxq=fs[0];crz=fs[1];cki=fs[2]- 0;mqq[i]=ez_barSpc[r]- 0;vhd[i]=0;vii[i]=0;nju=ez_xover[r]- 0;nku=ez_yover[r]- 0;nlq=ez_bg[r];}}
nrr[i]=cdd;byy[i]=cxq;buu[i]=crz;nqq[i]=cki;bqq[i]=cyt;btt[i]=cff;voe[i]=0;bww[i]=nju;brr[i]=nku;nww[i]=nlq;ztt[i]=false;zuu[i]=false;nbv[i]=[];nhy[i]=[];vfr[i]=[];qsx[i]=[];wsx[i]=[];pij[i]=[];cxz[i]=[];cfi[i]=[];cgz[i]=[];cla[i]=[];vkk[i]=[];for(var j=0;j<ez_Menu[i].length;j++){contents=ez_Menu[i][j].split("^");qsx[i][j]=false;if(contents[0].substring(0,1)=='!'){nbv[i][j]=contents[0].substring(1);wsx[i][j]=xpp;pij[i][j]=xqw;cxz[i][j]=xdd;cfi[i][j]=xdd;cgz[i][j]=cwq;cla[i][j]=cwq;vkk[i][j]=true;}else{nbv[i][j]=contents[0];wsx[i][j]=xqq;pij[i][j]=xww;cxz[i][j]=xrr;cfi[i][j]=xuu;cgz[i][j]=xjk;cla[i][j]=xgg;vkk[i][j]=false;}
if(contents.length>1){nhy[i][j]=contents[1];}else{nhy[i][j]=contents[1]="";}
if(contents.length>2){vfr[i][j]=contents[2];}else{vfr[i][j]="-1";}
if(vfr[i][j]===""){vfr[i][j]="-1";}}
fmdq(i,ez_isBar[i]);}}
function menusGo(){for(var i=0;i<ez_Menu.length;i++)
{fxcz(i,voe[i],ez_isBar[i]);}}
function menusGoOpera(){}
function showPermPanel(name,x,y){var num=panelnum(name);if(num!=-1)
{fsqq(num,x,y);ztt[num]=true;}}
function showPermPanelCentered(name,x,y){var num=panelnum(name);if(num!=-1)
{fsqq(num,x- voe[num]/2,y- vqq[num]/2);ztt[num]=true;}}
function showRelativePanel(name,e){fiww();fsxq();var num=panelnum(name);if(num!=-1)
{var menuID=mww+"_"+ num;menuHeight=getDiv(menuID).offsetHeight;menuWidth=getDiv(menuID).offsetWidth;var window_dimensions=getWindowDimentions();windowWidth=window_dimensions[0];windowHeight=window_dimensions[1];if(!e)var e=window.event;if(e.pageX||e.pageY){displayx=e.pageX;displayy=e.pageY;}
else if(e.clientX||e.clientY){displayx=e.clientX+ document.body.scrollLeft
+ document.documentElement.scrollLeft;displayy=e.clientY+ document.body.scrollTop
+ document.documentElement.scrollTop;}
if(displayy>(windowHeight-menuHeight)+document.documentElement.scrollTop){displayy=displayy-menuHeight;}
if(displayx>(windowWidth-menuWidth)){displayx=displayx-menuWidth;}
if(displayy<0){displayy=0;}
fsqq(num,displayx,displayy);}}
function getWindowDimentions(){var viewportwidth;var viewportheight;if(typeof window.innerWidth!='undefined'){viewportwidth=window.innerWidth,viewportheight=window.innerHeight}else if(typeof document.documentElement!='undefined'&&typeof document.documentElement.clientWidth!='undefined'&&document.documentElement.clientWidth!=0){viewportwidth=document.documentElement.clientWidth,viewportheight=document.documentElement.clientHeight}else{viewportwidth=document.getElementsByTagName('body')[0].clientWidth,viewportheight=document.getElementsByTagName('body')[0].clientHeight}
return new Array(viewportwidth,viewportheight);}
function showPanel(name,x,y){fiww();fsxq();var num=panelnum(name);if(num!=-1)
fsqq(num,x,y);}
function hidePanel(){foiw();}
function showPermPanels(){for(i=0;i<ez_Menu.length;i++)
{if(ztt[i])
fsqq(i,vhd[i],vii[i]);}}
function panelnum(name){var num=-1;for(i=0;i<ez_Menu.length;i++)
{if(name==ez_pname[i])
num=i;}
if(num==-1)
alert("No panel of name "+ name);return num;}
function fsqq(i,x,y){x=x-5;y=y;var menuID=mww+"_"+ i;vhd[i]=x;vii[i]=y;for(var j=0;j<ez_Menu[i].length;j++)
{if(qsx[i][j])
fhiy(menuID+"_"+ j,false);}
var menuEL=getDiv(menuID).style;menuEL.left=x+'px';menuEL.top=y+'px';menuEL.visibility='visible';zuu[i]=true;}
function fsqz(i){for(var m=0;m<ez_Menu[i].length;m++)
{var childMenu=vfr[i][m]- 0;if(qsx[i][m]&&childMenu!=-1)
fsqz(childMenu);}
var menuID=mww+"_"+ i;var menuEL=getDiv(menuID).style;menuEL.visibility='hidden';zuu[i]=false;}
function fsxq(){var i,menuID;for(i=0;i<ez_Menu.length;i++)
{if(!ztt[i]&&zuu[i])
{menuID=mww+"_"+ i;var menuEL=getDiv(menuID);menuEL.style.visibility='hidden';zuu[i]=false;}}
showPermPanels();}
function fmdq(i,bar){var menuID=mww+"_"+ i,bg="",str="<div class='ezymenu-parent' id='"+ menuID+"' >",numItems=ez_Menu[i].length;for(var j=0;j<numItems;j++){var itemID=menuID+"_"+ j;var textalign="";var title=fiih(i,j,false,bar);if(vkk[i][j]){textalign=";text-align: center";}
if(nww[i]==""|vkk[i][j]){str+="<div class='ezymenu-child' id='"+ itemID+"' title='"+ title+"' role='menuitem' aria-label='menu'>";}else{str+="<div style='position:absolute;visibility:inherit;background:transparent;' "+"id='"+ itemID+"' title='"+ title+"'>";}
str+="<a href='javascript: void(0);' aria-label='"+ title+"' >"+ title+"</a></div>";if(bar&&(j!=numItems- 1))
{if(nww[i]==""){str+="<div style='position:absolute;visibility:inherit;font-size:0pt;background-color:"
+ xjk+";padding:"+ nrr[i]+"' id="+ itemID+"s></div>";}else{str+="<div style='position:absolute;visibility:inherit;font-size:0pt;background:transparent;padding:"
+ nrr[i]+"' id="+ itemID+"s></div>";}}else if(!bar&&vfr[i][j]!="-1"){str+="<div style='position:absolute;visibility:inherit;width:"+ nqq[i]+";background:transparent' id="+ itemID+"s>"+ fipd(i,false)+"</div>";}}
str+="</div>";var div=document.createElement('div');div.innerHTML=str;document.body.appendChild(div.firstChild);}
function compactStr(txt){var replacement=new Array(" ",",","-","!","%","(",")","{","}","[","]","?");var replaceby=new Array(".",".","..",".","..","..","..","..","..","..","..","..");var compactTxt="";var subst="";var outsideTag=true,toSub;for(i=0;i<txt.length;i++)
{var chr=txt.charAt(i);if(chr=="<")
outsideTag=false;if(!outsideTag&&chr==">")
outsideTag=true;toSub=false;for(j=0;j<replacement.length;j++)
if(chr==replacement[j])
{toSub=true;subst=replaceby[j];}
if(toSub&&outsideTag)
compactTxt+=subst;else
compactTxt+=chr;}
return compactTxt;}
function fxcz(i,width,bar){var element,testWidth,itemPosY,itemPosX,numItems,itemID,menuEL,spacerStyle,menuID=mww+"_"+ i,ht=0,maxWidth=0,maxHt=0;element=getDiv(menuID);if(!element){createMenu(i);element=getDiv(menuID);}
itemPosY=bqq[i];itemPosX=bqq[i];xqk[i]=[];lkj[i]=[];mnb[i]=[];element.onmouseover=fiww;element.onmouseout=foiw;numItems=ez_Menu[i].length;for(var j=0;j<numItems;j++){itemID=menuID+"_"+ j;xqk[i][j]=itemPosY;lkj[i][j]=itemPosX;fuwm(i,j,itemPosX,itemPosY);element=getDiv(itemID);mnb[i][j]=element.offsetHeight;if(mnb[i][j]>maxHt){maxHt=mnb[i][j];}
testWidth=element.offsetWidth+(vfr[i][j]!="-1")*2*nqq[i];if(testWidth>maxWidth){maxWidth=testWidth;}
if(bar){itemPosX+=element.offsetWidth+ mqq[i];}else{itemPosY+=element.offsetHeight+ btt[i];}}
for(var j=0;j<numItems;j++){itemID=menuID+"_"+ j;element=getDiv(itemID).style;if(bar){element.height=maxHt;}else{element.width=maxWidth;if(vfr[i][j]!="-1"){element=getDiv(itemID+"s").style;element.left=maxWidth+ bqq[i]- 1.5*nqq[i];element.top=xqk[i][j]+(mnb[i][j]- nqq[i])/ 2;
}}}
if(bar){for(var j=0;j<numItems- 1;j++){spacerStyle=getDiv(mww+"_"+ i+"_"+ j+"s").style;spacerStyle.top=bqq[i];spacerStyle.left=lkj[i][j+ 1]- mqq[i];spacerStyle.width=mqq[i];spacerStyle.height=maxHt;}}
menuEL=getDiv(menuID);if(bar){vqq[i]=maxHt+ 2*bqq[i];voe[i]=itemPosX+ bqq[i]- mqq[i];}else{vqq[i]=itemPosY+ bqq[i]- btt[i];voe[i]=maxWidth+ 2*bqq[i];}
menuEL.style.height=vqq[i];menuEL.style.width=voe[i];}
function fuwm(m,n,posx,posy){var menuID=mww+"_"+ m,itemID=menuID+"_"+ n,element=getDiv(itemID);element.onmouseover=fcco;element.onmouseup=fiqd;elementStyle=element.style;elementStyle.top=posy;elementStyle.left=posx;}
function fipd(m,hi){if(nqq[m]- 0==0)
return("");if(hi)
return("<img src="+ buu[m]+" width="+ nqq[m]+" height="+ nqq[m]+" border='0' vspace='0' hspace='0' alt='*'>");else
return("<img src="+ byy[m]+" width="+ nqq[m]+" height="+ nqq[m]+" border='0' vspace='0' hspace='0' alt='*'>");}
function fiih(m,n,hi,bar){return(nbv[m][n]);}
function fiqd(){var id=zrr.split("_");var ml=nhy[id[1]- 0][id[2]- 0];if(ml!="")
{lk=ml.split(",");if(lk.length==1)
{if(typeof(ezmenu_callback_func)=="function")
{if(ezmenu_callback_func(lk[0]))
document.location.href=lk[0];}
else
{document.location.href=lk[0];}}
else
{if(eval("parent."+ lk[1]))
{eval("parent."+ lk[1]+".location.href='"+ lk[0]+"'");}
else
{window.open(lk[0],lk[1]);w=true;}}}}
function foiw(){zqq=setTimeout('fsxq()',300);}
function fiww(){clearTimeout(zqq);}
function fcco(){var item=this.id;zrr=item;var ID=item.split("_");var menuTg=ID[0]+'_'+ ID[1];var menuID=ID[1];var itemID=ID[2];var childMenu;for(var j=0;j<ez_Menu[menuID].length;j++)
{if(qsx[menuID][j])
{fhiy(menuTg+"_"+ j,false);childMenu=vfr[menuID][j]- 0;if(childMenu!=-1)
fsqz(childMenu);}}
if(ztt[menuID])
{fsxq();}
childMenu=vfr[menuID][itemID];if(childMenu!="-1")
{if(ez_isBar[menuID])
{var x=vhd[menuID]+ lkj[menuID][itemID]- 0;var y=vii[menuID]+ vqq[menuID]- bqq[menuID];}
else
{var x=vhd[menuID]+ voe[menuID]- bqq[menuID];var y=vii[menuID]+ xqk[menuID][itemID];}
x-=bww[menuID];y+=brr[menuID];fsqq(childMenu,x,y);}
fhiy(item,true);}
function fhiy(item,hi){var ID=item.split("_");var menuID=ID[1];var itemID=ID[2];qsx[menuID][itemID]=hi;var itemEL=getDiv(item);var itemsEL=getDiv(item+"s");if(hi){status=nhy[menuID][itemID].split(",")[0];}
if(vfr[menuID][itemID]!="-1"&&!ez_isBar[menuID]){itemsEL.innerHTML=fipd(menuID,hi);}}
function getDiv(id){return document.getElementById(id);}
function ezmenuClick(item){zrr=item;fiqd();}
function createMenu(i){for(var r=0;r<ez_root.length;r++){var fs=ez_fontInfo[r].split(",");xqq=fs[0];xww=fs[1];xrr=fs[2];xuu=fs[3];fs=ez_tfontInfo[r].split(",");xpp=fs[0];xqw=fs[1];xdd=fs[2];fs=ez_colInfo[r].split(",");xjk=fs[0];xgg=fs[1];cwq=fs[2];cwi=fs[3];fs=ez_borSize[r].split(",");cyt=fs[0]- 0;cff=fs[1]- 0;cdd=ez_txtPad[r]- 0;fs=ez_arrow[r].split(",");cxq=fs[0];crz=fs[1];cki=fs[2]- 0;mqq[i]=ez_barSpc[r]- 0;vhd[i]=0;vii[i]=0;nju=ez_xover[r]- 0;nku=ez_yover[r]- 0;nlq=ez_bg[r];}
nrr[i]=cdd;byy[i]=cxq;buu[i]=crz;nqq[i]=cki;bqq[i]=cyt;btt[i]=cff;voe[i]=0;bww[i]=nju;brr[i]=nku;nww[i]=nlq;ztt[i]=false;zuu[i]=false;nbv[i]=[];nhy[i]=[];vfr[i]=[];qsx[i]=[];wsx[i]=[];pij[i]=[];cxz[i]=[];cfi[i]=[];cgz[i]=[];cla[i]=[];vkk[i]=[];for(var j=0;j<ez_Menu[i].length;j++){contents=ez_Menu[i][j].split("^");qsx[i][j]=false;if(contents[0].substring(0,1)=='!'){nbv[i][j]=contents[0].substring(1);wsx[i][j]=xpp;pij[i][j]=xqw;cxz[i][j]=xdd;cfi[i][j]=xdd;cgz[i][j]=cwq;cla[i][j]=cwq;vkk[i][j]=true;}else{nbv[i][j]=contents[0];wsx[i][j]=xqq;pij[i][j]=xww;cxz[i][j]=xrr;cfi[i][j]=xuu;cgz[i][j]=xjk;cla[i][j]=xgg;vkk[i][j]=false;}
if(contents.length>1){nhy[i][j]=contents[1];}else{nhy[i][j]=contents[1]="";}
if(contents.length>2){vfr[i][j]=contents[2];}else{vfr[i][j]="-1";}
if(vfr[i][j]==""){vfr[i][j]="-1";}}
fmdq(i,ez_isBar[i]);}
(function($){"use strict";function ezKeydown(element,event,isParent){var code=_getKeyCode(event),shiftKey=_getShiftKey(event),name=$(element).attr('name');var position=$(element).position();event.pageX=position.left;event.pageY=position.top;if(isParent){if(code=='13'||code=='40'){preventDefaultAction(event);menusGo_cust(name);showRelativePanel(name,event);$('#menu_'+name).children(".ezymenu-child:first").find('a').focus();}}else{var parentId=$(element).parent().attr('id');var parentName=parentId.substring(5);if(code=='40'){preventDefaultAction(event);if($(element).next().length>0){$(element).next().find('a').focus();}}else if(code=='38'){preventDefaultAction(event);if($(element).prev().length>0){$(element).prev().find('a').focus();}}else if(code=='27'){preventDefaultAction(event);_ezMenuFocus(parentName);}else if(code=='9'){preventDefaultAction(event);if(shiftKey){if($(element).prev().length>0){$(element).prev().find('a').focus();}else{_ezMenuFocus(parentName);}}else{if($(element).next().length>0){$(element).next().find('a').focus();}else{_ezMenuFocus(parentName);}}}else if(code=='13'){preventDefaultAction(event);ezmenuClick($(element).attr('id'));}}}
function _ezMenuFocus(name){hidePanel();$('.ez-menu[name="'+name+'"]').focus();}
function _getKeyCode(event){return($.browser.msie&&window.event?window.event.keyCode:(event.keyCode?event.keyCode:event.which));}
function _getShiftKey(event){return(window.event?window.event.shiftKey:event.shiftKey);}
function preventDefaultAction(e){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}}
$(function(){$('body').delegate('.ez-menu','keydown',function(event){ezKeydown(this,event,true);});$('body').delegate('.ezymenu-child','keydown',function(event){ezKeydown(this,event,false);});});})(jQuery);