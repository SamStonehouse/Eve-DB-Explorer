	module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				files: {
					"src/styles/css/style.css": "src/styles/less/style.less"
				}
			}
		},
		autoprefixer: {
			single_file: {
				options: {

				},
				src: "src/styles/css/style.css",
				dest: "src/styles/css/style_prefixed.css"
			}
		},
		cssmin: {
			development: {
				options: {
					banner: "/* Minified style */"
				},
				files: {
					"assets/styles/style.css": ["src/styles/css/style_prefixed.css"]
				}
			}
		},
		watch: {
			styles: {
				options: {
					livereload: true
				},
				files: "src/styles/less/*.less",
				tasks: ["styles"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["less", "autoprefixer", "cssmin"]);
	grunt.registerTask("styles", ["less", "autoprefixer", "cssmin"]);
};