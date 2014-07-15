'use strict';

module.exports = function (grunt) {

	var config = {
		'safemerge' : {
			'test': {
				'files': './tests/test*.json'
			}
		}
	};

	grunt.loadTasks('tasks');

	grunt.initConfig(config);

	grunt.registerTask('test', ['safemerge:test']);

	grunt.registerTask('default', function() {
		console.log('nothing to see here');
	});	
};