'use strict';

module.exports = function (grunt) {

	var config = {
		'safemerge' : {
			'test': {
				files: { src: ['./tests/test1.json', './tests/test2.json'] }
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