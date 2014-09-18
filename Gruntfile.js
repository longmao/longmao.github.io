module.exports = function(grunt) {

    // Project configuration.
    var pkg = grunt.file.readJSON('package.json')


    var helper = {
        getAssetsData: function() {
            var assets_json = grunt.file.readJSON('config/assets.config.json');
            var data = assets_json;
            return data
        },
        renderLinksTags: function(key) {
            // `staticAssets`: default namespace of the grunt-static-versioning plugin
            var data = this.getAssetsData()
            var obj = data.staticAssets[key];
            console.log(obj)
            if (obj && obj.css) {
                return obj.css.map(function(src) {
                    return '<link rel="stylesheet" href="public' + src + '">';
                }).join('\n ');
            } else {
                return '';
            }
        },
        // render all <script> tags based on key
        renderScriptsTags: function(key) {
            // `staticAssets`: default namespace of the grunt-static-versioning plugin
            var data = this.getAssetsData()
            var obj = data.staticAssets[key];
            if (obj && obj.js) {
                return obj.js.map(function(src) {
                    return '<script src="public' + src + '"></script>';
                }).join('\n ');
            } else {
                return '';
            }
        }
    }

    grunt.initConfig({
        pkg: pkg,
        helper: helper,
        uglify: {
            options: {
                beautify: pkg.env === "dev",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: [{
                    src: [
                        'scripts/*.js',
                    ],
                    dest: 'build/main.min.js'
                }]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'scripts/*.js', 'build/*.js']
        },
        less: {
            development: {
                options: {
                    paths: ["css"],
                    compress: pkg.env === "pro",
                    cleancss: pkg.env === "pro"
                },
                files: {
                    "build/style.min.css": "css/*.less"
                }
            }
        },
        cssmin: {
            minify: {
                files: [{
                    src: ['css/*.css'],
                    dest: 'build/style.min.css'
                }]
            }
        },
        csslint: {
            strict: {
                options: {
                    import: pkg.env === "dev"
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
        versioning: {
            options: {
                cwd: 'public',
                outputConfigDir: 'config'
            },
            dist: {
                files: [{
                    assets: '<%= uglify.my_target.files %>',
                    key: 'global',
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= cssmin.minify.files %>',
                    key: 'global',
                    dest: 'css',
                    type: 'css',
                    ext: '.min.css'
                }]
            }
        },
        preprocess: {

            prod: {
                src: 'test.html',
                dest: 'index.html',
                options: {
                    context: {
                        links: '<%= helper.renderLinksTags("global") %>',
                        scripts: '<%= helper.renderScriptsTags("global") %>',
                    }

                }

            }

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
                    'index.html': 'index.html',
                }
            },
            test: { // Target
                options: { // Target options
                    removeComments: pkg.env === "pro",
                    collapseWhitespace: pkg.env === "pro",
                    minifyJS: pkg.env === "pro",
                    minifyCSS: pkg.env === "pro"
                },
                files: { // Dictionary of files
                    'testHtmlMin.html': 'testHtmlMin.html',
                }
            }
        },
        // Deletes build folder
        clean: {
            build_folder: ["build"],
            css: 'css/style.css'
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-static-versioning');
    grunt.loadNpmTasks('grunt-preprocess');
    // Default task(s).
    grunt.registerTask('default', ['less', 'coffee', 'uglify', 'versioning', 'preprocess', 'htmlmin', 'clean']);
    grunt.registerTask('js_hint', ['jshint:all']);
    grunt.registerTask('css_min', ['cssmin']);
    grunt.registerTask('css_lint', ['csslint']);
    grunt.registerTask('htmlmin_test', ['htmlmin:test']);

    // A very basic default task.

};