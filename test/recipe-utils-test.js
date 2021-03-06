/* jshint -W030 */
/* jshint -W068 */

'use strict';

var should = require("should"),
	pathUtils = require('path'),
	fs = require('fs'),
	fork = require('child_process').fork,
	wrench = require("wrench");

var recipeUtils = require("../src/recipe-utils"),
	test = require("../src/tester"),
	CONST = require("../src/const"),
	rootPath = pathUtils.resolve( __dirname, "test-data" );

var recipeLoadsOK = function(rootPath) {
	var result;

	( function() {
		result = recipeUtils.loadRecipe( rootPath );
	} ).should.not.throw();

	( result !== undefined ).should.be.ok;

	result.dirPath.should.equal( rootPath );
	( result.settingsFile !== null ).should.be.ok;

	if ( result.isNative ) {
		result.nativeRecipePath.should.equal( pathUtils.join( rootPath, CONST.NATIVE_RECIPE_FILENAME ) );
	} else {
		result.pageLoopPath.should.equal( pathUtils.join( rootPath, CONST.PAGE_LOOP_FILENAME ) );
		result.scrapePath.should.equal( pathUtils.join( rootPath, CONST.SCRAPE_FILENAME ) );
		( result.pageLoopFile === null ).should.be.ok;
		( result.scrapeFile === null ).should.be.ok;
	}

	return result;
};

describe( "recipeUtils", function() {
	before( function(done) {
		test.init( done );
	} );
	describe( "scaffoldRecipe(path)", function() {
		it( "throws an error if pageLoopPath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-pageloop-exist-file") );
			} ).throw();
		} );
		it( "throws an error if pageLoopPath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-pageloop-exist-file") );
			} ).throw();
		} );
		it( "throws an error if scrapePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-scrape-exist-file") );
			} ).throw();
		} );
		it( "throws an error if scrapePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-scrape-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-settings-exist-file") );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (dir)", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if testDirPath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-testdir-exist-file") );
			} ).throw();
		} );
		it( "throws an error if testDirPath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-testdir-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-licensefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-licensefile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-readmefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-readmefile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-gruntfile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-gruntfile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-jshintfile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-jshintfile-exist-dir") );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "recipe/scaffold-gitignorefile-exist-file") );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (dir)", function() {
			// programmatically create, because npm install has a problem
			// with dirs called .gitignore
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				dirPath = pathUtils.resolve( tempDirPath, ".gitignore" );

			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "successfully scaffolds recipe", function() {
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe");

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath );
			} ).not.throw();

			recipeLoadsOK( tempDirPath );

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
	} );
	describe( "scaffoldRecipe(path, isNative=true)", function() {
		var isNative = true;

		it( "throws an error if recipe.js exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-recipe-js-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if recipe.js exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-recipe-js-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-settings-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if settingsPath exists (dir)", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath, isNative );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if testDirPath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-testdir-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if testDirPath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-testdir-exist-dir"), isNative );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-licensefile-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if licenseFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-licensefile-exist-dir"), isNative );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-readmefile-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if readmeFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-readmefile-exist-dir"), isNative );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-gruntfile-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if gruntFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-gruntfile-exist-dir"), isNative );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-jshintfile-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if jshintFilePath exists (dir)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-jshintfile-exist-dir"), isNative );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (file)", function() {
			should( function() {
				recipeUtils.scaffoldRecipe( pathUtils.resolve( rootPath, "native-recipe/scaffold-gitignorefile-exist-file"), isNative );
			} ).throw();
		} );
		it( "throws an error if gitignoreFilePath exists (dir)", function() {
			// programmatically create, because npm install has a problem
			// with dirs called .gitignore
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				dirPath = pathUtils.resolve( tempDirPath, ".gitignore" );

			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath, isNative );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "successfully scaffolds recipe", function() {
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe");

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );

			should( function() {
				recipeUtils.scaffoldRecipe( tempDirPath, isNative );
			} ).not.throw();

			recipeLoadsOK( tempDirPath, isNative );

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
	} );
	describe( "loadRecipe(path)", function() {
		it( "throws an error if empty dir", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if pageLoop file is missing", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/without-pageloop") );
			} ).should.throw();
		} );
		it( "throws an error if scrape file is missing", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/without-scrape") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				sourceDirPath = pathUtils.resolve( rootPath, "recipe", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.loadRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if pageLoop path is dir", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/with-pageloop-dir") );
			} ).should.throw();
		} );
		it( "throws an error if scrape path is dir", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/with-scrape-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without hasQuery", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-hasquery") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-bool hasQuery", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-hasquery-not-bool") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without homepage prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-homepage") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string homepage", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-homepage-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.options is not array", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-options-not-array") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without keyword", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string keyword", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-keyword-not-string") );
			} ).should.throw();
		} );
		it( "successfully loads a correct recipe", function() {
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/recipe/correct" ) ),
				result = recipeLoadsOK( rootPath );

			result.id.should.equal( "GoogleSearch" );
			result.description.should.equal( "Recipe for the pagehop productivity tool which allows search in Google." );
			result.version.should.equal( "0.1.0" );
			result.options.should.eql(
				[
					{
						"description": "A local search.",
						"keyword": ":loc"
					}
				]
			);
		} );
	} );
	describe( "loadRecipe(path) on native recipe", function() {
		it( "throws an error if empty dir", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if recipe.js file is missing", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/without-recipe-js") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				sourceDirPath = pathUtils.resolve( rootPath, "native-recipe", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.loadRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if recipe.js path is dir", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/with-recipe-js-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without hasQuery", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-hasquery") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-bool hasQuery", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-hasquery-not-bool") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without homepage prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-homepage") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string homepage", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-homepage-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.recipeType", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-recipe-type") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.options is not array", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-options-not-array") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without keyword", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string keyword", function() {
			( function() {
				recipeUtils.loadRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-keyword-not-string") );
			} ).should.throw();
		} );
		it( "successfully loads a correct recipe", function() {
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/native-recipe/correct" ) ),
				result = recipeLoadsOK( rootPath );

			result.isNative.should.be.ok;
			result.id.should.equal( "GoogleSearch" );
			result.description.should.equal( "Recipe for the pagehop productivity tool which allows search in Google." );
			result.version.should.equal( "0.1.0" );
			result.options.should.eql(
				[
					{
						"description": "A local search.",
						"keyword": ":loc"
					}
				]
			);
		} );
	} );
	describe( "loadCompiledRecipe(path)", function() {
		it( "throws an error if empty dir", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if pageLoop file is missing", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/without-pageloop") );
			} ).should.throw();
		} );
		it( "throws an error if scrape file is missing", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/without-scrape") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				sourceDirPath = pathUtils.resolve( rootPath, "recipe", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.loadCompiledRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if pageLoop path is dir", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/with-pageloop-dir") );
			} ).should.throw();
		} );
		it( "throws an error if scrape path is dir", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/with-scrape-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without hasQuery", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-hasquery") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-bool hasQuery", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-hasquery-not-bool") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without homepage prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-without-homepage") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string homepage", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-homepage-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.options is not array", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-options-not-array") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without keyword", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "recipe/settings-option-keyword-not-string") );
			} ).should.throw();
		} );
		it( "successfully loads a correct recipe", function() {
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/recipe/correct" ) );
			var result = recipeUtils.loadCompiledRecipe( rootPath );

			( result !== null ).should.be.ok;
			result.id.should.equal( "GoogleSearch" );
			result.version.should.equal( "0.1.0" );
			result.options.should.eql(
				[
					{
						"description": "A local search.",
						"keyword": ":loc"
					}
				]
			);
			result.dirPath.should.equal( rootPath );
			result.pageLoopPath.should.equal( pathUtils.join( rootPath, CONST.PAGE_LOOP_FILENAME_COMPILED ) );
			result.scrapePath.should.equal( pathUtils.join( rootPath, CONST.SCRAPE_FILENAME_COMPILED ) );
			( result.settingsFile !== null ).should.be.ok;
			( result.pageLoopFile !== null ).should.be.ok;
			( result.scrapeFile !== null ).should.be.ok;
		} );
	} );
	describe( "loadCompiledRecipe(path) on native recipe", function() {
		it( "throws an error if empty dir", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "empty-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is missing", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/without-settings") );
			} ).should.throw();
		} );
		it( "throws an error if recipe file is missing", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/without-recipe-js") );
			} ).should.throw();
		} );
		it( "throws an error if settings path is dir", function() {
			// programmatically create, because npm install has a problem
			// with dirs called package.json
			var tempDirPath = pathUtils.resolve( rootPath, "temp-recipe"),
				sourceDirPath = pathUtils.resolve( rootPath, "recipe", "correct" ),
				dirPath = pathUtils.resolve( tempDirPath, "package.json" );

			wrench.mkdirSyncRecursive( tempDirPath, "0777" );
			wrench.copyDirSyncRecursive( sourceDirPath, tempDirPath, { forceDelete: true } );
			// remove file package.json
			fs.unlinkSync( dirPath );
			// create dir package.json
			wrench.mkdirSyncRecursive( dirPath, "0777" );

			should( function() {
				recipeUtils.loadCompiledRecipe( tempDirPath );
			} ).throw();

			var failSilent = false;
			wrench.rmdirSyncRecursive( tempDirPath, failSilent );
		} );
		it( "throws an error if recipe path is dir", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/with-scrape-dir") );
			} ).should.throw();
		} );
		it( "throws an error if settings file is not json", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-not-json") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no version prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-no-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without hasQuery", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-hasquery") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-bool hasQuery", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-hasquery-not-bool") );
			} ).should.throw();
		} );
		it( "throws an error if settings are without homepage prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-without-homepage") );
			} ).should.throw();
		} );
		it( "throws an error if settings are with non-string homepage", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-homepage-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have no pagehop.id prop", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-no-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.id", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-id") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid pagehop.recipeType", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-recipe-type") );
			} ).should.throw();
		} );
		it( "throws an error if settings have invalid version", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-invalid-version") );
			} ).should.throw();
		} );
		it( "throws an error if settings pagehop.options is not array", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-options-not-array") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-without-description") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-description-not-string") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option without keyword", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-without-keyword") );
			} ).should.throw();
		} );
		it( "throws an error if settings have option with non-string description", function() {
			( function() {
				recipeUtils.loadCompiledRecipe( pathUtils.resolve( rootPath, "native-recipe/settings-option-keyword-not-string") );
			} ).should.throw();
		} );
		it( "successfully loads a correct recipe", function() {
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/native-recipe/correct" ) );
			var result = recipeUtils.loadCompiledRecipe( rootPath );

			( result !== null ).should.be.ok;
			result.id.should.equal( "GoogleSearch" );
			result.isNative.should.be.ok;
			result.version.should.equal( "0.1.0" );
			result.options.should.eql(
				[
					{
						"description": "A local search.",
						"keyword": ":loc"
					}
				]
			);
			result.dirPath.should.equal( rootPath );
			result.nativeRecipePath.should.equal( pathUtils.join( rootPath, "src", CONST.NATIVE_RECIPE_FILENAME ) );
			( result.settingsFile !== null ).should.be.ok;
		} );
	} );
	describe( "compileRecipe(recipe)", function() {
		var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/recipe/correct" ) ),
			recipe = recipeUtils.loadRecipe( rootPath );

		before( function(done) {
			recipeUtils.compileRecipe( recipe, done );
		} );

		it( "successfully compiles recipe's code files", function() {
			recipe.pageLoopFile.should.not.equal( null );
			recipe.scrapeFile.should.not.equal( null );
		} );
		it( "creates an array holding all the files to be stored in the cache", function() {
			( recipe.files !== null ).should.be.ok;
			( recipe.files.length ).should.be.ok;
			recipe.files.length.should.equal( 3 );
			(
				recipe.files[0].hasOwnProperty("name") &&
				recipe.files[1].hasOwnProperty("name") &&
				recipe.files[2].hasOwnProperty("name")
			).should.be.ok;

			( 
				recipe.files[0].hasOwnProperty("data") &&
				recipe.files[1].hasOwnProperty("data") &&
				recipe.files[2].hasOwnProperty("data")
			).should.be.ok;

			recipe.files[0].name.should.equal( CONST.SETTINGS_FILENAME );
			recipe.files[1].name.should.equal( CONST.SCRAPE_FILENAME_COMPILED );
			recipe.files[2].name.should.equal( CONST.PAGE_LOOP_FILENAME_COMPILED );
		} );
		it( "embeds fs.readFileSync resources", function() {
			recipe.pageLoopFile.indexOf( "<img src=\\\"img/image.png\\\"/>" ).should.not.equal( -1 );
			recipe.scrapeFile.indexOf( "<img src=\\\"img/image.png\\\"/>" ).should.not.equal( -1 );
		} );
		it( "doesn't blow-up if cwd is incorrect", function(done) {
			var child = fork( pathUtils.resolve( __dirname, "test-data", "recipe_utils_child_process" ), {
				cwd: pathUtils.resolve( __dirname, "..", ".." )
			} );

			child.on( "exit", function(code) {
				code.should.equal( 0 );
				done();
			} );
		} );

		// past here cases don't reuse the same state

		it( "transpiles EcmaScript 6 code", function(done) {
			var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/es6-recipe" ) ),
				recipe = recipeUtils.loadRecipe( rootPath ),
				expectedCompiledRecipe = recipeUtils.loadCompiledRecipe( rootPath );

			recipeUtils.compileRecipe( recipe, function() {
				recipe.pageLoopFile.indexOf( "<html></html>" ).should.not.equal( -1 );

				recipe.pageLoopFile.should.equal( expectedCompiledRecipe.pageLoopFile );
				recipe.scrapeFile.should.equal( expectedCompiledRecipe.scrapeFile );

				test.pageLoop(
					rootPath,
					function() {
						var query = null,
							options = null,
							max = 200,
							scrapeScript = "irrelevant",
							systemMeta = null,
							hops = [];
						window.pagehop.init( query, options, max, scrapeScript, systemMeta, hops );
					},
					function(urls, result) {
						should.exist( urls );
						should.exist( result );
						urls.length.should.equal( 0 );

						result.items.should.eql( [
							{
								text: "Title1",
								address: "http://example.com/title1",
								preview: "<html></html>"
							},
							{
								text: "Title2",
								address: "http://example.com/title2",
								preview: "<html></html>"
							}
						] );
						done();
					}
				);
			} );
		} );
	} );
	describe( "compileRecipe(recipe) on native recipe", function() {
		var rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/native-recipe/correct" ) ),
			recipe = recipeUtils.loadRecipe( rootPath );

		before( function(done) {
			recipeUtils.compileRecipe( recipe, done );
		} );

		it( "creates an array holding all the files to be stored in the cache", function() {
			( recipe.files !== null ).should.be.ok;
			( recipe.files.length ).should.be.ok;
			recipe.files.length.should.equal( 1 );
			(
				recipe.files[0].hasOwnProperty("name")
			).should.be.ok;

			( 
				recipe.files[0].hasOwnProperty("data")
			).should.be.ok;

			recipe.files[0].name.should.equal( CONST.SETTINGS_FILENAME );
		} );
		it( "doesn't blow-up if cwd is incorrect", function(done) {
			var child = fork( pathUtils.resolve( __dirname, "test-data", "recipe_utils_child_process" ), {
				cwd: pathUtils.resolve( __dirname, "..", ".." )
			} );

			child.on( "exit", function(code) {
				code.should.equal( 0 );
				done();
			} );
		} );

	} );
	describe( "updatePaths(recipe, newPath)", function() {
		it( "should update correctly pageLoopPath and scrapePath", function() {
			var recipe = {
				dirPath: null,
				pageLoopPath: null,
				scrapePath: null
			};
			recipeUtils.updatePaths( recipe, "test" );
			recipe.dirPath.should.equal( pathUtils.normalize( "test" ) );
			recipe.pageLoopPath.should.equal( pathUtils.normalize( "test/page-loop-compiled.js" ) );
			recipe.scrapePath.should.equal( pathUtils.normalize( "test/scrape-compiled.js" ) );
		} );
		it( "should update correctly nativeRecipePath if recipe is native", function() {
			var recipe = {
				isNative: true,
				dirPath: null,
				pageLoopPath: null,
				scrapePath: null
			};
			recipeUtils.updatePaths( recipe, "test" );

			recipe.dirPath.should.equal( pathUtils.normalize( "test" ) );

			recipe.nativeRecipePath.should.equal( pathUtils.normalize( "test/src/recipe.js" ) );
		} );
	} );
	after( function(done) {
		test.finalize( done );
	} );
} );