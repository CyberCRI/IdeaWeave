module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        assetsDirBs :'client/app',
        assetsDir: 'app',
        distDir: 'dist',

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= assetsDirBs %>/**/*.html',
                        '<%= assetsDirBs %>/**/*.js',
                        '<%= assetsDirBs %>/**/*.css'
                    ]
                },
                options: {
                    watchTask: true,
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: false,
                        // must be false to avoid interfering with angular routing
                        forms: true
                    },
                    server: { baseDir: '<%= assetsDir %>' }
                }
            }
        },
        watch: {

        },
        connect: {
            test: {
                options: {
                    port: 8887,
                    base: '<%= assetsDir %>',
                    keepalive: false,
                    livereload: false,
                    open: false
                }
            }
        },
        karma: {
            dev_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                    background: true,
                    singleRun: false,
                    autoWatch: true,
                    reporters: ['progress']
                }
            },
            dist_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                    background: false,
                    singleRun: true,
                    autoWatch: false,
                    reporters: [
                        'progress',
                        'coverage'
                    ],
                    coverageReporter: {
                        type: 'html',
                        dir: '../reports/coverage'
                    }
                }
            },
            e2e: { options: { configFile: 'test/conf/e2e-test-conf.js' } }
        },
        clean: {
            dist: ['.tmp', '<%= distDir %>']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= assetsDir %>',
                    dest: '<%= distDir %>/',
                    src: [
                        'index.html',
                        'images/**'
                    ]
                },{
                    expand: true,
                    dot: false,
                    cwd: 'app/vendors/Font-Awesome/fonts/',
                    dest: '<%= distDir %>/fonts/',
                    src: [
                        '*'
                    ]
                },{
                    expand: true,
                    dot : false,
                    cwd : 'app/',
                    dest: 'dist/',
                    src : 'vendors/tinymce/**'
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scrips'
                }]
            }
        },
        useminPrepare: {
            html: '<%= assetsDir %>/index.html',
            options: {
                dest: '<%= distDir %>'
            }
        },
        usemin: {
            html: '<%= distDir %>/index.html'
        },
        inline_angular_templates: {
            dist: {
                options: {
                    base: 'app', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
                    //prefix: '/',            // (Optional) Prefix path to the ID. Default is empty string.
                    selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
                    method: 'prepend',       // (Optional) DOM insert method. Default is `prepend`.
                    unescape: {             // (Optional) List of escaped characters to unescape
                        '&lt;': '<',
                        '&gt;': '>',
                        '&apos;': '\'',
                        '&amp;': '&'
                    }
                },
                files: {
                    'dist/index.html': ['app/modules/**/*.tpl.html']
                }
            }
        }
    });
    grunt.registerTask('build', [
        'clean',
        'useminPrepare',
        'copy',
        'concat',
        'ngmin',
        'uglify',
        'cssmin',
        'usemin',
        'inline_angular_templates'
    ]);

    grunt.registerTask('server', [
        'browserSync',
        'karma:dev_unit:start',
        'watch'
    ]);
};

