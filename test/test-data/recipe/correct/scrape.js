'use strict';

var items = document.querySelectorAll(".g .r a");

var result = [];
for (var i = 0; i < items.length; i++) {
   result.push( {
      text: items[i].text,
      address: items[i].href
   } );
}

var navLinks = document.querySelectorAll("td.b a span");
var wasLastPage = ( navLinks[navLinks.length - 1].textContent !== "Next" );

pagehop.result( {
	items: result,
	wasLastPage: wasLastPage
} );