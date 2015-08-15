/*jshint expr:true */
/*jshint -W098 */

'use strict';

var should = require('should'),
	PagehopApi = require("../src/api/recipe");

describe( "pagehop API for recipe", function(){

	describe( "init", function() {
		it( "should set query, options, max and hops props", function() {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				hops = [],
				systemMeta = {},
				pagehop = new PagehopApi( query, options, max, systemMeta, hops );

			(
				pagehop.query === query &&
				pagehop.options === options &&
				pagehop.max === max &&
				pagehop.hops === hops &&
				pagehop.systemMeta === systemMeta
			).should.be.ok;
		} );
		it( "should auto-set max to 0 if not set", function() {
			var query = "testQuery",
				options = [ {} ],
				hops = [],
				systemMeta = {};

			( new PagehopApi( query, options, undefined, systemMeta, hops ) ).max.should.equal( 0 );
			( new PagehopApi( query, options, null, systemMeta, hops ) ).max.should.equal( 0 );
		} );
	} );
	describe( "finishWithError", function() {
		it( "should emit 'error' event with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				systemMeta = {},
				hops = [],
				error = {
					type: "timeout",
					message: "sample timeout error"
				},
				pagehop = new PagehopApi( query, options, max, systemMeta, hops );

			pagehop.on( "error", function(err) {
				err.should.eql( error );
				done();
			} );

			pagehop.finishWithError( error );
		} );
	} );
	describe( "finish", function() {
		it( "should emit 'finish' event with proper arguments", function(done) {
			var query = "testQuery",
				options = [ {} ],
				max = 200,
				systemMeta = {},
				hops = [],
				results = [ {}, {} ],
				pagehop = new PagehopApi( query, options, max, systemMeta, hops );

			pagehop.on( "finish", function(args) {
				args.should.eql( {
					items: results,
					hops: hops
				} );
				done();
			} );

			pagehop.finish( results );
		} );
	} );

} );