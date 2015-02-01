'use strict';

var util = require('util');

var urlTemplate = 'http://www.google.com/search?hl=en&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8',
  startAt = 0,
  itemsAtPage = 100,
  query = pagehop.getQuery(),
  allResults = [];

var path = require('path');
var fs = require('fs');
var htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );

var asyncWhile = function() {
  var url = util.format( urlTemplate, encodeURIComponent(query), startAt, itemsAtPage );
  pagehop.scrape( url, function(result) {
    var newItems = result.items;
    if ( newItems.length ) {
      allResults.concat( newItems );
    }

    if ( !result.wasLastPage ) {
      startAt += itemsAtPage;
      asyncWhile();
    } else {
      pagehop.recipeResult( allResults );
    }
  } );
};

asyncWhile();