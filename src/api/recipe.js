'use strict';

var util = require("util"),
	events = require("events");

function PagehopApi(query, options, max, systemMeta, hops) {
	var self = this;

	// call base constructor
	events.EventEmitter.call( self );

	self.query = query;
	self.options = options;
	self.max = ( max !== undefined && max !== null ) ? max : 0;
	self.systemMeta = systemMeta;
	self.hops = hops;
}

util.inherits( PagehopApi, events.EventEmitter );

PagehopApi.prototype.finishWithError = function(error) {
	var self = this;

	self.emit( "error", error );
};

PagehopApi.prototype.finish = function(results) {
	var self = this,
		args = {
			items: results,
			hops: self.hops
		};

	self.emit( "finish", args );
};

module.exports = PagehopApi;