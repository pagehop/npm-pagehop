/*jshint expr:true */
/*jshint evil:true */

'use strict';

var should = require('should'),
	pathUtils = require("path"),
	nodePhantom = require('node-phantom');

var phantom,
	page;

var beforeAllFunc = function(done) {
	this.timeout( 5000 );
	nodePhantom.create( function(error, ph) {
		should.not.exist( error );
		should.exist( ph );
		phantom = ph;
		done();
	} );
};
var beforeEachFunc = function(done) {
	phantom.createPage( function(error, pg) {
		should.not.exist( error );
		should.exist( pg );
		page = pg;
		//Debug:
		//page.onConsoleMessage = function(message) {
		//	console.log( "Instance message: " + message );
		//};
		page.open( "about:blank", function(error, status) {
			should.not.exist( error );
			should.exist( status );
			status.should.equal( "success" );
			page.evaluate( function() {
				var log = window.log = [];
				window.boxApi = {
					spawnTask: function(script, callback, url) {
						log.push( { call: "spawnTask", arguments: [
							script, callback + "", url
						] } );
					},
					emitEvent: function(event, args) {
						log.push( { call: "emitEvent", arguments: [
							event,
							args
						] } );
					}
				};
			}, function(error) {
				should.not.exist( error );
				page.injectJs( pathUtils.resolve( pathUtils.join( __dirname, "../src/api/tool.js" ) ), function(error) {
					should.not.exist( error );
					done();
				} );
			} );
		} );
	} );
};
var afterAllFunc = function(done) {
	phantom.exit( function() {
		done();
	} );
};

describe( 'pagehop API for tools', function(){
	before( beforeAllFunc );
	describe( 'injecting the script in a phantomjs page', function() {
		beforeEach( beforeEachFunc );
		it( "should create a global pagehop", function(done) {
			page.evaluate( function() {
				if ( window.pagehop ) {
					return true;
				} else {
					return false;
				}
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
	} );
	describe( 'init', function() {
		beforeEach( beforeEachFunc );
		it( "should set currentResults, argument and selection props", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				selection = 2;

			page.evaluate( function(currentResults, hops, argument, selection) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );

				if ( pagehop.currentResults === currentResults &&
					pagehop.hops === hops &&
					pagehop.argument === argument &&
					pagehop.selection === selection ) {
					return true;
				} else {
					return false;
				}
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument, selection );
		} );
		it( "should keep original selection if no selection passed in the init", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop,
					originalSelection = pagehop.selection;

				pagehop.init( currentResults, hops, argument );

				return pagehop.selection === originalSelection;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument );
		} );
		it( "should keep original selection if passed (in init) is lower than 0", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				selection = -1;

			page.evaluate( function(currentResults, hops, argument, selection) {
				var pagehop = window.pagehop,
					originalSelection = pagehop.selection;

				pagehop.init( currentResults, hops, argument, selection );

				return pagehop.selection === originalSelection;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument, selection );
		} );
	} );
	describe( 'getCurrentResults', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getCurrentResults() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				return pagehop.getCurrentResults() === currentResults;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument );
		} );
	} );
	describe( 'getHops', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getHops() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				return pagehop.getHops() === hops;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument );
		} );
		it( "should give a reference to the hops prop (no need to set in order to change)", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				selection = 2;

			page.evaluate( function(currentResults, hops, argument, selection) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
				pagehop.getHops().push( "hop" );

				return pagehop.hops.length === 1;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument, selection );
		} );
	} );
	describe( 'getArgument', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getArgument() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				return pagehop.getArgument() === argument;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument );
		} );
	} );
	describe( 'getSelection', function() {
		beforeEach( beforeEachFunc );
		it( "should return 0 if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getSelection() === 0;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				selection = 2;

			page.evaluate( function(currentResults, hops, argument, selection) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );

				return pagehop.getSelection() === selection;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument, selection );
		} );
	} );
	describe( 'setSelection', function() {
		beforeEach( beforeEachFunc );
		it( "should set the local pagehop prop", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				selection = 2;

			page.evaluate( function(currentResults, hops, argument, selection) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument, selection );
				pagehop.setSelection( selection + 1 );

				return pagehop.getSelection() > selection;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, currentResults, hops, argument, selection );
		} );
	} );
	describe( 'task', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.spawnTask with proper arguments", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop,
					taskScript = function() {};

				pagehop.init( currentResults, hops, argument );

				pagehop.task( "(" + taskScript + ")();", function() {} );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				// should.exist( result );
				result.should.be.eql( [{
					call: "spawnTask",
					arguments: [
						"(" + function() {} + ")();",
						function() {} + "",
						"about:blank"
					]
				}] );
				done();
			}, currentResults, hops, argument );
		} );
		it( "should call boxApi.spawnTask with set url", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test";

			page.evaluate( function(currentResults, hops, argument) {
				var pagehop = window.pagehop,
					taskScript = function() {};

				pagehop.init( currentResults, hops, argument );

				pagehop.task( "(" + taskScript + ")();", function() {}, "http://localhost" );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				// should.exist( result );
				result.should.be.eql( [{
					call: "spawnTask",
					arguments: [
						"(" + function() {} + ")();",
						function() {} + "",
						"http://localhost"
					]
				}] );
				done();
			}, currentResults, hops, argument );
		} );
	} );
	describe( 'finishWithError', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				error = {
					type: "timeout",
					message: "sample timeout error"
				};

			page.evaluate( function(currentResults, hops, argument, error) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				pagehop.finishWithError( error );

				return window.log;
			}, function(err, result) {
				should.not.exist( err );
				should.exist( result );
				result.should.be.eql( [{
					call: "emitEvent",
					arguments: [
						"error",
						error
					]
				}] );
				done();
			}, currentResults, hops, argument, error );
		} );
	} );
	describe( 'finish', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				results = [ {}, {} ];

			page.evaluate( function(currentResults, hops, argument, results) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				pagehop.finish( results );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.eql( [{
					call: "emitEvent",
					arguments: [
						"finish",
						{
							items: results,
							selection: 0,
							hops: hops
						}
					]
				}] );
				done();
			}, currentResults, hops, argument, results );
		} );
		it( "should return the new version of the hops array", function(done) {
			var currentResults = [],
				hops = [],
				argument = "test",
				results = [ {}, {} ];

			page.evaluate( function(currentResults, hops, argument, results) {
				var pagehop = window.pagehop;

				pagehop.init( currentResults, hops, argument );

				pagehop.getHops().push( "newHop" );

				pagehop.finish( results );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.eql( [{
					call: "emitEvent",
					arguments: [
						"finish",
						{
							items: results,
							hops: [ "newHop" ],
							selection: 0
						}
					]
				}] );
				done();
			}, currentResults, hops, argument, results );
		} );
	} );
	after( afterAllFunc );
} );