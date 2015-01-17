/* jshint -W030 */
/* jshint -W068 */

'use strict';

var should = require("should"),
	pathUtils = require('path'),
	fs = require('fs'),
	wrench = require("wrench");

var recipeUtils = require("../src/recipe-utils"),
	CONST = require("../src/const"),
	rootPath = pathUtils.resolve( __dirname, "test-data" );

var recipeLoadsOK = function(rootPath) {
	var result;

	( function() {
		result = recipeUtils.loadRecipe( rootPath );
	} ).should.not.throw();

	( result !== undefined ).should.be.ok;

	result.pageLoopPath.should.equal( pathUtils.join( rootPath, CONST.PAGE_LOOP_FILENAME ) );
	result.scrapePath.should.equal( pathUtils.join( rootPath, CONST.SCRAPE_FILENAME ) );
	( result.settingsFile !== null ).should.be.ok;
	( result.pageLoopFile === null ).should.be.ok;
	( result.scrapeFile === null ).should.be.ok;

	return result;
};

describe( "recipeUtils", function() {
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
			result.pageLoopPath.should.equal( pathUtils.join( rootPath, CONST.PAGE_LOOP_FILENAME_COMPILED ) );
			result.scrapePath.should.equal( pathUtils.join( rootPath, CONST.SCRAPE_FILENAME_COMPILED ) );
			( result.settingsFile !== null ).should.be.ok;
			( result.pageLoopFile !== null ).should.be.ok;
			( result.scrapeFile !== null ).should.be.ok;
		} );
	} );
	describe( "compileRecipe(recipe)", function() {
		var compiled = false,
			rootPath = pathUtils.resolve( pathUtils.join( __dirname, "test-data/recipe/correct" ) ),
			recipe = recipeUtils.loadRecipe( rootPath );

		recipeUtils.compileRecipe( recipe, function() {
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

		it( "successfully compiles recipe's code files", function() {
			recipe.pageLoopFile.should.not.equal( null );
			recipe.scrapeFile.should.not.equal( null );
		} );
		it( "creates an array holding all the files to be stored in the cache", function() {
			( recipe.files !== null ).should.be.ok;
			( recipe.files.length ).should.be.ok;
			recipe.files.length.should.equal( 3 );
			( recipe.files[0].hasOwnProperty("name") &&
				recipe.files[1].hasOwnProperty("name") &&
				recipe.files[2].hasOwnProperty("name") ).should.be.ok;
			( recipe.files[0].hasOwnProperty("data") &&
				recipe.files[1].hasOwnProperty("data") &&
				recipe.files[2].hasOwnProperty("data") ).should.be.ok;
			recipe.files[0].name.should.equal( CONST.SETTINGS_FILENAME );
			recipe.files[1].name.should.equal( CONST.SCRAPE_FILENAME_COMPILED );
			recipe.files[2].name.should.equal( CONST.PAGE_LOOP_FILENAME_COMPILED );
		} );
	} );
	describe( "updatePaths(recipe, newPath)", function() {
		it( "should update correctly pageLoopPath and scrapePath", function() {
			var recipe = {
				pageLoopPath: null,
				scrapePath: null
			};
			recipeUtils.updatePaths( recipe, "test" );
			recipe.pageLoopPath.should.equal( pathUtils.normalize( "test/page-loop-compiled.js" ) );
			recipe.scrapePath.should.equal( pathUtils.normalize( "test/scrape-compiled.js" ) );
		} );
	} );
} );