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
					finishTask: function(result) {
						log.push( { call: "finishTask", arguments: [
							result
						] } );
					}
				};
			}, function(error) {
				should.not.exist( error );
				page.injectJs( pathUtils.resolve( pathUtils.join( __dirname, "../src/api/scrape.js" ) ), function(error) {
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

describe( 'pagehop API for scrape', function(){
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
		it( "should set query, options, max props", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200;

			page.evaluate( function(query, options, max) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max );

				if (
					pagehop.query === query &&
					pagehop.options === options &&
					pagehop.max === max
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
			}, query, options, max );
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
				max = 200;

			page.evaluate( function(query, options, max) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max );

				return pagehop.getMaxCount() === max;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max );
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
				max = 200;

			page.evaluate( function(query, options, max) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max );

				return pagehop.getOptions() === options;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max );
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
				max = 200;

			page.evaluate( function(query, options, max) {
				var pagehop = window.pagehop;

				pagehop.init( query, options, max );

				return pagehop.getQuery() === query;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.ok;
				done();
			}, query, options, max );
		} );
	} );
	describe( 'finish', function() {
		beforeEach( beforeEachFunc );
		it( "should call boxApi.emitEvent with proper arguments", function(done) {
			var results = [ {}, {} ];

			page.evaluate( function(results) {
				var pagehop = window.pagehop;

				pagehop.finish( results );

				return window.log;
			}, function(error, result) {
				should.not.exist( error );
				should.exist( result );
				result.should.be.eql( [{
					call: "finishTask",
					arguments: [
						results
					]
				}] );
				done();
			}, results );
		} );
	} );
	after( afterAllFunc );
} );