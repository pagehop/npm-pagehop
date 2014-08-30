'use strict';

var should = require("should"),
	pathUtils = require("path");

var test = require("pagehop").test;

var pathToTool = pathUtils.resolve( __dirname, '../' );

describe( "toolName tool",function(){
	before( function(done) {
		test.init( done );
	} );
	it( "should set items to empty array if no results", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [],
					hops = [],
					argument = "irrelevant",
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should change the displayAddress prop on items with address", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "item",
							displayAddress: "The greatest item, EVER.",
							address: "http://somewhere.on.the.web.com"
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [
						{
							text: "item",
							displayAddress: "http://somewhere.on.the.web.com",
							address: "http://somewhere.on.the.web.com"
						}
					],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	it( "should remove items without an address", function(done){
		test.tool(
			pathToTool,
			function() {
				var currentResults = [
						{
							text: "item",
							displayAddress: "The greatest item, EVER.",
						},
						{
							text: "item2",
							displayAddress: "The greatest item, EVER, EVER.",
							address: ""
						}
					],
					hops = [],
					argument = null,
					selection = 0,
					pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
			},
			function(results) {
				should.exist( results );
				results.should.eql( {
					items: [],
					hops: [],
					selection: 0
				} );
				done();
			}
		);
	} );
	after( function(done) {
		test.finalize( done );
	} );
});