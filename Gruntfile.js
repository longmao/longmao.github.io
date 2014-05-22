module.exports = function(grunt) {

    // Project configuration.
    var pkg = grunt.file.readJSON('package.json')
    grunt.initConfig({
        pkg: pkg,
        uglify: {
            options: {
                beautify: pkg.env === "dev",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'build/main.min.js': ['scripts/*.js']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'scripts/*.js', 'build/*.js']
        },
        less: {
            development: {
                options: {
                    paths: ["css"],
                    compress: pkg.env === "pro"
                },
                files: {
                    "css/style.css": "css/*.less"
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },
        watch: {
            scripts: {
                files: ['css/*.less'],
                tasks: ['less', 'cssmin', 'csslint'],
                options: {
                    spawn: false,
                    livereload: true
                },
            },
        },
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['css/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['css/*.css']
            }
        },
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'scripts',
                src: ['*.coffee'],
                dest: 'scripts',
                ext: '.js'
            },
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: pkg.env === "pro",
                    collapseWhitespace: pkg.env === "pro",
                    minifyJS: pkg.env === "pro",
                    minifyCSS: pkg.env === "pro"
                },
                files: { // Dictionary of files
                    'index.html': 'main.html',
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'cssmin', 'csslint', 'coffee', 'htmlmin']);
    grunt.registerTask('js_hint', ['jshint:all']);
    grunt.registerTask('css_min', ['cssmin']);
    grunt.registerTask('css_lint', ['csslint']);

    // A very basic default task.

};