/**
 *	Generic javascript functions
 *
 *	@copyright Fronter (2006)
 *	@package questiontest
 */
function toggle( id ) {
	showHide( id );
}
function showHide( id ) {
	var el = document.getElementById( id );
	if( el ) {
		if( el.style.display == "none" ) {
			el.style.display = "";
		} else {
			el.style.display = "none";
		}
	}
}
function hideAll( arr ) {
	for( var i = 0; i < arr.length; i++ ) {
		var el = document.getElementById( arr[i] );
		if( el ) {
			el.style.display = "none";
		}
	}
}
function getElementByClassName( classname )	{
	var inc = 0;
	var ret = new Array();
	var alltags = document.all ? document.all : document.getElementsByTagName( "*" );
	for( i = 0; i < alltags.length; i++ ) {
		if( alltags[i].className == classname ) {
			ret[inc++] = alltags[i];
		}
	}
	return ret;
}
if( !document.trim ) {
	function trim( str ){
		if( !str ) {
			return '';
		}
		return str.replace(/^\s*|\s*$/g,"");
	}
}