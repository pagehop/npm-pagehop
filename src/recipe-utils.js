'use strict';

var pathUtils = require('path'),
	fs = require('fs'),
	semver = require("semver"),
	browserify = require("browserify"),
	commonUtils = require("./common-utils");

var CONST = require("./const");

var recipeUtils = {

	scaffoldRecipe: function(path) {
		var packageJsonPath = pathUtils.join( path, CONST.SETTINGS_FILENAME ),
			pageLoopPath = pathUtils.join( path, CONST.PAGE_LOOP_FILENAME ),
			scrapePath = pathUtils.join( path, CONST.SCRAPE_FILENAME ),
			testDirPath = pathUtils.join( path, CONST.TEST_DIR_NAME ),
			licenseFilePath = pathUtils.join( path, CONST.LICENSE_FILE_NAME ),
			readmeFilePath = pathUtils.join( path, CONST.README_FILE_NAME ),
			gruntFilePath = pathUtils.join( path, CONST.GRUNT_FILE_NAME ),
			jshintFilePath = pathUtils.join( path, CONST.JSHINTRC_FILE_NAME ),
			gitignoreFilePath = pathUtils.join( path, CONST.GITIGNORE_FILE_NAME );

		if (
			fs.existsSync( packageJsonPath )	||
			fs.existsSync( pageLoopPath )		||
			fs.existsSync( scrapePath )			||
			fs.existsSync( testDirPath )		||
			fs.existsSync( licenseFilePath )	||
			fs.existsSync( readmeFilePath )		||
			fs.existsSync( gruntFilePath )		||
			fs.existsSync( jshintFilePath )		||
			fs.existsSync( gitignoreFilePath )
		) {
			throw new Error( "The dir contains dirs and/or files with names colliding with the default recipe template" );
		}

		var templateRecipePath = pathUtils.resolve( __dirname, "..", "assets", "recipe" );

		commonUtils.copyDirContentSync( templateRecipePath, path );
	},

	loadRecipe: function(path) {
		var self = this,
			dontLoadFiles = true;

		return self._loadRecipe( path, CONST.PAGE_LOOP_FILENAME, CONST.SCRAPE_FILENAME, dontLoadFiles );
	},

	loadCompiledRecipe: function(path) {
		var self = this;

		return self._loadRecipe( path, CONST.PAGE_LOOP_FILENAME_COMPILED, CONST.SCRAPE_FILENAME_COMPILED );
	},

	_loadRecipe: function( path, pageLoopFileName, scrapeFileName, dontLoadFiles ) {
		var self = this,
			result = {
				id: null,
				description: null,
				version: null,
				homepage: null,
				options: [],
				hasQuery: false,

				pageLoopPath:null,
				scrapePath: null,

				settingsFile: null,
				pageLoopFile: null,
				scrapeFile: null
			};

		var packageJsonPath = pathUtils.join( path, CONST.SETTINGS_FILENAME ),
			pageLoopPath = pathUtils.join( path, pageLoopFileName ),
			scrapePath = pathUtils.join( path, scrapeFileName );

		if ( !fs.existsSync( packageJsonPath ) ) {
			throw new Error( CONST.SETTINGS_FILENAME + " is missing!" );
		}
		if ( !fs.existsSync( pageLoopPath ) ) {
			throw new Error( CONST.PAGE_LOOP_FILENAME + " is missing!" );
		}
		if ( !fs.existsSync( scrapePath ) ) {
			throw new Error( CONST.SCRAPE_FILENAME + " is missing! Even if you don't use it, the file is required." );
		}

		result.pageLoopPath = pageLoopPath;
		result.scrapePath = scrapePath;

		if ( !fs.statSync( packageJsonPath ).isFile() ) {
			throw new Error( packageJsonPath + " exists, but it's not a file!" );
		}
		if ( !fs.statSync( pageLoopPath ).isFile() ) {
			throw new Error( pageLoopPath + " exists, but it's not a file!" );
		}
		if ( !fs.statSync( scrapePath ).isFile() ) {
			throw new Error( scrapePath + " exists, but it's not a file!" );
		}

		var packageJson = fs.readFileSync( packageJsonPath, "utf-8" ),
			settings;
		result.settingsFile = packageJson;
		try {
			settings = JSON.parse( packageJson );
		} catch(err) {}
		self.areSettingsValid( settings );

		result.id = settings.pagehop.id;
		result.description = settings.description;
		result.version = settings.version;
		result.homepage = settings.homepage;
		result.options = settings.pagehop.options;
		result.hasQuery = settings.pagehop.hasQuery;

		if ( !dontLoadFiles ) {
			result.pageLoopFile = fs.readFileSync( pageLoopPath, "utf-8" );
			result.scrapeFile = fs.readFileSync( scrapePath, "utf-8" );
		}

		return result;
	},

	areSettingsValid: function(settings) {
		var self = this,
			errorMessageTemplate = "package.json error: ";

		if ( !settings ) {
			throw new Error( errorMessageTemplate + "json file is either malformed or empty!" );
		}
		if ( !settings.version ) {
			throw new Error( errorMessageTemplate + "'version' is missing!" );
		}
		if ( !semver.valid( settings.version ) ) {
			throw new Error( errorMessageTemplate + "'version' is not valid!" );
		}
		if ( !self.isValidMandatoryString( settings.homepage ) ) {
			throw new Error( errorMessageTemplate + "'homepage' property is missing or not a string!" );
		}
		if ( !self.isValidMandatoryString( settings.description ) ) {
			throw new Error( errorMessageTemplate + "'description' property is missing or not a string!" );
		}
		if ( !settings.pagehop ) {
			throw new Error( errorMessageTemplate + "'pagehop' section is missing!" );
		}
		if( !self.isValidMandatoryString( settings.pagehop.id ) ) {
			throw new Error( errorMessageTemplate + "pagehop.id property is missing or not a string!" );
		}
		if ( !self.isValidMandatoryBool( settings.pagehop.hasQuery ) ) {
			throw new Error( errorMessageTemplate + "pagehop.hasQuery property is missing or not a bool!" );
		}
		self.areOptionsValid( settings.pagehop.options );
	},

	areOptionsValid: function(options) {
		var self = this,
			errorMessageTemplate = "package.json error: pagehop.options: ";

		if ( options && !( options instanceof Array ) ) {
			throw new Error( errorMessageTemplate + "options should be array!" );
		}

		if ( options ) {
			for ( var i = 0; i < options.length; i++ ) {
				var option = options[i];
				if ( !self.isValidMandatoryString( option.description ) ) {
					throw new Error( errorMessageTemplate +
						"options[%i].description is either missing or not a string!".replace( "%i", (i + 1) ) );
				}
				if ( !self.isValidMandatoryString( option.keyword ) ) {
					throw new Error( errorMessageTemplate +
						"options[%i].keyword is either missing or not a string!".replace( "%i", (i + 1) ) );
				}
				if ( !option.keyword.match( CONST.TOOL_LEXEME_REGEX ) ) {
					throw new Error( errorMessageTemplate +
						"options[%i].keyword is not in the allowed format - should follow this regex %r!"
							.replace( "%i", (i + 1) )
							.replace( "%r", CONST.TOOL_LEXEME_REGEX ) );
				}
			}
		}
	},

	isValidMandatoryString: function(value) {
		return value && typeof value === "string";
	},

	isValidMandatoryBool: function(value) {
		return typeof value === "boolean";
	},

	compileRecipe: function( recipe, callback ) {
		var asyncTasksCount = 2,
			tryFinishMethod = function() {
				if ( --asyncTasksCount === 0 ) {
					callback();
				}
			};

		recipe.files = [];

		recipe.files.push( {
			name: CONST.SETTINGS_FILENAME,
			data: recipe.settingsFile
		} );
// how is the state of browserify flushed???
( function(){
		var b = browserify();
		b.add( recipe.pageLoopPath );
		b.transform( "brfs" );
		var readable = b.bundle();
		var data = "";
		readable.on('data', function(chunk) {
			data += chunk;
		});
		readable.on('end', function() {
			recipe.pageLoopFile = data;
			recipe.files.push( {
				name: CONST.PAGE_LOOP_FILENAME_COMPILED,
				data: recipe.pageLoopFile
			} );
			tryFinishMethod();
		});
} )();
		var newB = browserify();
		newB.transform( "brfs" );
		newB.add( recipe.scrapePath );
		var newReadable = newB.bundle();
		var data = "";
		newReadable.on('data', function(chunk) {
			data += chunk;
		});
		newReadable.on('end', function() {
			recipe.scrapeFile = data;
			recipe.files.push( {
				name: CONST.SCRAPE_FILENAME_COMPILED,
				data: recipe.scrapeFile
			} );
			tryFinishMethod();
		} );
	},

	updatePaths: function( recipe, newPath ) {
		recipe.pageLoopPath = pathUtils.join( newPath, CONST.PAGE_LOOP_FILENAME_COMPILED );
		recipe.scrapePath = pathUtils.join( newPath, CONST.SCRAPE_FILENAME_COMPILED );
	}

};

module.exports = recipeUtils;