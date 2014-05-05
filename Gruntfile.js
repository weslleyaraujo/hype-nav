module.exports = function (grunt) {
	'use strict';

	var tasks = [
		'grunt-contrib-uglify',
		'grunt-contrib-jshint',
	];

	grunt.initConfig({
		uglify : {
			my_target : {
				files: {
					'src/hype-navigator.min.js':
						[
							'lib/hype-navigator.js'
						]
				}
			},
		},

		jshint: {
			all: ['Gruntfile.js', 'lib/hype-navigator.js']
		}

	});
  
	tasks.forEach(grunt.loadNpmTasks);
	grunt.registerTask('default', ['uglify']);
};
