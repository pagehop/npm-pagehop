'use strict';

var OS = "X";

var CONST = {

	TOOL_LEXEME_REGEX:				/^:([A-Z]|[a-z])+([0-9])*$/g,

	SETTINGS_FILENAME:				"package.json",
	PAGE_LOOP_FILENAME_COMPILED:	"page-loop-compiled.js",
	SCRAPE_FILENAME_COMPILED:		"scrape-compiled.js",
	TOOL_FILENAME_COMPILED:			"tool-compiled.js",
	PAGE_LOOP_FILENAME:				"page-loop.js",
	SCRAPE_FILENAME:				"scrape.js",
	TOOL_FILENAME:					"tool.js",

	TEST_DIR_NAME:					"test",
	LICENSE_FILE_NAME:				"LICENSE-MIT",
	README_FILE_NAME:				"README.md",
	GRUNT_FILE_NAME:				"Gruntfile.js",
	JSHINTRC_FILE_NAME:				".jshintrc",
	GITIGNORE_FILE_NAME:			".gitignore"

};


// resolve os-specific consts

for ( var propName in CONST ) {
	if ( propName.search( "OS_" ) === 0 ) {
		var prefix = "OS_" + OS + "_";
		if ( propName.search( prefix ) === 0 ) {
			var value = CONST[propName];
			delete CONST[propName];
			propName = propName.replace( prefix, "" );
			CONST[propName] = value;
		} else {
			delete CONST[propName];
		}
	}
}

module.exports = CONST;