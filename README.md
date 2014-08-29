# pagehop (CLI tool and testing framework)

pagehop is an npm module made for the developer community of the Pagehop app.

pagehop installs a CLI tool you can use in the Terminal to scaffold and validate the recipes and tools you are building, as well as a testing framework to add as a development dependency in your Pagehop projects.

## Requirements

Requires PhantomJS to be installed on the path.

## Install

```bash
$ npm install -g pagehop
```

And for every project you need to *cd* into it and run:

```bash
$ npm install --save-dev pagehop
```

## Usage

### CLI

```bash
$ pagehop
command argument is required

Usage: pagehop <command>

command
  recipe     recipe related commands
  tool       tool related commands
```

```bash
$ pagehop recipe
! No option specified. Run with ' --help' to check how to use this command
```

```bash
$ pagehop recipe --help

Usage: node cli.js recipe [options]

Options:
   -i, --init       scaffold a recipe project (in the current dir, if no path is passed)
   -v, --validate   validates the structure of a recipe (validates current dir's content, if no path is passed)
   -p, --path       path to the recipe's dir (if not passed - path is considered the current dir)
```

#### Init (Scaffold)

To init a new recipe in the current dir, you simply run:

```bash
$ pagehop recipe --init
```

or

```bash
$ pagehop recipe -i
```

You can (optionally) specify a path:

```bash
$ pagehop recipe -i -p /Users/tsenkov/pagehop-my-great-recipe/
```

The same goes for initialising a new tool project (just replace "recipe" with "tool").

#### Validate

To validate the structure of your recipe:

```bash
$ pagehop recipe --validate
```

or

```bash
$ pagehop recipe -v
```

And again, you can specify a path:

```bash
$ pagehop recipe -v -p /Users/tsenkov/pagehop-my-great-recipe/
```

The same approach for tools (just replace "recipe" with "tool").

### In tests

Here is an overview example:

```javascript
var test = require("pagehop").test;

before( function(done) {
	test.init( done );
} );

describe( "recipe", function() {
	describe( "pageLoop", function() {
		it( "scrape 1 page, if ...", function(done) {
			test.pageLoop(...);
		} );
		...
	} );
	describe( "scrape", function() {
		it( "scrapes page with bad results", function(done) {
			test.scrape(...);
		} );
		...
	} );
} );

describe( "tool", function() {
	it( "changes results", function(done) {
		test.tool(...);
	} );
} );

after( function(done) {
	test.finalize( done );
} );
```

For testing your recipes, the test object provides the methods test.pageLoop() and test.scrape().

For testing your tools, you can use the test.tool() method.

Please, read through the reference bellow.

### test object Reference

#### test.init( callback )

Before running your tests, you should make sure that the test object is ready. Check the example for BDD-style tests with the awesome Mocha framework (above) for reference.

#### test.pageLoop( pathToRecipe, preLoopFunc, callback )

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **preLoopFunc** - this is a function that will run in the same sandboxed environment as your pageLoop script, but **before** it. In it, you are suppose to predefine the conditions in which the pageLoop will be running. You usually do this, by initializing the pagehop object with data.
- **callback( urls, result )/callback( error )** - the main idea (with the exception when an api is used instead of scraping) of the pageLoop is to select urls to be scraped. In your success test cases, expect `urls` and `result` to be passed. In your error handling tests you can expect only an `error` argument.

Here is a sample success test case:

```javascript
it( "scrape 1 page, if maxCount=30", function(done){
	test.pageLoop(
		pathUtils.resolve( __dirname, '../' ),
		function() {
			var query = "irrelevant",
				options = [],
				max = 30,
				scrapeScript = "irrelevant";
			pagehop.init( query, options, max, scrapeScript );
		},
		function(urls, result) {
			should.exist( urls );
			should.exist( result );
			urls.length.should.equal( 1 );
			result.length.should.equal( 0 );
			done();
		}
	);
});
```

This is what happens here:
1. The preLoopFunc inits pagehop's global object:
	- **query** ("irrelevant", simply is a word game since here in the test case, it's not of any significance);
	- **no options** (recipe options);
	- **maxResultsCount** of 30 (the upper limit of the number of returned results);
	- **scrapeScript** which will never be runned (test.pageLoop internally mocks the pagehop.scrape() method, so no real scrapes are executed).
2. We expect the following in the callback:
	- both urls and result should be sent;
	- urls should hold only 1 item (proving scrape was attempted on only 1 url);
	- results should be an empty array (testing how does test.pageLoop work more than the actual recipe, but just to show you what you should expect)

This method should be used for tests expecting of 0-1 page-scrapes. Here is what you should use for more than 1 scrapes.

Here is an example for an error handling case:

```javascript
it( "finishes with error", function(done){
	test.pageLoop(
		pathToRecipe,
		function() {
			var query = "irrelevant",
				options = [],
				max = 200,
				scrapeScript = "irrelevant";
			pagehop.scrape = function(url, callback) {
				callback( "blowup" );
			};
			pagehop.init( query, options, max, scrapeScript );
		},
		function(error) {
			should.exist( error );
			error.should.equal( "blowup" );
			done();
		}
	);
});
```

#### (+overload) test.pageLoop( pathToRecipe, preLoopFunc, intermediateResults, callback )

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **preLoopFunc** - this is a function that will run in the same sandboxed environment as your pageLoop script, but **before** it. In it, you are suppose to predefine the conditions in which the pageLoop will be running. You usually do this, by initializing the pagehop object with data.
- **intermediateResults** - array holding mocks of results for the pagehop.scrape calls in the form of:

```javascript
[{
	error: { type: "...", message: "..." } /* or undefined */,
	result: /* whatever you sent from scrape.js */
},
...
]
```

- **callback( urls, result )/callback( error )** - the main idea (with the exception when an api is used instead of scraping) of the pageLoop is to select urls to be scraped. In your success test cases, expect `urls` and `result` to be passed. In your error handling tests you can expect only an `error` argument.

Here is a real-life example (HackerNews recipe) using this overload:

```javascript
it( "scrapes the correct urls", function(done){
	var intermediateResults = [
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHnv",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn2",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn3",
				items: Array( 10 )
			}
		},
		{
			result: {
				nextUrl: "https://news.ycombinator.com/x?fnid=xwRo27NTrZmxqQK6yDFHn4",
				items: Array( 10 )
			}
		}
	];

	test.pageLoop(
		pathToRecipe,
		function() {
			var query = "irrelevant",
				options = [],
				max = 40,
				scrapeScript = "irrelevant";
			window.pagehop.init( query, options, max, scrapeScript );
		},
		intermediateResults,
		function(urls, result) {
			should.exist( urls );
			should.exist( result );
			urls.should.eql( [ "http://news.ycombinator.com/" ].concat( intermediateResults.map( function(item) {
				return item.result.nextUrl;
			} ).slice( 0, intermediateResults.length - 1 ) ) );
			result.length.should.equal( 40 );
			done();
		}
	);
});
```

In this example we pass intermediate results, which simulates the way that your pageLoop script would be getting results from page scraping.

If you are wondering why we cut the last passed result from the array when we compare for deep equality in the callback - the maxResultsCount is 40, but we practically set for 5-page sequence of scraping (passing 4 as intermediate results + the landing page of hacker news = 5) and 5 * 10 results/page = 50 results. The pageLoop shouldn't continue after getting to 40, therefore the last page isn't scraped.

#### test.scrape( pathToRecipe, pagePath, callback )

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **pagePath** - url to a test page to be scraped (usually local file, using the file:// protocol). The url should be absolute - test.scrape() will not try to do any further resolution on it.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a nice example from the template recipe created with `pagehop recipe --init` with the pagehop cli tool:

```javascript
test.scrape(
	pathToRecipe,
	"file://" + pathUtils.resolve( __dirname, "data", pageName ),
	function(results) {
		should.exist( results );
		results.should.eql( expectedResults );
		done();
	}
);
```

#### (+overload) test.scrape( pathToRecipe, pagePath, preScrapeFunc, callback )

- **pathToRecipe** - should be an absolute path to the directory of your recipe (usually resolving "../" should be the path).
- **pagePath** - url to a test page to be scraped (usually local file, using the file:// protocol). The url should be absolute - test.scrape() will not try to do any further resolution on it.
- **preScrapeFunc** - this is a function that will run in the same sandboxed environment as your scrape script, but **before** it. In it, you are suppose to predefine the conditions in which the scrape will be running. You usually do this, by initializing the pagehop object with data and/or settings some global mocks, expected by the scrape script.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a real example (Hacker News recipe):

```javascript
// scrape-test.js
var testScraping = function( pageName, expectedResults, done ) {
	test.scrape(
		pathToRecipe,
		"file://" + pathUtils.resolve( __dirname, "data", pageName ),
		function() {
			window._pagehopTest = {
				isFirstJobsPage: true,
				isFirstShowPage: true
			};
		},
		function(results) {
			should.exist( results );
			removeFSPath( results ).should.eql( removeFSPath( expectedResults ) );
			done();
		}
	);
};

describe( "hacker-news recipe's scrape", function() {
	before( function(done) {
		test.init( done );
	} );
	it( "scrapes default page with 'More' results", function(done) {
		testScraping(
			"default.html",
			expected.default,
			done
		);
	} );
	...
} );
```

If you wonder about the _pagehopTest prop on window, here is how it connects with the actual code of scrape,js

```javascript
// scrape.js
...
// for tests
if ( window._pagehopTest ) {
	if ( window._pagehopTest.isFirstJobsPage ) {
		isFirstJobsPage = true;
	}
	if ( window._pagehopTest.isFirstShowPage ) {
		isFirstShowPage = true;
	}
}
```

Sometimes this is necessary, that the tested scripts know they are being tested.

For example when they can only derive some condition of the current state by the current url - if you are scraping a local page, this becomes impossible (e.g. "file:///Users/tsenkov/recipes/my-recipe/test/data/wiki_math.html", instead of "http://en.wikipedia.org/wiki/math").

However, this should only be used **as a last resort**.

#### test.tool( pathToTool, preToolFunc, callback )

- **pathToTool** - should be an absolute path to the directory of your tool (usually resolving "../" should be the path).
- **preToolFunc** - this is a function that will run in the same sandboxed environment as your tool script, but **before** it. In it, you are suppose to predefine the conditions in which the tool will be running. You usually do this, by initializing the pagehop object with data and/or settings some global mocks, expected by the tool script.
- **callback( result )/callback( error )** - in your success test cases, expect the `result` parameter to be passed. In your error handling tests you can expect an `error` argument, instead.

Here is a sample success case from the sample tool created on `pagehop tool --init` with the pagehop cli tool:

```javascript
var pathToTool = pathUtils.resolve( __dirname, '../' );
...
it( "should set items to empty array if no results", function(done){
	test.tool(
		pathToTool,
		function() {
			var currentResults = [],
				hops = [],
				argument = "irrelevant",
				selection = 0,
				pagehop = window.pagehop;

			pagehop.init( currentResults, hops, argument, selection );
		},
		function(results) {
			should.exist( results );
			results.should.eql( {
				items: [],
				hops: [],
				selection: 0
			} );
			done();
		}
	);
} );
```

## Copyright

Copyright (c) 2014 Universless Ltd., info@universless.com