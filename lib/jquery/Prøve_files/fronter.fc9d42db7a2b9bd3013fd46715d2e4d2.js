function is_int(num){if(!is_numeric(num)){return false;}
var tmp=parseInt(num);return tmp==num;}
function is_float(num){var float_pattern=/^-?\d+\.\d+$/;if(!is_numeric(num)){return false;}
if(num.match(float_pattern)==null){return false;}
return true;}
function is_numeric(num){if(isNaN(num)){return false;}
return true;}
if(!document.trim){function trim(str){if(!str){return'';}
return str.replace(/^\s*|\s*$/g,"");}}
if(!document.numpad){function numpad(number,length){var str=''+ number;while(str.length<length){str='0'+ str;}
return str;}}
function object_find_position(obj){var curleft=curtop=0;if(obj.offsetParent){curleft=obj.offsetLeft
curtop=obj.offsetTop
while(obj=obj.offsetParent){curleft+=obj.offsetLeft
curtop+=obj.offsetTop}}
return[curleft,curtop];}
var __i18n_translate=null;function i18n_add(key,value){__i18n_create();__i18n_translate.add(key,value);}
function i18n(key){__i18n_create();return __i18n_translate.get(key);}
function __i18n_create(){if(!__i18n_translate){__i18n_translate=new FI18n();}}
FI18n=function(){this.strings=new Array();};FI18n.prototype.add=function(key,value){this.strings[key]=value;};FI18n.prototype.get=function(key){if(this.strings[key]!=undefined){return this.strings[key];}
return key;};function sprintf()
{if(!arguments||arguments.length<1||!RegExp)
{return;}
var str=arguments[0];var re=/([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;var a=[],numSubstitutions=0,numMatches=0;while(a=re.exec(str))
{var leftpart=a[1],pPad=a[2],pJustify=a[3],pMinLength=a[4];var pPrecision=a[5],pType=a[6],rightPart=a[7];numMatches++;if(pType=='%')
{subst='%';}
else
{numSubstitutions++;if(numSubstitutions>=arguments.length)
{return'';}
var param=arguments[numSubstitutions];var pad='';if(pPad&&pPad.substr(0,1)=="'")pad=leftpart.substr(1,1);else if(pPad)pad=pPad;var justifyRight=true;if(pJustify&&pJustify==="-")justifyRight=false;var minLength=-1;if(pMinLength)minLength=parseInt(pMinLength);var precision=-1;if(pPrecision&&pType=='f')precision=parseInt(pPrecision.substring(1));var subst=param;if(pType=='b')subst=parseInt(param).toString(2);else if(pType=='c')subst=String.fromCharCode(parseInt(param));else if(pType=='d')subst=parseInt(param)?parseInt(param):0;else if(pType=='u')subst=Math.abs(param);else if(pType=='f')subst=(precision>-1)?Math.round(parseFloat(param)*Math.pow(10,precision))/ Math.pow(10, precision): parseFloat(param);
else if(pType=='o')subst=parseInt(param).toString(8);else if(pType=='s')subst=param;else if(pType=='x')subst=(''+ parseInt(param).toString(16)).toLowerCase();else if(pType=='X')subst=(''+ parseInt(param).toString(16)).toUpperCase();}
str=leftpart+ subst+ rightPart;}
return str;}
function checkCapsLock(e,func){kc=e.keyCode?e.keyCode:e.which;sk=e.shiftKey?e.shiftKey:((kc==16)?true:false);if(((kc>=65&&kc<=90)&&!sk)||((kc>=97&&kc<=122)&&sk)){func(1);}else{func(0);}}
function includeCSS(p_file){var v_css=document.createElement('link');v_css.rel='stylesheet'
v_css.type='text/css';v_css.href=p_file;document.getElementsByTagName('head')[0].appendChild(v_css);}
function _evalJSON(object){return(object+"").evalJSON(false);}
function encode_utf8(s){encoded=null;try{encoded=unescape(encodeURIComponent(s));}catch(ex){return s;}
return encoded;}
function decode_utf8(s){decoded=null;try{decoded=decodeURIComponent(escape(s));}catch(ex){return s;}
return decoded;}
function encodeToTransport(s){s=s.replace(/\r/g,"").replace(/\n/,"%0A");return encodeURIComponent(s);}
function decodeFromTransport(s){return decodeURIComponent(unescape(s));}
function decodeFromTransport_for_utf8(s){return unescape(decodeURIComponent(s));}
String.prototype.encodeToHex=function(){var r="";var e=0;if(Object.isFunction(this.length)){e=this.length();}else{e=this.length;}
var c=0;var h;while(c<e){h=this.charCodeAt(c++).toString(16);while(h.length<2)h="0"+h;r+=h;}
return r;};String.prototype.decodeFromHex=function(){var r="";if(Object.isFunction(this.length)){e=this.length();}else{e=this.length;}
var s;while(e>=0){s=e-3;r=String.fromCharCode("0x"+this.substring(s,e))+r;e=s;}
return r;};String.prototype.shortenWords=function(maxwordlength,maxwords){if(this.length>maxwordlength){var words=this.split(' ');words=words.splice(0,maxwords);words=words.invoke('truncate',maxwordlength,'\u2026');return words.join(' ');}else{return this+'';}};if(document.viewport){document.viewport.getDimensions=function(){var dimensions={};$w('width height').each(function(d){var D=d.capitalize();if(Prototype.Browser.Opera||document.documentElement.clientHeight==0||Prototype.Browser.Gecko&&!(document.body.clientHeight==document.body.offsetHeight&&document.body.clientHeight==document.body.scrollHeight))
{dimensions[d]=document.body['client'+ D];}else if(Prototype.Browser.WebKit){dimensions[d]=self['inner'+ D];}else{dimensions[d]=document.documentElement['client'+ D];}});return dimensions;}}
String.prototype.isJSON=function(){_ESCAPES=/\\["\\\/bfnrtu]/g;_VALUES=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;_BRACKETS=/(?:^|:|,)(?:\s*\[)+/g;_INVALID=/^[\],:{}\s]*$/;_SPECIAL_CHARS=/["\\\x00-\x1f\x7f-\x9f]/g;return _INVALID.test(this.replace(_ESCAPES,'@').replace(_VALUES,']').replace(_BRACKETS,''));};//@ http://jsfromhell.com/string/wordwrap [v1.0]
String.prototype.wordWrap=function(m,b,c){var i,j,l,s,r;if(m<1){return this;}
for(i=-1,l=(r=this.split("\n")).length;++i<l;r[i]+=s){for(s=r[i],r[i]="";s.length>m;r[i]+=s.slice(0,j)+((s=s.slice(j)).length?b:"")){j=c==2||(j=s.slice(0,m+ 1).match(/\S*(\s)?$/))[1]?m:j.input.length- j[0].length||c==1&&m||j.input.length+(j=s.slice(m).match(/^\S*/)).input.length;}}
return r.join("\n");};String.prototype.addslashes=function(){var str=this;if(str.length>0){str=str.replace(/\'/g,'\\\'');str=str.replace(/\"/g,'\\"');str=str.replace(/\\/g,'\\\\');str=str.replace(/\0/g,'\\0');}
return str;};String.prototype.stripslashes=function(){var str=this;if(str.length>0){str=str.replace(/\\'/g,'\'');str=str.replace(/\\"/g,'"');str=str.replace(/\\\\/g,'\\');str=str.replace(/\\0/g,'\0');}
return str;};String.prototype.escapeQuotesToHtmlEntities=function(){var str=this;if(str.length>0){str=str.replace(/"/g,'&quot;');str=str.replace(/'/g,'&#39;');}
return str;};Array.prototype.unique=function(){var o={},i,l=this.length,r=[];for(i=0;i<l;i++){o[this[i]]=this[i];}
for(i in o){r.push(o[i]);}
return r;};