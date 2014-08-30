'use strict';

var fs = require('fs'),
	pathUtils = require('path'),
	wrench = require("wrench");

var common = {

	copyDirContentSync: function( sourceDirPath, destDirPath ) {
		var paths = wrench.readdirSyncRecursive( sourceDirPath );

		for ( var i = 0; i < paths.length; i++ ) {
			var relativeSrc = paths[i],
				absoluteSrc = pathUtils.resolve( sourceDirPath, relativeSrc ),
				absoluteDest = pathUtils.resolve( destDirPath, relativeSrc );

			if ( fs.statSync( absoluteSrc ).isDirectory() ) {
				wrench.copyDirSyncRecursive( absoluteSrc, absoluteDest );
			} else {
				fs.writeFileSync( absoluteDest, fs.readFileSync( absoluteSrc ) );
			}
		}
	}

};

module.exports = common;