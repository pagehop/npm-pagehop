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

```
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
				scrapeScript = "irrelevant",
				systemMeta = {},
				hops = [];
			pagehop.init( query, options, max, scrapeScript, systemMeta, hops );
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
				scrapeScript = "irrelevant",
				systemMeta = {},
				hops = [];
			pagehop.scrape = function(url, callback) {
				callback( "blowup" );
			};
			pagehop.init( query, options, max, scrapeScript, systemMeta, hops );
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
				scrapeScript = "irrelevant",
				systemMeta = {},
				hops = [];
			window.pagehop.init( query, options, max, scrapeScript, systemMeta, hops );
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

## pagehop API reference

### Recipes

Every recipe consist of:
- page-loop.js;
- scrape.js;
- package.json.

The two scripts are runned in a completely isolated environment (no access to the FS or anything system).

Before running the scripts, Pagehop adds the pagehop global object (this is how your recipe communicate results and errors with the Pagehop app and how it gets the info about the current pagehop query), which is similar for both of the scripts, yet a bit different.

#### pagehop API (page-loop.js)

##### pagehop.init(query, options, max, scrapeScript, systemMeta, hops)

This method is used by Pagehop, to preset the environment for running your page-loop.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **query** - **string**, recipe's query as parsed by Pagehop.
- **options** - **array**, holding all options parsed from the pagehop query.
- **max** - integer, >=10, the maximal number of results that can be returned by the recipe.
- **scrapeScript** - **string**, Pagehop executes recipes producing a single script which is the page-loop.js with all of it's dependencies and the scrape script (if any), which is executed in a separate isolated environment upon calling pagehop.scrape() from your page-loop. Since you only should use pagehop.init() in tests, and since these tests should only test the page-loop.js, **never** the scrape.js (it's separately tested), you don't need to pass actual script in here, because it shouldn't get executed.
- **systemMeta** - **object** with 2 fields (arrays) - **recipes**, **tools**. This is usually used by recipes that provide some system information about Pagehop (AllRecipes list the available recipes and AllTools list the tools).
- **hops** - **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is the format of the hop objects:

```javascript
{
	text: "text",
	address: "address"
}
```

##### pagehop.getMaxCount()

Returns an **integer**. Your pageLoop scripts should get this, in order to find out the limit of the number of returned results they should confirm to.

##### pagehop.getQuery()

Returns a **string**. Returns the recipe query as parsed by Pagehop.

This doesn't include the whole pagehop query - e.g. in `g <this is the query> :r $.*^` the parsed query will be `<this is the query>`.

##### pagehop.getOptions()

Returns an **array** of strings.

Tools or non-recognized options will not be passed in here - e.g. `h :s :asdf` will produce only [":s"] for options (":s" is for Show HN posts with HackerNews recipe).

##### pagehop.getSystemMeta()

Returns an **object** with 2 fields (arrays) - **recipes**, **tools**. Recipe objects look like this (comments show where does the data come from):

```javascript
{
	id: /* package.json:pagehop.id */,
	description: /* package.json:description */,
	version: /* package.json:version */,
	homepage: /* package.json:homepage */,
	options: /* package.json:pagehop.options */
} 
```

Tool objects look like this:

```javascript
{
	id: /* package.json:pagehop.id */,
	description: /* package.json:description */,
	version: /* package.json:version */,
	homepage: /* package.json:homepage */,
	keyword: /* package.json:pagehop.keyword */
} 
```

##### pagehop.getHops()

Returns a **MUTABLE array** of objects specifying addresses the user had "hopped of". Recipes are usually using the hops array for a visual notification of which recipe is being used. Here is how you should use the hops array and how the objects in it look like:

```javascript
pagehop.getHops().push( {
	text: "RecipeId",
	address: "http://some.url.com/will/produce/same/results/but/in-browser"
} );
```

##### pagehop.scrape( url, callback )

- **url** - **string** pointing to a file or a page on the web. Pagehop automatically will use the scrape.js script in a separate, also isolated, environment (browser), where it will first navigate to the page and then run scrape.js.
- **callback** - function accepting 2 arguments - **error** and **result**. If the scrape produced an error (syntax error in scrape.js, or runtime error, or timeout), you will get an error in the callback and no result. Error is of this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

The result object is always entirely up to your scrape script.

##### (experimental) pagehop.updateResults( results )

- **results** - **array** of objects with this structure:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) */
}
```

This is not yet used by official builds of Pagehop, but we are trying to see if we can show intermediate results before the recipe is finished. So far the tests don't show too promising results, so we advice you not to use the method. Most likely we will try to replace this with something like % progress API, where you will tell Pagehop, what % of the scrapes/loads/generations of results are ready, so we can visualize it and notify the user.

If you decide to use it, anyway, you should call it in cases where you have called scrape in a synchronous loop. This way every time one of the scrapes is ready, it will notify Pagehop of the new results. **Always return ALL of the results so far, not just these that you get on this callback from scrape**

##### pagehop.finishWithError( error )

If your recipe is prevented by an obstacle that it cannot overcome you can fail gracefully with pagehop.finishWithError().

Error object must be with this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

##### pagehop.finish( results )

- **results** - **array** of result objects.

When your recipe is ready, you can return the results it has obtained/produced with pagehop.finish( results ).

Here is how your result objects should look like:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) */
}
```

If you provide, both, text and displayText, displayText will be shown as the first row of your Pagehop result, but text will still be the field used for searches (:r will not use the displayText to match against and the produced results will have their displayText fields redone with the formatting highlighting the matched parts). If only text is present, then it will be displayed on the first row.

If you provide, both, address and displayAddress, only displayAddress will be shown, on the second row.

By default, address is show in a tooltip on long-hover on items in the UI. You can pass a different tooltip text to replace it.

Starting from ver1.2, you can optionally supply a preview html to be loaded in Pagehop's UI. Recipes such as DefineWord, CodeSearch and others use it. Local resources you reffer from this html should assume the recipe's root dir as / (web root).

#### pagehop API (scrape.js)

##### pagehop.init(query, options, max)

This method is used by Pagehop, to preset the environment for running your scrape.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **query** - **string**, recipe's query as parsed by Pagehop.
- **options** - **array**, holding all options parsed from the pagehop query.
- **max** - integer, >=10, the maximal number of results that can be returned by the recipe.

##### pagehop.getMaxCount()

Returns an **integer**. Although page-loop.js has access to this prop, for convenience we provide availability in scrape.js, too. For example, when you always scrape 1 page (virtual scrolling etc.).

##### pagehop.getQuery()

Returns a **string**. Returns the recipe query as parsed by Pagehop.

This doesn't include the whole pagehop query - e.g. in `g <this is the query> :r $.*^` the parsed query will be `<this is the query>`.

##### pagehop.getOptions()

Returns an **array** of strings.

Tools or non-recognized options will not be passed in here - e.g. `h :s :asdf` will produce only [":s"] for options (":s" is for Show HN posts with HackerNews recipe).

##### pagehop.finish( results )

- **results** - **array** of result objects.

When your scrape is ready, you can return the results it has obtained with pagehop.finish( results ).

Result's format is entirely under your control (pagehop.finish( results ) in the page-loop.js should follow a scheme, though. Make sure to check that out).

### Tools

Every tool consist of:
- tool.js;
- package.json.

The tool.js script is runned in a completely isolated environment (no access to the FS or anything system).

Before running the script, Pagehop adds the pagehop global object (this is how your tool communicate results and errors with the Pagehop app and how it gets the info about the current pagehop query).

#### pagehop API (tool.js)

Not all data obtained from getter methods is immutable (check pagehop.getHops()).

##### pagehop.init(currentResults, hops, argument, selection)

This method is used by Pagehop, to preset the environment for running your tool.js

You can use this method only in your tests, where the test framework doesn't call init automatically.

Lets go through the params:
- **currentResults** - **array** of result objects. This array is either produced by a recipe, or by the previous tool on the pipeline.
- **hops** - **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is how the Links tool uses the hops array:

```javascript
pagehop.getHops().push( {
	text: selected.text,
	address: selected.address
} );
```

- **argument** - **string**, the tool's passed argument as parsed from the pagehop query.

Example - in this query `g lets search google :r $[^test] :a :l`, the :r Regex tool will get "$[^test]" as an argument.

- **selection** - **integer**, specifies the index of the selected item in the currentResults.

##### pagehop.getCurrentResults()

Returns an **array** with the results as returned by the selected recipe or by the previous tool in the pipeline.

The result objects follow this structure:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) */

}
```

##### pagehop.getHops()

Returns a **MUTABLE array** of objects specifying addresses the user had "hopped of". Here is how the Links tool uses the hops array and how the objects in it look like:

```javascript
pagehop.getHops().push( {
	text: selected.text,
	address: selected.address
} );
```

##### pagehop.getArgument()

Returns a **string** - the tool's passed argument as parsed from the pagehop query.

Example - in this query `g lets search google :r $[^test] :a :l`, the :r Regex tool will get "$[^test]" as an argument.

##### pagehop.getSelection()

Returns an **integer**, specifies the index of the selected item in the currentResults.

##### pagehop.setSelection( value )

- **value** - **integer** setting new selection index for the selected in the results that will be returned by the tool.

##### (experimental) pagehop.task( script, callback, url )

- **script** - **string** of a self-calling function (clojure) to be executed in a separate environment/page/thread.
- **callback** - **function** receiving 2 parameters - **error** and **result**.
- **url** - **optional param**, **string**, url to be loaded in the new page, before executing the passed script.

This method is still experimental and we don't recommend you to use it.

The use-case we have in mind is when you need to execute tasks in parallel for faster processing, or when the tool requires data from the web.

```javascript
...
var task = function() {
	...
	window.boxApi.finishTask( result );
};
pagehop.task( "(" + task + ")();", function(error, result) {
	if ( error ) {
		...
	}
	if ( result ) {
		...
	}
}, "http://example.com/some/page/for/tool/reference/" );
```

With this method you can scrape a page in a tool, or execute parallel processing algorithm on the results.

##### pagehop.finishWithError( error )

If your tool is prevented by an obstacle that it cannot overcome you can fail gracefully with pagehop.finishWithError().

Error object must be with this structure:

```javascript
{
	type: /* string */,
	message: /* string */
}
```

##### pagehop.finish( results )

- **results** - **array** of result objects.

When your tool is ready, you can return the results it has produced with pagehop.finish( results ).

Here is how your result objects should look like:

```javascript
{
	text: /* required, string */,
	address: /* string, url */,
	displayText: /* string that can contain html formatting */,
	displayAddress: /* string that can contain html formatting */,
	tooltip: /* string */,
	preview: /* string (html) */
}
```

The rules for result structure and visualization in the UI remain the same on the pipeline of recipe and tools:

If you provide, both, text and displayText, displayText will be shown as the first row of your Pagehop result, but text will still be the field used for searches (:r will not use the displayText to match against and the produced results will have their displayText fields redone with the formatting highlighting the matched parts). If only text is present, then it will be displayed on the first row.

If you provide, both, address and displayAddress, only displayAddress will be shown, on the second row.

By default, address is show in a tooltip on long-hover on items in the UI. You can pass a different tooltip text to replace it.

Starting from ver1.2, you can optionally supply a preview html to be loaded in Pagehop's UI. Recipes such as DefineWord, CodeSearch and others use it - it can be used in the same manner with tools. Local resources you reffer from this html should assume the tool's root dir as / (web root).

## Caveats

### require('fs')

You can load templates or other textual resources using the fs module's readFileSync (**available starting from Pagehop 1.2**).
At compile time, calls to readFileSync are replaced with the actual content of the files (you can check the [brfs](https://www.npmjs.com/package/brfs) npm module for more info). The parsing brfs does in order to replace the statements, is **very delicate** and **easily breaks**, but if you require fs and path in two separate var-statements and load the file in a third, you will be fine:

```javascript
var path = require('path');
var fs = require('fs');
var htmlTemplate = fs.readFileSync( path.resolve( __dirname, "template.html" ), "utf-8" );
```

Although ECMAScript 6 style of requiring dependencies (import & export keywords) is supported for everything else, you can't use it for fs and path, in the above snippet. You have to use the snippet as it is.

## Release History

 - 1.1.2
   - Add: partial support of ECMAScript 6 (through Babel);
   - Refactor: browserify transforms usages;
   - Update: browserify to latest;
   - Update: brfs to latest.
 - 1.1.1
   - Add: dirPath prop in recipe and tool specs produced by the *-utils.
 - 1.1.0
   - Add: ability to manipulate the hops array in the page-loop api.
 - 1.0.9
   - Update: assets; 
   - Update: should dev npm dependency (in project + in asset projects).
 - 1.0.8
   - Fix: recipe and tool utils throw an error if cwd of the process is wrong.
 - 1.0.7
   - Add: loading resources through fs.readFileSync() in recipes (page-loop & scrape) and tools.
 - 1.0.6
   - Update: boxtree;
   - Fix: tests are failing on Windows.
 - 1.0.5
   - Update: boxtree.
 - 1.0.4
   - Update: boxtree.
 - 1.0.3
   - Update: boxtree.

## Copyright

Copyright (c) 2014 Universless Ltd., info@universless.com