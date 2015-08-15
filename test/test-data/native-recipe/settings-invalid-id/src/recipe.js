'use strict';

var htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );

exports.run = function( pagehop ) {

	var options = pagehop.getOptions() || [],
		isLocal = ":loc",
		itemText = options.indexOf( isLocal ) === -1 ?
			"It's global search." :
			"It's local search.";

	pagehop.finish( [ {
		text: itemText
	} ] );

};