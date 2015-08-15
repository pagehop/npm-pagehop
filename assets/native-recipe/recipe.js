'use strict';

exports.run = function( pagehop ) {

	var options = pagehop.getOptions() || [],
		OPTION_NAME_CONST = ":optionName",
		itemText = options.indexOf( OPTION_NAME_CONST ) === -1 ?
			"No option was passed." :
			"Option is passed!";

	pagehop.finish( [ {
		text: itemText
	} ] );

};