'use strict';

var boxApi = window.boxApi;

window.pagehop = {

	query: null,
	options: null,
	max: 0,

	init: function(query, options, max) {
		var self = this;
		self.query = query;
		self.options = options;
		self.max = max;
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

	finish: function(result) {
		boxApi.finishTask( result );
	}

};