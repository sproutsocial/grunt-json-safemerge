'use strict';

var _ = require('lodash-node');

module.exports = function (grunt) {
	grunt.registerMultiTask('safemerge', function(flag) {		
		var concattedJson = {};
		var failed = 0;
		var done = this.async();

		// _.assign/_.merge/_.extend cannot be used since they do not track the key
		// and it would be hard to know of an error when you don't know what the key is
		var assignWithKey = function(destination, object, callback, parent) {
			_.each(object, function(value, key) {
				destination[key] = callback(destination[key], value, parent?parent+"."+key:key);
			});

			return destination;
		};

		var recurseAssign = function(sourceValue, objValue, key) {
			if( _.isPlainObject( objValue ) && _.isPlainObject(sourceValue) ) {
				return assignWithKey(objValue, sourceValue, recurseAssign, key); 
			} else if(objValue === sourceValue) {
				grunt.log.warn('You are overwriting with the same value!', key);	
			} else if(sourceValue !== void(0)) {
				grunt.log.error('You are overwriting a previously set value! ', key);
				grunt.verbose.writeln(" " + sourceValue + " => " + objValue);
				failed = 1;
			}

			return objValue;
		}
		grunt.verbose.writeln(JSON.stringify(this.file));
		if (this.filesSrc) {
			this.filesSrc.forEach(function(src) {
				var json = grunt.file.readJSON(src);
				grunt.log.debug('orig',json);

				var theFile = src.match(/\/([^/]*)$/)[1];

				assignWithKey(concattedJson, json, recurseAssign, theFile + " root");
			});
		} else {
			grunt.log.warn("No files were processed.");
		}

		grunt.verbose.writeln(JSON.stringify(concattedJson));
		if((!flag || flag === 'fail') && failed) {
			grunt.fail.warn("Previously set values were destroyed.");
		}
		done(concattedJson);
	});
};