'use strict';

var pathUtils = require('path'),
	recipeUtils = require("../../src/recipe-utils");

var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "recipe/correct" ) ),
	recipe = recipeUtils.loadRecipe( rootPath );

recipeUtils.compileRecipe( recipe, function() {
	process.exit( 0 )
} );