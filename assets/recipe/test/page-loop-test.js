'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToRecipe = pathUtils.resolve( __dirname, '../' );

var generateResults = function(size) {
	return Array.apply( null, new Array( size ) ).map( function() {
		return {
			text: "text",
			address: "address"
		};
	} );
};

describe("recipe-name's pageLoop",function(){
	this.timeout( 10000 );
	before( function(done) {
		test.init( done );
	} );
	describe( "number of pages to be scraped", function() {
		it( "scrape 1 page, if maxCount=30", function(done){
			var intermediateResults = [
				{
					result: generateResults( 30 )
				}
			];

			test.pageLoop(
				pathToRecipe,
				function() {
					var query = "irrelevant",
						options = [],
						max = 30,
						scrapeScript = "irrelevant";
					pagehop.init( query, options, max, scrapeScript );
				},
				intermediateResults,
				function(urls, result) {
					should.exist( urls );
					should.exist( result );
					urls.length.should.equal( 1 );
					result.length.should.equal( 30 );
					done();
				}
			);
		});
		it( "scrape 1 page, if maxCount=100", function(done){
			var intermediateResults = [
				{
					result: generateResults( 89 )
				}
			];

			test.pageLoop(
				pathToRecipe,
				function() {
					var query = "irrelevant",
						options = [],
						max = 100,
						scrapeScript = "irrelevant";
					pagehop.init( query, options, max, scrapeScript );
				},
				intermediateResults,
				function(urls, result) {
					should.exist( urls );
					should.exist( result );
					urls.length.should.equal( 1 );
					result.length.should.equal( 89 );
					done();
				}
			);
		});
	} );
	describe( "urls of pages to be scraped", function() {
		it( "scrapes the correct urls", function(done){
			test.pageLoop(
				pathToRecipe,
				function() {
					var query = "irrelevant",
						options = [],
						max = 40,
						scrapeScript = "irrelevant";
					pagehop.init( query, options, max, scrapeScript );
				},
				function(urls, result) {
					should.exist( urls );
					result.should.eql( [] );
					urls.length.should.equal( 1 );
					urls[0].should.equal( "http://example.com/?q=irrelevant" );
					done();
				}
			);
		});
	} );
	describe( "options", function() {
		it( "scrapes another url", function(done){
			test.pageLoop(
				pathToRecipe,
				function() {
					var query = "irrelevant",
						options = [":optionName"],
						max = 10,
						scrapeScript = "irrelevant";
					pagehop.init( query, options, max, scrapeScript );
				},
				function(urls, result) {
					should.exist( urls );
					result.should.eql( [] );
					urls.length.should.equal( 1 );
					urls[0].should.equal( "http://withoption.example.com/?q=irrelevant" );
					done();
				}
			);
		});
	} );
	describe( "error handling", function() {
		it( "finishes with error", function(done){
			test.pageLoop(
				pathToRecipe,
				function() {
					var query = "irrelevant",
						options = [],
						max = 200,
						scrapeScript = "irrelevant";
					pagehop.scrape = function(url, callback) {
						window.boxApi.emitEvent( "scrape", url );
						callback( "blowup" );
					};
					pagehop.init( query, options, max, scrapeScript );
				},
				function(error) {
					should.exist( error );
					error.should.equal( "blowup" );
					done();
				}
			);
		});
	} );
	after( function(done) {
		test.finalize( done );
	} );
});