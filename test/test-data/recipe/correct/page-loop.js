'use strict';

var util = require('util');

var urlTemplate = 'http://www.google.com/search?hl=en&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8';

var startAt = 0,
  itemsAtPage = 100,
  query = pagehop.getQuery();

var allResults = [];

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