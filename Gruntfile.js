module.exports = function(grunt){
	//Configure task(s)
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		babel: {
			options: {
			sourceMap: false,
			presets: ['es2015']
		},
			dev: {
				files: [{
					expand: true,
					src: 'src/js/es6/*.js',
					dest: 'src/js/transpiled',
					ext:'.js',
					flatten: true,
				}],
			},
		},

		browserify: {
			dev: {
				src: 'src/js/transpiled/app.js',
				dest: 'src/js/transpiled/bundle.js'
			},
			build: {
				src: 'src/js/transpiled/app.js',
				dest: 'src/js/transpiled/bundle.js',
			},	
		},

		uglify: {
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
					preserveComments: 'all',
				},
				src: 'src/js/transpiled/bundle.js',
				dest: 'src/js/bundle.min.js'
			},
			build: {
				src: 'src/js/transpiled/bundle.js',
				dest: 'build/js/bundle.min.js',
			}
		},

		less: {
			dev: {
				options: {
					paths: ['src/less/']
				},
				files: {
					'src/css/style.css' : 'src/less/source.less'
				}
			},
			build: {
				options: {
					compress: true
				},
				files: {
					'build/css/style.css' : 'src/less/source.less'
				}
			}
		},

		cssmin: {
			dev: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css'],
					dest: 'src/css',
					ext: '.min.css',
				}],	
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css'],
					dest: 'build/css',
					ext: '.min.css',
				}],
			},
		},

		htmlmin: {                                     
			build: {                                      
			  options: {                                 
			    removeComments: true,
			    collapseWhitespace: true,
			  },
			  files: {                                   
			    'build/index.html': 'src/index.html', 
			  }
			},
		},

		watch: {
			options: {
				livereload: true,
			},
			htmlDev: {
				files: ['src/index.html'],
			},
			jsDev: {
				files: ['src/js/es6/*.js'],
				tasks: ['babel:dev', 'browserify:dev', 'uglify:dev'],
			},
			lessDev: {
				files: ['src/less/*.less'],
				tasks: ['less:dev', 'browserify:dev', 'cssmin'],
			},
			jsBuild: {
				files: ['src/js/es6/*.js'],
				tasks: ['babel:dev', 'browserify:build', 'uglify:build'],
			},
			// add css file watch here?
		},

		connect: {
			dev: {
				options: {
					port: 8000,
					host: 'localhost',
					keepalive: true, 
					open: 'http://localhost:8000/src/index.html',
				},
			},
			build: {
				options: {
					port: 8001,
					host: 'localhost',
					keepalive: true, 
					open: 'http://localhost:8001/build/index.html',
				},
			}
		},

		concurrent: {
			dev: {
				tasks: ['connect:dev', 'watch'],
				options: {
					logConcurrentOutput: true,
				}
			},
			build: {
				tasks: ['connect:build', 'watch'],
				options: {
					logConcurrentOutput: true,
				}
			}
		},
	});	

	// Load the plugins
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// required for grunt-babel & grunt-concurrent to work
	require('load-grunt-tasks')(grunt);

	// Register tasks(s)
	// default equals to dev task
	grunt.registerTask('default', ['babel:dev', 'less:dev', 'cssmin:dev', 'browserify:dev', 'uglify:dev', 'concurrent:dev']);	
	grunt.registerTask('build', ['babel:dev', 'less:build', 'cssmin:build', 'browserify:build', 'uglify:build', 'htmlmin:build', 'concurrent:build']);
	// no need to register grunt-watch
};