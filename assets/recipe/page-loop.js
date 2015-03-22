'use strict';

var options = pagehop.getOptions() || [],
	OPTION_NAME_CONST = ":optionName",
	urlTemplate = options.indexOf( OPTION_NAME_CONST ) === -1 ?
		'http://example.com/?q=%s' :
		'http://withoption.example.com/?q=%s',
	query = encodeURIComponent( pagehop.getQuery() ),
	url = urlTemplate.replace( "%s", query );

pagehop.scrape( url, function(error, result) {

	if ( error ) {
		pagehop.finishWithError( error );
	}

	pagehop.getHops().push( {
		text: "RecipeName",
		address: "http://example.com"
	} );

	pagehop.finish( result );

} );