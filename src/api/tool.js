'use strict';

var boxApi = window.boxApi;

window.pagehop = {

	currentResults: null,
	hops: null,
	argument: null,
	selection: 0,

	init: function(currentResults, hops, argument, selection) {
		var self = this;
		self.currentResults = currentResults;
		self.hops = hops;
		self.argument = argument;
		self.selection = ( selection >= 0 ) ? selection : self.selection;
	},

	getCurrentResults: function() {
		var self = this;
		return self.currentResults;
	},

	getHops: function() {
		var self = this;
		return self.hops;
	},

	getArgument: function() {
		var self = this;
		return self.argument;
	},

	getSelection: function() {
		var self = this;
		return self.selection;
	},

	setSelection: function(value) {
		var self = this;
		self.selection = value;
	},

	task: function(script, callback, url) {
		boxApi.spawnTask( script, callback, ( url || "about:blank" ) );
	},

	finishWithError: function( error ) {
		boxApi.emitEvent( "error", error );
	},

	finish: function(results) {
		var self = this,
			args = {
				items: results,
				hops: self.hops,
				selection: self.selection
			};

		boxApi.emitEvent( "finish", args );
	}

};