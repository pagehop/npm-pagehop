'use strict';

var should = require("should"),
	expected = require("./data/results"),
	recipe = require("../recipe");

describe("recipe-name's test",function(){
	this.timeout( 10000 );
	describe( "if :optionName is passed", function() {
		it( "returns an item stating :optionName is passed", function( done ){
			var pagehopMock = {
				getOptions: function() {
					return [ ":optionName" ];
				},

				finish: function( results ) {
					results.should.eql( expected.with_option );
					done();
				}
			};

			recipe.run( pagehopMock );
		});
	} );
	describe( "if :optionName isn't passed", function() {
		it( "returns an item stating :optionName isn't passed", function( done ){
			var pagehopMock = {
				getOptions: function() {
					return [];
				},

				finish: function( results ) {
					results.should.eql( expected.without_option );
					done();
				}
			};

			recipe.run( pagehopMock );
		});
	} );
});