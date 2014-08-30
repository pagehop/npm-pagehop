'use strict';

var fs = require('fs'),
	pathUtils = require('path');

exports.pageLoopApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "page-loop.js" ), "utf-8" );
exports.scrapeApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "scrape.js" ), "utf-8" );
exports.toolApi = fs.readFileSync( pathUtils.resolve( __dirname, "api", "tool.js" ), "utf-8" );

exports.CONST = require("./const");

exports.toolUtils = require("./tool-utils");
exports.recipeUtils = require("./recipe-utils");

exports.test = require("./tester");