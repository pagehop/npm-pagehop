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
				page.injectJs( pathUtils.resolve( pathUtils.join( __dirname, "../src/api/page-loop.js" ) ), function(error) {
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

describe( 'pagehop API for pageLoop', function(){
	before( beforeAllFunc );
	describe( 'injecting the script in a phantomjs page', function() {
		beforeEach( beforeEachFunc );
		it( "should create a global pagehop", function(done) {
			page.evaluate( function() {
				return window.pagehop ? true : false;
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
		it( "should set query, options, max, scrapeScript props", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				hops = [],
				systemMeta = {};

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				if (
					pagehop.query === query &&
					pagehop.options === options &&
					pagehop.max === max &&
					pagehop.scrapeScript === scrapeScript &&
					pagehop.systemMeta === systemMeta
					) {
					return true;
				} else {
					return false;
				}
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
	} );
	describe( 'getMaxCount', function() {
		beforeEach( beforeEachFunc );
		it( "should return zero if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getMaxCount() === 0;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				return pagehop.getMaxCount() === max;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
	} );
	describe( 'getOptions', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getOptions() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var query = "testQuery",
				options = [ ":n" ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				return pagehop.getOptions() === options;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
	} );
	describe( 'getQuery', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getQuery() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				return pagehop.getQuery() === query;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
	} );
	describe( 'getSystemMeta', function() {
		beforeEach( beforeEachFunc );
		it( "should return null if it's not set through init", function(done) {
			page.evaluate( function() {
				var pagehop = window.pagehop;

				return pagehop.getSystemMeta() === null;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			} );
		} );
		it( "should return set value", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				return pagehop.getSystemMeta() === systemMeta;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
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
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				return pagehop.getHops() === hops;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
		it( "should give a reference to the hops prop (no need to set in order to change)", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );
				pagehop.getHops().push( "hop" );

				return pagehop.hops.length === 1;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max, scrapeScript, systemMeta, hops );
		} );
	} );
	describe( 'scrape', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.spawnTask with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [],
				url = "http://test/";

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops, url) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				pagehop.scrape( url, function() {} );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.eql( [{
					call: "spawnTask",
					arguments: [
						scrapeScript,
						function() {} + "",
						url
					]
				}] );
				done();
			}, query, options, max, scrapeScript, systemMeta, hops, url );
		} );
	} );
	describe( 'updateResults', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [],
				results = [1, 2];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops, results) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				pagehop.updateResults( results );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.eql( [{
					call: "emitEvent",
					arguments: [
						"update",
						{
							items: results,
							hops: hops
						}
					]
				}] );
				done();
			}, query, options, max, scrapeScript, systemMeta, hops, results );
		} );
	} );
	describe( 'finishWithError', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [],
				error = {
					type: "timeout",
					message: "sample timeout error"
				};

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops, error) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

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
			}, query, options, max, scrapeScript, systemMeta, hops, error );
		} );
	} );
	describe( 'finish', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				scrapeScript = "testScript();",
				systemMeta = {},
				hops = [],
				results = [ {}, {} ];

			page.evaluate( function(query, options, max, scrapeScript, systemMeta, hops, results) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max, scrapeScript, systemMeta, hops );

				pagehop.finish( results );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.eql( [{
					call: "emitEvent",
					arguments: [
						"finish",
						{
							items: results,
							hops: hops
						}
					]
				}] );
				done();
			}, query, options, max, scrapeScript, systemMeta, hops, results );
		} );
	} );
	after( afterAllFunc );
} );