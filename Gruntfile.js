module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				//separator: ''
			},
			distcss: {
				src: ['./public/dist/stylesheets/*.css'],
				dest: './public/dist/stylesheets/combined_style.css'
			},
			v11ndist: {
				src: ['./public/v11n/js/lib/d3.min.js', './public/v11n/js/lib/c3.js',  './public/v11n/js/*.js'],
				dest: './public/javascripts/v11n.js'
			},
		},
		clean: {
			dist: {
				src: [
					'./logs/*',
					'./*.log',
					'./public/dist/**/*.js',
					'./public/dist/**/*.css',
					'!*.gitignore']
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: true, //see mangle: except: {} once you know more!
				compress: {
					drop_console: true
				}
			},
			dist: {
				files: [{
					expand: true, //what does this field do???
					cwd: './public/javascripts',
					src: '**/*.js',
					dest: './public/dist/javascripts'
					//ext: '.min.js'
				}]
			},
			v11ndist: {
				files: {
					'./public/dist/javascripts/v11n.js' : ['./public/javascripts/v11n.js']
				}
			}
		},
		lintspaces: {
			all: {
					src: [
							'public/javascripts/**/*.js',
							'Gruntfile.js',
							'package_dev.json',
							'bin/*.js',
							'routes/*.js',
							'test/*.js',
							'!logs/*',
							'!public/javascripts/jquery_2_1_1.js',
							'!public/javascripts/jquery_mobile_1_4_3.js',
							'!public/javascripts/prettyprint.js',
							'!public/javascripts/newpollvis.js'
					],
					options: {
							trailingspaces: true,
							//trailingspacesSkipBlanks: true,
							indentation: 'tabs',
							ignores: ['js-comments'],
							showValid: true,
							showTypes: true,
							showCodes: true
					}
			}
		},
		jshint: {
			// Custom options
			options: {
				'immed': true,
				'latedef': true,
				'newcap': true,
				'nonew': true,
				'plusplus': true,
				'quotmark': true,
				'laxbreak': true,
				// Environments
				'jquery': true,
				'node': true,

				// Custom globals
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			},
			dist: {
				src: [
					'Gruntfile.js',
					'app.js',
					'bin/*.js',
					'public/javascripts/*.js',
					'!public/javascripts/detector.js',
					'routes/*.js', '!test/**/*.js', 'bin/*.js',
					'!public/dist/javascripts/*.js',
					'!public/javascripts/jquery_2_1_1.js',
					'!public/javascripts/jquery_mobile_1_4_3.js',
					'!public/javascripts/prettyprint.js',
					'!public/javascripts/newpollvis.js',
					'!public/javascripts/c3.min.js',
					'!public/javascripts/d3.min.js'
				],
			},
			clientsrc: {
				src: [
					'public/javascripts/*.js',
					'!public/javascripts/jquery_2_1_1.js',
					'!public/javascripts/jquery_mobile_1_4_3.js',
					'!public/javascripts/prettyprint.js',
					'!public/javascripts/newpollvis.js',
					'!public/javascripts/c3.min.js',
					'!public/javascripts/d3.min.js'
				],
			},
			serversrc:
			{
				src: [
					'routes/*.js',
					'!test/**/*.js',
					'bin/*.js'
				],
			},
			gruntfile:
			{
				src: ['Gruntfile.js']
			}
		},
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile', 'lineending:gruntfile']
			},
			json: {
				files: 'package_dev.json',
				tasks: ['stripJsonComments:packagejson', 'replace:json', 'lineending:json']
			},
			serversrc: {
				files: ['app.js', 'bin/*.js', 'routes/*.js', 'test/**/*.js'],
				tasks: ['jshint:serversrc', /*'qunit:serversrc',*/ 'lineending:serversrc']
			},
			clientsrc: {
				files: ['public/javascripts/*.js'],
				tasks: ['jshint:clientsrc', /*'qunit:clientsrc',*/ 'lineending:clientsrc']
			}
		},
		stripJsonComments: {                                // Task
				packagejson: {                                         // Target
						files: {                                    // Dictionary of files
								'package.json': 'package_dev.json'    // 'destination': 'source'
						}
				}
		},
		replace: {
			json: {
				src: ['package.json'],
				dest: 'package.json',
				replacements: [{
					from: /[\t]{1,}[\n]/gm,
					to: ''
				}]
			}
		},
		lineending: {
			dist: {
				options: {
					eol: 'lf',
					overwrite: true
				},
				files: {
					'': ['**/.js', '**/.json', '**/.md', '**/*.gitignore', 'bin/*', 'public/javascripts/*.js', 'public/dist/javascripts/*.js', 'public/stylesheets/*.css', 'routes/*', 'views/*', '!*.png', '!*.svg', '!*.jpg', '!*.jpeg', '!*.log', '!/logs/*']
				}
			},
			gruntfile: {
				options: {
					eol: 'lf',
					overwrite: true
				},
				files: {
					'': ['Gruntfile.js']
				}
			},
			json: {
				options: {
					eol: 'lf',
					overwrite: true
				},
				files: {
					'': ['package.json', 'package_dev.json']
				}
			},
			clientsrc: {
				options: {
					eol: 'lf',
					overwrite: true
				},
				files: {
					'': ['public/javascripts/*.js']
				}
			},
			serversrc: {
				options: {
					eol: 'lf',
					overwrite: true
				},
				files: {
					'': ['app.js', '/bin/*.js', 'routes/*.js', 'views/*', 'test/**/*.js']
				}
			}
		},
		cssmin: {
			dist: {
				expand: true, //what does this do??
				cwd: './public/stylesheets',
				src: ['*.css'],
				dest: './public/dist/stylesheets'
				//ext: '.min.css'
			}
		}
	});

	grunt.registerTask('default', ['clean', 'uglify:dist', 'cssmin:dist', 'concat:distcss', 'concat:v11ndist', 'uglify:v11ndist']);
	grunt.registerTask('linter', ['jshint:dist', 'lintspaces:all']);
	grunt.registerTask('dist', ['clean', 'stripJsonComments:packagejson', 'replace:json', 'lineending:dist', 'jshint:dist'/*, 'qunit'*/, 'uglify:dist', 'cssmin:dist', 'concat:distcss', 'concat:v11ndist', 'uglify:v11ndist']);

	// https://github.com/gruntjs/grunt-contrib-clean/issues/32
	grunt.registerTask('cleaner', ['clean']);
	grunt.registerTask('packager', ['stripJsonComments:packagejson', 'replace:json']);
	grunt.registerTask('ender', ['lintspaces:all', 'lineending:dist']);

};