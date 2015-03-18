'use strict';

import { titles } from './src/utils';

var path = require('path');
var fs = require('fs');
var htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );

var results = [];

titles.forEach( title => {
  results.push( {
    text: title,
    address: "http://example.com/" + title.toLowerCase(),
    preview: htmlTemplate
  } );
} );

pagehop.finish( results );