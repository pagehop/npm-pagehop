'use strict';

var boxApi = window.boxApi;

window.pagehop = {

	query: null,
	options: null,
	max: 0,
	scrapeScript: null,
	systemMeta: null,

	init: function(query, options, max, scrapeScript, systemMeta) {
		var self = this;
		self.query = query;
		self.options = options;
		self.max = max;
		self.scrapeScript = scrapeScript;
		self.systemMeta = systemMeta;
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

	scrape: function(url, callback) {
		var self = this,
			script = self.scrapeScript;

		boxApi.spawnTask( script, callback, url );
	},

	updateResults: function(results) {
		boxApi.emitEvent( "update", results );
	},

	finishWithError: function( error ) {
		boxApi.emitEvent( "error", error );
	},

	finish: function(results) {
		boxApi.emitEvent( "finish", results );
	}

};