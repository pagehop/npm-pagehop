'use strict';

var pathUtils = require('path'),
	fs = require('fs'),
	semver = require("semver"),
	browserify = require("browserify"),
	commonUtils = require("./common-utils");

var CONST = require("./const");

var toolUtils = {

	scaffoldTool: function(path) {
		var packageJsonPath = pathUtils.join( path, CONST.SETTINGS_FILENAME ),
			toolPath = pathUtils.join( path, CONST.TOOL_FILENAME ),
			testDirPath = pathUtils.join( path, CONST.TEST_DIR_NAME ),
			licenseFilePath = pathUtils.join( path, CONST.LICENSE_FILE_NAME ),
			readmeFilePath = pathUtils.join( path, CONST.README_FILE_NAME ),
			gruntFilePath = pathUtils.join( path, CONST.GRUNT_FILE_NAME ),
			jshintFilePath = pathUtils.join( path, CONST.JSHINTRC_FILE_NAME ),
			gitignoreFilePath = pathUtils.join( path, CONST.GITIGNORE_FILE_NAME );

		if (
			fs.existsSync( packageJsonPath )	||
			fs.existsSync( toolPath )			||
			fs.existsSync( testDirPath )		||
			fs.existsSync( licenseFilePath )	||
			fs.existsSync( readmeFilePath )		||
			fs.existsSync( gruntFilePath )		||
			fs.existsSync( jshintFilePath )		||
			fs.existsSync( gitignoreFilePath )
		) {
			throw new Error( "The dir contains dirs and/or files with names colliding with the default tool template" );
		}

		var templateToolPath = pathUtils.resolve( __dirname, "..", "assets", "tool" );

		commonUtils.copyDirContentSync( templateToolPath, path );
	},

	loadTool: function(path) {
		var self = this,
			dontLoadFiles = true;

		return self._loadTool( path, CONST.TOOL_FILENAME, dontLoadFiles );
	},

	loadCompiledTool: function(path) {
		var self = this;

		return self._loadTool( path, CONST.TOOL_FILENAME_COMPILED );
	},

	_loadTool: function( path, toolFileName, dontLoadFiles ) {
		var self = this,
			result = {
				id: null,
				keyword: null,
				hasArgument: false,
				description: null,
				version: null,
				homepage: null,

				dirPath:null,
				toolPath:null,

				settingsFile: null,
				toolFile: null
			};

		var packageJsonPath = pathUtils.join( path, CONST.SETTINGS_FILENAME ),
			toolPath = pathUtils.join( path, toolFileName );

		if ( !fs.existsSync( packageJsonPath ) ) {
			throw new Error( CONST.SETTINGS_FILENAME + " is missing!" );
		}
		if ( !fs.existsSync( toolPath ) ) {
			throw new Error( CONST.TOOL_FILENAME + " is missing!" );
		}

		result.dirPath = path;
		result.toolPath = toolPath;

		if ( !fs.statSync( packageJsonPath ).isFile() ) {
			throw new Error( packageJsonPath + " exists, but it's not a file!" );
		}
		if ( !fs.statSync( toolPath ).isFile() ) {
			throw new Error( toolPath + " exists, but it's not a file!" );
		}

		var packageJson = fs.readFileSync( packageJsonPath, "utf-8" ),
			settings;
		result.settingsFile = packageJson;
		try {
			settings = JSON.parse( packageJson );
		} catch(err) {}
		self.areSettingsValid( settings );

		result.id = settings.pagehop.id;
		result.keyword = settings.pagehop.keyword;
		result.hasArgument = settings.pagehop.hasArgument;
		result.description = settings.description;
		result.version = settings.version;
		result.homepage = settings.homepage;

		if ( !dontLoadFiles ) {
			result.toolFile = fs.readFileSync( toolPath, "utf-8" );
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
		if ( !self.isValidMandatoryString( settings.pagehop.keyword ) ) {
			throw new Error( errorMessageTemplate + "pagehop.keyword is either missing or not a string!" );
		}
		if ( !settings.pagehop.keyword.match( CONST.TOOL_LEXEME_REGEX ) ) {
			throw new Error( errorMessageTemplate +
				"pagehop.keyword is not in the allowed format - should follow this regex %r!"
					.replace( "%r", CONST.TOOL_LEXEME_REGEX )  );
		}
		if ( !self.isValidMandatoryBool( settings.pagehop.hasArgument ) ) {
			throw new Error( errorMessageTemplate + "pagehop.hasArgument property is missing or not a bool!" );
		}
	},

	isValidMandatoryString: function(value) {
		return value && typeof value === "string";
	},

	isValidMandatoryBool: function(value) {
		return typeof value === "boolean";
	},

	compileTool: function( tool, callback ) {
		tool.files = [];

		tool.files.push( {
			name: CONST.SETTINGS_FILENAME,
			data: tool.settingsFile
		} );

		var b = browserify(),
			brfsOpts = {
				basedir: pathUtils.resolve( __dirname, "node_modules", "pagehop" )
			};
		b.add( tool.toolPath );
		b.transform( "brfs", brfsOpts );
		var readable = b.bundle();
		var data = "";
		readable.on('data', function(chunk) {
			data += chunk;
		});
		readable.on('end', function() {
			tool.toolFile = data;
			tool.files.push( {
				name: CONST.TOOL_FILENAME_COMPILED,
				data: tool.toolFile
			} );
			callback();
		});
	},

	updatePaths: function( tool, newPath ) {
		tool.dirPath = newPath;
		tool.toolPath = pathUtils.join( newPath, CONST.TOOL_FILENAME_COMPILED );
	}

};

module.exports = toolUtils;