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

```javascript
var test = require("pagehop").test;

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
```

## Copyright

Copyright (c) 2014 Universless Ltd., info@universless.com