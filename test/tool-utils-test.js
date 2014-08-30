/* jshint -W030 */
/* jshint -W068 */

'use strict';

var should = require("should"),
	pathUtils = require('path'),
	fs = require('fs'),
	wrench = require("wrench");

var toolUtils = require("../src/tool-utils"),
	CONST = require("../src/const"),
	rootPath = pathUtils.resolve( __dirname, "test-data" );

var toolLoadsOK = function(rootPath) {
	var result;

	( function() {
		result = toolUtils.loadTool( rootPath );
	} ).should.not.throw();

	( result !== null ).should.be.ok;
	( result.settingsFile !== null ).should.be.ok;
	( result.toolFile === null ).should.be.ok;
	result.toolPath.should.equal( pathUtils.join( rootPath, CONST.TOOL_FILENAME ) );

	return result;
};

describe( 'toolUtils', function(){
	describe( "scaffoldTool(path)", function() {
		it( "throws an error if toolFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-toolfile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if toolFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-toolfile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-settings-exist-file") );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (dir)", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-tool"),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				toolUtils.scaffoldTool( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if testDirPath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-testdir-exist-file") );
			} ).throw();
		} );
		it( "throws an error if testDirPath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-testdir-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-licensefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-licensefile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-readmefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-readmefile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-gruntfile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-gruntfile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-jshintfile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-jshintfile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (file)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-gitignorefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (dir)", function() {
			should( function() {
				toolUtils.scaffoldTool( pathUtils.resolve( rootPath, "tool/scaffold-gitignorefile-exist-dir") );
			} ).throw();
		} );
		it( "successfully scaffolds tool", function() {
			var tempDirPath = pathUtils.resolve( rootPath, "temp-tool");

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );

			should( function() {
				toolUtils.scaffoldTool( tempDirPath );
			} ).not.throw();

			toolLoadsOK( tempDirPath );

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
	} );
	describe( 'loadTool(path)', function(){
		it( "throws an error if empty dir", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if tool file is missing", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/without-tool") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function(){
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-tool"),
				sourceDirPath = pathUtils.resolve( rootPath, "tool", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				toolUtils.loadTool( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if tool path is dir", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/with-tool-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without homepage", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-without-homepage") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string homepage", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-homepage-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.keyword is not defined", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.keyword is not string", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-keyword-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.hasArgument is not defined", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-without-hasargument") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.hasArgument is not bool", function(){
			( function() {
				toolUtils.loadTool( pathUtils.resolve( rootPath, "tool/settings-hasargument-not-bool") );
			} ).should.throw();
		} );
		it( "successfully loads a correct tool", function(){
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/tool/correct" ) ),
				result = toolLoadsOK( rootPath );

			result.id.should.equal( "FuzzySearch" );
			result.description.should.equal( "Tool allowing fuzzy search on results." );
			result.version.should.equal( "0.1.0" );
			result.keyword.should.equal( ":f" );
		} );
	} );
	describe( 'loadCompiledTool(path)', function(){
		it( "throws an error if empty dir", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if tool file is missing", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/without-pageloop") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function(){
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-tool"),
				sourceDirPath = pathUtils.resolve( rootPath, "tool", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				toolUtils.loadCompiledTool( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if tool path is dir", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/with-tool-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.keyword is not defined", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.keyword is not string", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-keyword-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.hasArgument is not defined", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-without-hasargument") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.hasArgument is not bool", function(){
			( function() {
				toolUtils.loadCompiledTool( pathUtils.resolve( rootPath, "tool/settings-hasargument-not-bool") );
			} ).should.throw();
		} );
		it( "successfully loads a correct tool", function(){
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/tool/correct" ) );
			var result = toolUtils.loadCompiledTool( rootPath );

			( result !== null ).should.be.ok;
			result.id.should.equal( "FuzzySearch" );
			result.version.should.equal( "0.1.0" );
			result.keyword.should.equal( ":f" );
			result.toolPath.should.equal( pathUtils.join( rootPath, CONST.TOOL_FILENAME_COMPILED ) );
			( result.settingsFile !== null ).should.be.ok;
			( result.toolFile !== null ).should.be.ok;
		} );
	} );
	describe( 'compileTool(tool)', function(){
		var compiled = false,
			rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/tool/correct" ) ),
			tool = toolUtils.loadTool( rootPath ),
			srcToolFile = tool.toolFile;

		toolUtils.compileTool( tool, function() {
			compiled = true;
		} );
		var checkCompiled = function(done) {
			if ( compiled ) {
				done();
			} else {
				setTimeout( function() {
					checkCompiled( done );
				}, 0 );
			}
		};
		before( function(done) {
			checkCompiled( done );
		} );

		it( "successfully compiles tool's code file", function(){
			( srcToolFile !== tool.toolFile).should.be.ok;
		} );
		it( "creates an array holding all the files to be stored in the cache", function(){
			( tool.files !== null ).should.be.ok;
			( tool.files.length ).should.be.ok;
			tool.files.length.should.equal( 2 );
			(
				tool.files[0].hasOwnProperty("name") && tool.files[1].hasOwnProperty("name")
			).should.be.ok;
			(
				tool.files[0].hasOwnProperty("data") && tool.files[1].hasOwnProperty("data")
			).should.be.ok;
			tool.files[0].name.should.equal( CONST.SETTINGS_FILENAME );
			tool.files[1].name.should.equal( CONST.TOOL_FILENAME_COMPILED );
		} );
	} );
	describe( 'updatePaths(tool, newPath)', function() {
		it( "should update correctly pageLoopPath and scrapePath", function() {
			var tool = {
				pageLoopPath: null,
				scrapePath: null
			};
			toolUtils.updatePaths( tool, "test" );
			tool.toolPath.should.equal( "test/tool-compiled.js" );
		} );
	} );
} );