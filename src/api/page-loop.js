'use strict';

var boxApi = window.boxApi;

window.pagehop = {

	query: null,
	options: null,
	max: 0,
	scrapeScript: null,
	systemMeta: null,
	hops: null,

	init: function(query, options, max, scrapeScript, systemMeta, hops) {
		var self = this;
		self.query = query;
		self.options = options;
		self.max = max;
		self.scrapeScript = scrapeScript;
		self.systemMeta = systemMeta;
		self.hops = hops;
	},

	getMaxCount: function() {
		var self = this;
		return self.max;
	},

	getQuery: function() {
		var self = this;
		return self.query;
	},

	getOptions: function() {
		var self = this;
		return self.options;
	},

	getSystemMeta: function() {
		var self = this;
		return self.systemMeta;
	},

	getHops: function() {
		var self = this;
		return self.hops;
	},

	scrape: function(url, callback) {
		var self = this,
			script = self.scrapeScript;

		boxApi.spawnTask( script, callback, url );
	},

	updateResults: function(results) {
		var self = this,
			args = {
				items: results,
				hops: self.hops
			};

		boxApi.emitEvent( "update", args );
	},

	finishWithError: function( error ) {
		boxApi.emitEvent( "error", error );
	},

	finish: function(results) {
		var self = this,
			args = {
				items: results,
				hops: self.hops
			};

		boxApi.emitEvent( "finish", args );
	}

};