'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-rsync');

    var deployConfig = {};
    try {
        deployConfig = grunt.file.readJSON('deployConfig.json');
    } catch(err) {
        console.warn("*** WARNING: Cannot load deployment config ***\n");
    } 

    var serverConfig = require( './server/serverConfig.json' );
    var modRewrite = require('connect-modrewrite');

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        admin: 'admin'
    };


    grunt.initConfig({
        modules: [],
        bsversion: '1.0.6',
        filename: 'jz',
        filenamecustom: '<%= filename %>-custom',
        meta: {
            modules: 'angular.module("jz", [<%= srcModules %>]);',
            tplmodules: 'angular.module("jz.tpls", [<%= tplModules %>]);',
            all: 'angular.module("jz", ["ngSanitize","ui.bootstrap","angular-cache","pascalprecht.translate","jz.tpls",<%= srcModules %>]);'
        },
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/{,*/}*.js',
                    '{.tmp,<%= yeoman.app %>}/views/**/{,*/}*.html',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.admin %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.admin %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.admin %>}/scripts/**/{,*/}*.js',
                    '{.tmp,<%= yeoman.admin %>}/views/**/{,*/}*.html',
                    '<%= yeoman.admin %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'

                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: serverConfig.staticResourcePort,
                hostname: "localhost"
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.ico|\\.eot|\\.svg|\\.ttf|\\.woff|\\.otf$ /index.html [L]'
                            ]),
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            adminlivereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.ico|\\.eot|\\.svg|\\.ttf|\\.woff|\\.otf$ /index.html [L]'
                            ]),
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.admin)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '<%= yeoman.app %>/mod/*/{,*/}*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/scripts',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        concat: {
            dist_tpls: {
                options: {
                    banner: '<%= meta.all %>\n<%= meta.tplmodules %>\n'
                },
                src: [], //src filled in by build task
                dest: '<%= yeoman.dist %>/scripts/<%= filename %>-<%= bsversion %>.js'
            }
        },
        useminPrepare: {
            html: ['<%= yeoman.app %>/index.html'
                //'<%= yeoman.app %>/mod/{,*/}*/index.html',
            ],
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/index.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                files: {
                    /*'<%= yeoman.dist %>/styles/mains.css': [
                     '<%= yeoman.app %>/styles/main.css'
                     ]*/
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['mod/{,*/}*/*.html', 'mod/{,*/}*/views/*.html',
                            '*.html', 'views/*.html'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['/scripts/*.js',
                            '/mod/{,*/}*/scripts/*.js'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                src: ['<%= yeoman.dist %>/scripts/<%= filename %>-<%= bsversion %>-merge.js'],
                dest: '<%= yeoman.dist %>/scripts/<%= filename %>-<%= bsversion %>.min.js'
            }
            /* dist:{
             src:['<%= yeoman.dist %>/<%= filename %>-<%= bsversion %>.js'],
             dest:'<%= yeoman.dist %>/<%= filename %>-<%= bsversion %>.min.js'
             },
             dist_tpls:{

             src:['<%= yeoman.dist %>/scripts/<%= filename %>-tpls-<%= bsversion %>.js'],
             dest:'<%= yeoman.dist %>/scripts/<%= filename %>-tpls-<%= bsversion %>.min.js'
             }
             */
        },
        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.',
                    rename: function (modulePath) {
                        console.log(modulePath);
                        var moduleName = modulePath.replace('app/views/', '').replace('.html', '');
                        return 'views' + '/' + moduleName + '.html';
                    }
                },
                files: [
                    {
                        expand: true,
                        src: ['app/views/**/*.html'],
                        ext: '.html.js',
                        dest: 'dist/views/'
                    }
                ]
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        // '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/mains.css'
                        //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        // '<%= yeoman.dist %>/styles/fonts/*',
                        //  '<%= yeoman.dist %>/mod/{,*/}*/scripts/{,*/}*.js',
                        //'<%= yeoman.dist %>/mod/{,*/}*/styles/{,*/}*.css',
                        //'<%= yeoman.dist %>/mod/{,*/}*/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',

                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'index.html',
                            'vendors/**/*',
                            'images/{,*/}*.{gif,webp}',
                            'styles/fonts/*'
                            // 'mod/**/images/{,*/}*.{gif,webp}',
                        ]
                    }
                ]
            }
        },
        sshconfig: {
            prod: deployConfig
        },

        sshexec: {
            uptime: {
                command: "uptime",
                options: {
                    config: "prod"
                }
            },

            start: {
                command: deployConfig.path + "/server/foreverStart.sh",
                options: {
                    config: "prod"
                }
            },

            stop: {
                command: deployConfig.path + "/server/foreverStop.sh",
                options: {
                    config: "prod"
                }
            },

            clean: {
                command: "rm -r " + deployConfig.path + "/*",
                options: {
                    config: "prod"
                }
            },

            npm_install: {
                command: "cd " + deployConfig.path + " && npm install",
                options: {
                    config: "prod"
                }
            },

            npm_install_server: {
                command: "cd " + deployConfig.path + "/server && npm install",
                options: {
                    config: "prod"
                }
            }
        },

        rsync: {
            prod: {
                options: {
                    host: deployConfig.username + "@" + deployConfig.host,
                    src: ".",
                    exclude: ["node_modules", "server/node_modules"],
                    dest: deployConfig.path,
                    recursive: true,
                    syncDestIgnoreExcl: true
                }
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        //'coffee:dist',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    // for admin dashboard
    grunt.registerTask('admin-server', [
        'clean:server',
        'livereload-start',
        'connect:adminlivereload',
        'open',
        'watch'
    ]);
    // contact admin server js
    grunt.registerTask('admin-min-server', function () {
        grunt.config('concat.admin_min', {
            src: ['<%= yeoman.admin %>/scripts/*.js'],
            dest: '<%= yeoman.admin %>/dist/jz-admin-merge.js'
        });
        grunt.config('uglify.admin_min', {
            options: {
                mangle: false
            },
            src: ['<%= yeoman.admin %>/dist/jz-admin-merge.js'],
            dest: '<%= yeoman.admin %>/dist/jz-admin.min.js'
        })
        grunt.task.run([
            'concat:admin_min',
            'uglify:admin_min'
        ]);
    })

    grunt.registerTask('test', [
        'clean:server',
        'coffee',
        'connect:test',
        'karma'
    ]);


    var foundModules = {};

    function findModule(name) {
        if (foundModules[name]) {
            return;
        }
        foundModules[name] = true;
        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }

        function ucwords(text) {
            return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }

        function enquote(str) {
            var strName = str.replace('app/views/', 'views/');
            return '"' + strName + '"';
        }

        var module = {
            name: name,
            moduleName: enquote('jz.' + name),
            displayName: ucwords(breakup(name, ' ')),
            srcFiles: grunt.file.expand("app/scripts/" + name + "/*.js"),
            tplFiles: grunt.file.expand("app/views/" + name + "/*.html"),
            tpljsFiles: grunt.file.expand("dist/views/app/views/" + name + "/*.html.js"),
            tplModules: grunt.file.expand("app/views/" + name + "/*.html").map(enquote),
            dependencies: dependenciesForModule(name)
        };
        module.dependencies.forEach(findModule);
        grunt.config('modules', grunt.config('modules').concat(module));
    }

    function dependenciesForModule(name) {
        var deps = [];
        grunt.file.expand('/scripts/' + name + '/*.js')
            .map(grunt.file.read)
            .forEach(function (contents) {
                //Strategy: find where module is declared,
                //and from there get everything inside the [] and split them by comma
                var moduleDeclIndex = contents.indexOf('angular.module(');
                var depArrayStart = contents.indexOf('[', moduleDeclIndex);
                var depArrayEnd = contents.indexOf(']', depArrayStart);
                var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
                dependencies.split(',').forEach(function (dep) {
                    if (dep.indexOf('jz.') > -1) {
                        var depName = dep.trim().replace('jz.', '').replace(/['"]/g, '');
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            //Get dependencies for this new dependency
                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            });
        return deps;
    }

    grunt.registerTask('build-pre', function () {
        var _ = grunt.util._;

        //If arguments define what modules to build, build those. Else, everything
        if (this.args.length) {
            this.args.forEach(findModule);
            // grunt.config('filename', grunt.config('filenamecustom'));
        } else {
            grunt.file.expand({
                filter: 'isDirectory', cwd: '.'
            }, 'app/scripts/*').forEach(function (dir) {
                    findModule(dir.split('/')[1]);
                });
        }

        var modules = grunt.config('modules');
        grunt.config('srcModules', _.pluck(modules, 'moduleName'));
        grunt.config('tplModules', _.pluck(modules, 'tplModules').filter(function (tpls) {
            return tpls.length > 0;
        }));


        var srcFiles = _.pluck(modules, 'srcFiles');
        var tpljsFiles = _.pluck(modules, 'tpljsFiles');
        //Set the concat task to concatenate the given src modules
        //grunt.config('concat.dist.src', grunt.config('concat.dist.src')
        //           .concat(srcFiles));
        //Set the concat-with-templates task to concat the given src & tpl modules
        grunt.config('concat.dist_tpls.src', grunt.config('concat.dist_tpls.src')
            .concat(srcFiles).concat(tpljsFiles));

        grunt.task.run([
            'html2js', //only run when html change
            'useminPrepare',
            'concat',
            'imagemin',
            'cssmin',
            'copy'
        ]);
    });

    grunt.registerTask('build-min', function () {
        grunt.config('concat.dist_min', {
            src: ['<%= yeoman.dist %>/scripts/scripts.js',
                '<%= yeoman.dist %>/scripts/<%= filename %>-<%= bsversion %>.js'
            ],
            dest: '<%= yeoman.dist %>/scripts/<%= filename %>-<%= bsversion %>-merge.js'
        });
        grunt.task.run([
            'concat:dist_min',
            'uglify',
            'rev',
            'usemin'
        ]);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'build-pre:account:challenge:common:message:project:projectSetting:tag:user:admin',
            'build-min'
        ])
    });

    grunt.registerTask('deploy', [
        'build',
        'sshexec:stop',
        'rsync:prod',
        'sshexec:start'
    ]);

    grunt.registerTask('clean_deploy', [
        'build',
        'sshexec:stop',
        'sshexec:clean',
        'rsync:prod',
        'sshexec:npm_install',
        'sshexec:npm_install_server',
        'sshexec:start'
    ]);

    grunt.registerTask('min-server', function () {
        grunt.config('copy.server', {
            files: [
                {
                    expand: true,
                    cwd: 'server/resources',
                    src: '**/config.json',
                    dest: 'server/resources_min'
                }
            ]
        });
        grunt.config('uglify.server', {
            options: {
                mangle: false
            },
            files: [
                {
                    expand: true,
                    cwd: 'server/resources',
                    src: '**/*.js',
                    dest: 'server/resources_min'
                }
            ]
        })
        grunt.task.run(['copy:server', 'uglify:server'])
    });


    grunt.registerTask('default', ['build']);
};
