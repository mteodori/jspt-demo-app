'use strict';
/* jshint -W049 */

var LIVERELOAD_PORT = 35729;
var CONNECT_PORT = 9000;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var processingProxySnippet = function (req, res, options) {
    res.oldWriteHead = res.writeHead;
    res.writeHead = function (statusCode, headers) {

        var locationHeader = this.getHeader('location');
        if (locationHeader && locationHeader.substr('https://') === 0) {
            locationHeader = locationHeader.replace('https://localhost', 'http://localhost:' + CONNECT_PORT);
            this.setHeader('location', locationHeader);
        }

        var cookieHeader = res.getHeader('set-cookie');
        if (cookieHeader) {
            var newCookieHeader = [];
            for (var i = 0; i < cookieHeader.length; i++) {
                var cookie = cookieHeader[i];
                var newCookie = cookie.replace('; secure', '');
                newCookieHeader.push(newCookie);
            }

            res.setHeader('set-cookie', newCookieHeader);
        }

        res.oldWriteHead(statusCode, headers);
    };

    proxySnippet(req, res, options);
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        tmp: '.tmp'
    };

    // api environment to proxy from command line, defaults to localhost
    var apiHost = grunt.option('api-host') || 'localhost';
    var apiPort = grunt.option('api-port') || 7890;
    var apiHttps = grunt.option('api-https') || apiPort === 443;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            less: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            handlebars: {
                files: [
                    '<%= yeoman.app %>/scripts/templates/*.hbs'
                ],
                tasks: ['handlebars']
            }
        },
        connect: {
            options: {
                port: CONNECT_PORT,
                livereload: LIVERELOAD_PORT,
                hostname: '0.0.0.0',
                open: 'http://localhost:<%= connect.options.port %>/index.html'
            },
            proxies: [
                {
                    context: '/',
                    host: apiHost,
                    port: apiPort,
                    https: apiHttps
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app),
                            processingProxySnippet
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: 'http://localhost:<%= connect.options.port %>/index.html',
                    keepalive: true,
                    base: [
                        '.tmp',
                        'test',
                        yeomanConfig.app
                    ]
                }
            },
            ci: {
                options: {
                    open: false,
                    base: '<%= connect.test.options.base %>'
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist),
                            processingProxySnippet
                        ];
                    }
                }
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ],
            ci: {
                src: '<%= jshint.all %>',
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: '.tmp/reports/jshint.xml'
                }
            }
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            },
            ci: {
                options: {
                    urls: '<%= mocha.all.options.urls %>',
                    reporter: './node_modules/xunit-file/lib/xunit-file'
                }
            }
        },
        less: {
            options: {
                paths: [
                    '<%= yeoman.app %>/styles',
                    '<%= yeoman.app %>/images',
                    '<%= yeoman.app %>/scripts',
                    '<%= yeoman.app %>/styles/icons',
                    '<%= yeoman.app %>/bower_components'
                ],
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: '<%= yeoman.app %>/styles',      // Src matches are relative to this path.
                    src: ['**/*.less'], // Actual pattern(s) to match.
                    dest: '.tmp/styles',   // Destination path prefix.
                    ext: '.css'   // Dest filepaths will have this extension.
                }]
            },
            dist: {
                files: '<%= less.options.files %>'
            },
            server: {
                dumpLineNumbers: true,
                files: '<%= less.options.files %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            }
        },
        lesslint: {
            src: ['<%= yeoman.app %>/styles/**/*.less'],
            options: {
                formatters: [{
                    id: 'checkstyle-xml',
                    dest: '.tmp/reports/lesslint.xml'
                }]
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '<%= yeoman.app %>/scripts',
                    optimize: 'none',
                    mainConfigFile: '<%= yeoman.app %>/scripts/main.js',
                    findNestedDependencies: true,
                    paths: {
                        'templates': '../../.tmp/scripts/templates'
                    },
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        bower: {
            target: {
                rjsConfig: '<%= requirejs.dist.options.mainConfigFile %>'
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
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
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            socketio: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '<%= yeoman.app %>/bower_components/socket.io-client/dist/WebSocketMain.swf',
                    dest: '<%= yeoman.dist %>/bower_components/socket.io-client'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        'images/{,*/}*.{webp,gif}',
                        'icons/{,*/}*.{eot,svg,ttf,woff}'
                    ]
                }]
            }
        },
        htmlhint: {
            options: {
                htmlhintrc: '.htmlhintrc'
            },
            html: {
                options: {
                    'doctype-first': true
                },
                src: ['<%= yeoman.app %>/*.html']
            },
            handlebars: {
                src: ['<%= yeoman.app %>/scripts/templates/*.hbs']
            }
        },
        handlebars: {
            compile: {
                options: {
                    amd: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.hbs']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/bower_components/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/icons/{,*/}*.{eot,svg,ttf,woff}'
                    ]
                }
            }
        },
        compress: {
            build: {
                options: {
                    mode: 'tgz',
                    archive: '.tmp/<%= pkg.name %>.tar.gz'
                },
                files: [
                    { expand: true, cwd: '<%= yeoman.dist %>/', src: '**', dest: '<%= pkg.name %>' }
                ]
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'configureProxies',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'createDefaultTemplate',
            'handlebars',
            'less:server',
            'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('validate', [
        'jshint:all',
        'lesslint',
        'htmlhint'
    ]);

    grunt.registerTask('ci', function() {
        var path = require('path');
        var reportDir = path.normalize(__dirname + '/.tmp/reports');
        grunt.file.mkdir(reportDir);

        process.env.LOG_XUNIT = true;
        process.env.XUNIT_FILE = path.normalize(reportDir + '/mocha.xml');

        grunt.task.run([
            'build',
            'jshint:ci',
            'lesslint',
            'htmlhint',
            'connect:ci',
            'mocha:ci'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'createDefaultTemplate',
        'handlebars',
        'less',
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'createDefaultTemplate',
        'handlebars',
        'less:dist',
        'useminPrepare',
        'requirejs',
        'imagemin',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'rev',
        'usemin',
        'compress:build'
    ]);

    grunt.registerTask('default', [
        'validate',
        'test',
        'build'
    ]);
};
