module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        assetsDir: 'app',
        distDir: 'dist',
        express: {
            all: {
                options: {
                    bases: ['app'],
                    port: 5010,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },
        watch: {
            all: {
                files: [
                    '<%= assetsDir %>/*.html',
                    '<%= assetsDir %>/*.js',
                    '<%= assetsDir %>/modules/**/*.js',
                    '<%= assetsDir %>/modules/**/*.tpl.html',
                    '<%= assetsDir %>/styles/**/.css'
                ],
                options: {
                    livereload: true
                }
            }
        },

        open: {
            all: {
                path: 'http://localhost:5010/'
            }
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
                    dest: 'dist/',
                    src : 'app/vendors/tinymce/**'
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
//        'ngmin',
        'uglify',
        'cssmin',
        'usemin',
        'inline_angular_templates'
    ]);

    grunt.registerTask('server', [
        'express',
        'open',
        'watch'
    ]);
};

