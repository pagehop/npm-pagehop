'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("../../../").test;

var pathToRecipe = pathUtils.resolve( __dirname, '../' ),
	expected = require("./data/results");

var testScraping = function( pageName, expectedResults, done ) {
	test.scrape(
		pathToRecipe,
		"file://" + pathUtils.resolve( __dirname, "data", pageName ),
		function() {
			window._pagehopTest = {
				isFirstJobsPage: true,
				isFirstShowPage: true
			};
		},
		function(results) {
			should.exist( results );
			results.should.eql( expectedResults );
			done();
		}
	);
};

describe("recipe-name's scrape",function(){
	before( function(done) {
		test.init( done );
	} );
	it( "scrapes a page with results", function(done){
		testScraping(
			"with_results.html",
			expected.with_results,
			done
		);
	});
	it( "scrapes a page without results", function(done){
		testScraping(
			"no_results.html",
			expected.no_results,
			done
		);
	});
	after( function(done) {
		test.finalize( done );
	} );
});