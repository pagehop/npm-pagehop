'use strict';

var pathUtils = require('path'),
	toolUtils = require("../../src/tool-utils");

var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "tool/correct" ) ),
	tool = toolUtils.loadTool( rootPath );

toolUtils.compileTool( tool, function() {
	process.exit( 0 )
} );