#! /usr/bin/env node

"use strict";

var pathUtils = require('path'),
	fs = require('fs'),
	module = require("../"),
	recipeUtils = module.recipeUtils,
	toolUtils = module.toolUtils,
	optionParser = require("nomnom"),
	coolors = require("coolors"),
	noOptionsErrorMessage = coolors( "No option specified. ", "bold" ) + "Run with ' --help' to check how to use this command";

optionParser.command( "recipe" )
	.option( "init", {
		flag: true,
		abbr: "i",
		help: "scaffold a recipe project (in the current dir, if no path is passed)"
	} )
	.option( "validate", {
		flag: true,
		abbr: "v",
		help: "validates the structure of a recipe (validates current dir's content, if no path is passed)"
	} )
	.option( "path", {
		abbr: "p",
		help: "path to the recipe's dir (if not passed - path is considered the current dir)"
	} )
	.callback( function(opts) {
		execRecipeCommand( opts );
	} )
	.help( "recipe related commands" );

optionParser.command( "tool" )
	.option( "init", {
		flag: true,
		abbr: "i",
		help: "scaffold a tool project (in the current dir, if no path is passed)"
	} )
	.option( "validate", {
		flag: true,
		abbr: "v",
		help: "validates the structure of a tool (validates current dir's content, if no path is passed)"
	} )
	.option( "path", {
		abbr: "p",
		help: "path to the tool's dir (if not passed - path is considered the current dir)"
	} )
	.callback( function(opts) {
		execToolCommand( opts );
	} )
	.help( "tool related commands" );

optionParser.parse();

function execInTryCatch( lambda, errorType, successMessage ) {
	try {
		lambda();
	} catch(exception) {
		return console.log(
			coolors( "X", "red" ) + " " + 
			coolors( errorType + ":", "bold" ) + " " +
			coolors( exception.message, "red" ) );
	}
	console.log( coolors( "√", "green" ) + " " + coolors( successMessage, "bold" ) );
}

function execCommand(opts, scaffoldLambda, validateLambda) {
	var path = pathUtils.resolve( ( opts.path ) ? opts.path : "." );

	if ( opts.init ) {
		execInTryCatch( function() { scaffoldLambda( path ); }, "Init Error", "Successfull init!" );
	} else if ( opts.validate ) {
		execInTryCatch( function() { validateLambda( path ); }, "Validation Error", "Valid!" );
	} else {
		console.log( coolors( "!", "yellow" ) + " " + noOptionsErrorMessage );
	}
}

function execRecipeCommand(opts) {
	execCommand(
		opts,
		recipeUtils.scaffoldRecipe.bind( recipeUtils ),
		recipeUtils.loadRecipe.bind( recipeUtils )
	);
}

function execToolCommand(opts) {
	execCommand(
		opts,
		toolUtils.scaffoldTool.bind( toolUtils ),
		toolUtils.loadTool.bind( toolUtils )
	);
}