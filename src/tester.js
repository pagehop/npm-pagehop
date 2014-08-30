/*jshint evil:true */
/*jshint -W068 */

'use strict';

var pathUtils = require('path'),
	fs = require('fs'),
	Boxtree = require("boxtree").Boxtree,
	recipeUtils = require("./recipe-utils"),
	toolUtils = require("./tool-utils"),
	numberOfPages = 50,
	pageLoopApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "page-loop.js" ), "utf-8" ),
	scrapeApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "scrape.js" ), "utf-8" ),
	toolApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "tool.js" ), "utf-8" );

var test = {

	boxtree: null,

	init: function(callback) {
		var self = this;

		self.boxtree = new Boxtree(
			null,
			numberOfPages,
			2
		);
		self.boxtree.init( function() {
			callback();
		} );
	},

	scrape: function(recipePath, pagePath, arg0, arg1) {
		var self = this,
			boxtree = self.boxtree,
			recipeSpec = recipeUtils.loadRecipe( recipePath ),
			runsCount = 0,
			preScrape = ( arg1 !== undefined ) ? arg0 : "function() {}",
			callback = ( arg1 !== undefined ) ? arg1 : arg0;

		recipeUtils.compileRecipe( recipeSpec, function() {
			boxtree.reserveBox( function(box) {
				box
					.setUrl( pagePath )
					.addScript( scrapeApi )
					.addScript( "( " + ( function() {
						window.pagehop.finish = function(result) {
							window.boxApi.emitEvent( "finish", result );
						};
					} ) + " )();" )
					.addScript( "( " + preScrape + " )();" )
					.addScript( recipeSpec.scrapeFile )
					.on( "finish", function(result) {
						boxtree.releaseBox( box );
						callback( result );
					} )
					.on( "error", function(error) {
						if ( error.type === "systemError" && ++runsCount < 3 ) {
							console.log("system error");
							box.run();
						} else {
							boxtree.releaseBox( box );
							console.log( "testScrape: Error: " + JSON.stringify(error) );
							callback();
						}
					} )
					.run();
			} );
		} );
	},

	pageLoop: function(recipePath, preLoop, arg0, arg1) {
		var self = this,
			boxtree = self.boxtree,
			recipeSpec = recipeUtils.loadRecipe( recipePath ),
			urls = [],
			runsCount = 0,
			callback = arg1 ? arg1 : arg0,
			intermediateResults = arg0 instanceof Array ? arg0 : [];

		recipeUtils.compileRecipe( recipeSpec, function() {
			boxtree.reserveBox( function(box) {
				box
					.addScript( pageLoopApi )
					.addScript( "(" + (new Function( "(" + function(intermediateResults) {
						window.pagehop.scrape = function(url, callback) {
							window.boxApi.emitEvent( "scrape", url );

							if ( intermediateResults.length ) {
								var result = intermediateResults.splice( 0, 1 )[0];
								callback( result.error, result.result );
							} else {
								callback( null, [] );
							}
						};
					} + ")(" + JSON.stringify(intermediateResults) + ");" ) ) + ")();" )
					.addScript( "( " + preLoop + " )();" )
					.addScript( recipeSpec.pageLoopFile )
					.on( "scrape", function(url) {
						urls.push( url );
					} )
					.on( "finish", function(result) {
						boxtree.releaseBox( box );
						callback( urls, result );
					} )
					.on( "error", function(error) {
						if ( error.type === "systemError" && ++runsCount < 3 ) {
							console.log("system error");
							box.run();
						} else {
							boxtree.releaseBox( box );
							console.log( "testPageLoop: Error: " + JSON.stringify(error) );
							callback( error );
						}
					} )
					.run();
			} );
		} );
	},

	tool: function(toolPath, preTool, callback) {
		var self = this,
			boxtree = self.boxtree,
			toolSpec = toolUtils.loadTool( toolPath ),
			runsCount = 0;

		toolUtils.compileTool( toolSpec, function() {
			boxtree.reserveBox( function(box) {
				box
					.addScript( toolApi )
					.addScript( "( " + preTool + " )();" )
					.addScript( toolSpec.toolFile )
					.on( "finish", function(result) {
						boxtree.releaseBox( box );
						callback( result );
					} )
					.on( "error", function(error) {
						if ( error.type === "systemError" && ++runsCount < 3 ) {
							console.log("system error");
							box.run();
						} else {
							boxtree.releaseBox( box );
							console.log( "testPageLoop: Error: " + JSON.stringify(error) );
							callback( error );
						}
					} )
					.run();
			} );
		} );
	},

	finalize: function(callback) {
		var self = this;
		self.boxtree.finalize( callback );
	}

};

module.exports = test;