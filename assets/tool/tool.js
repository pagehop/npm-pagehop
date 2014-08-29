'use strict';

// This sample shows how to make a tool which makes shure
// that result addresses are visible instead of the usual
// description text under the title

// So instead of:
//		1. First item (example.com)
//		description

// The tool will produce:
//		1. First item (example.com)
//		http://example.com/some/otherwise/invisible/inner/path

var currentResults = pagehop.getCurrentResults(),
	results = [];

for ( var i = 0; i < currentResults.length; i++ ) {
	var item = currentResults[i];
	if ( item.address ) {
		item.displayAddress = item.address;
		results.push( item );
	}
}

pagehop.finish( results );