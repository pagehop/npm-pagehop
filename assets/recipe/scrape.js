'use strict';

var items = Array.prototype.slice.call( document.querySelectorAll( ".result" ) ).map( function(element) {

	return {
		text: element.text,
		address: element.href
	};

} );

pagehop.finish( items );