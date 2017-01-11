var esprima   = require('esprima'),
    fs        = require('fs'),
    escodegen = require('escodegen'),
    _         = require('underscore');

/* jshint quotmark: false, strict: false */
var getRenderer = function(ext, cwd){
    return "define(function() {\n"+
        "   var Rndrr = {},\n"+
        "       buildMap = {};\n"+
        "   Rndrr.load = function(name, parentRequire, load, config) {\n"+
        // Parent require returns the full path to the item, ( the _whole_ path )
        "       var path = parentRequire.toUrl(name + '." + ext + "'),\n"+
        "           fs, views, output;\n"+
        // So remove it, TODO: Investigate better fix
        "           path   = path.replace('" + cwd + "', '');\n" +
        "       if(config.isBuild){\n"+
        "           path   = path.replace(/\\.|\\//g, '_').replace(/^_+|_+$/g, '');\n"+
        "           fs     = require.nodeRequire('fs'),\n"+
        "           views  = JSON.parse(fs.readFileSync('" + cwd + "/.build/views.json')),\n"+
        "           output = '\/* Template for ' + path + '*\/define([\\'can/view/" + ext + "\\', \\'can/observe\\'], function(can){ return ' + views[path] + ' });'\n"+
        "           buildMap[name] = output;\n"+
        "           load(output);\n"+
        "       } else {\n"+
        "           parentRequire(['can/view/" + ext + "', 'can/observe'], function(can) {\n"+
        "               load(function(data, helpers){\n"+
        "                   return can.view(path, data, helpers)\n"+
        "               });\n"+
        "           });\n"+
        "       }\n"+
        "   };\n"+
        "   Rndrr.write = function (pluginName, name, write) {\n"+
        "       if (buildMap.hasOwnProperty(name)) {\n"+
        "           var text = buildMap[name];\n"+
        "           write.asModule(pluginName + '!' + name, text);\n"+
        "       }\n"+
        "   };\n"+
        "   return Rndrr;\n"+
        "});";
};

var sheets = [
        'jquery.ui.base.css',
        'jquery.ui.theme.css',
        'jquery.ui.datepicker.css',
        'jquery.ui.tooltip.css',
        'jquery.ui.button.css'
    ],
    banner =    '/**\n' +
                ' * This is a compilation of a stylesheets used to put things in there places.\n' +
                ' * If you wish to roll your own theme from the jquery ui themeroller the jquery ui components,\n' +
                ' * the following style sheets are required:\n' +
                ' * - ' + sheets.join('\n * - ') + '\n' +
                ' * documentation for jqueryui theming is available: http://jqueryui.com/themeroller/ \n' +
                ' **/';

/**
 * This Gruntfile provides a `build` task that enables you to combine your
 * EJS and mustache views in the production build.
 *
 * The problem is that r.js is completely synchronous and can-compile uses
 * JSDom library which is async. That's why this build system is complicated
 * and kinda brittle. It should be only a temporary solution.
 * production
 * Build system works like this:
 *
 * 1. Create temp .build folder
 * 2. call can-compile and create .build/views.js file
 * 3. Use esprima and escodegen to parse .build/views.js and convert it to a JSON file
 * 4. Provide custom renderers for mustache and EJS that will get compiled view from the JSON file
 * 5. Call require compile task to create production.js file
 * 6. Remove .build folder to cleanup
 */

module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec : {
            mkbuilddir : {
                cmd : 'mkdir .build'
            },
            rmbuilddir   : {
                cmd : 'rm -rf .build'
            },
            clean: {
                cmd: 'rm -rf app/prod'
            },
            myth: {
                cmd: './node_modules/.bin/myth app/style/style.css app/style/style.out.css'
            },
            test: {
                cmd: './node_modules/.bin/mocha-phantomjs test/index.html'
            },
            commitRelease: {
                cmd: function( version ) {
                    if( version ) {
                        return  'export CURBRANCH=`git rev-parse --abbrev-ref HEAD` && ' +
                                'git pull origin $CURBRANCH && ' +
                                'git commit --allow-empty -am "Release version: ' + version + '" && '  +
                                'git checkout master && ' +
                                'git pull origin master && ' +
                                'git merge $CURBRANCH && ' +
                                'git push origin master';
                    }
                }
            },
            finishRelease: {
                cmd: function() {
                    return  'git checkout develop && ' +
                                'git pull origin develop && ' +
                                'git merge master && ' +
                                'git push origin develop';
                }
            },
            checkoutOldBranch: {
                cmd: function( oldBranch ) {
                    return 'git checkout ' + oldBranch || '`git rev-parse --abbrev-ref HEAD`';
                }
            },
            bower: {
                cmd: './node_modules/.bin/bower install'
            },
            jqueryuiInstall: {
                cmd: './node_modules/.bin/jqueryui-amd app/bower_components/jquery-ui'
            },
            writeChangelog: {
                cmd: function( lastRelease ) {	            
                    return  'git fetch --tags && ' +
                            'echo "Version: ' + grunt.file.readJSON('package.json').version + ' \\n" > app/prod/changelog.txt && ' +
                            'git log --pretty="tformat:+ **%an**: %s" --date=short -E --grep=# --grep=LOG --grep="\\(([A-Z]{2,}-[0-9]{2,})\\)" --no-merges ' +
                            lastRelease + '..HEAD >> app/prod/changelog.txt && ' +
                            'cat app/prod/changelog.txt';
                }
            }
        },
        cancompile: {
            dist: {
                src: ['app/**/*.ejs', '!app/bower_components/**'],
                out: '.build/views.js'
            }
        },
        requirejs : {
            compile : {
                options : {
                    baseUrl: './app',
                    mainConfigFile: 'app/requirejsconfig.js',
                    paths: {
                        // Overwrite ejs to use the compiled templates
                        'ejs': '../.build/ejs'
                    },
                    // we don't actually need to compile the generator
                    exclude: ['ejs'],
                    // Use the almond library as the base, so we don't need requirejs
                    name : 'bower_components/almond/almond',
                    include: [
                        'requirejsconfig',
                        'cottage_booking',
                        'can/view/ejs'
                    ],
                    insertRequire: ['cottage_booking'],
                    // Wrap the production to make a fake module for ejs
                    wrap: {
                        start:  "(function() {",
                        end:    "   define('ejs', function() {});\n" +
                                "}());"
                    },
                    out : 'app/prod/production.js',
                    // optimize: 'none'
                    optimize: 'uglify2'
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.',
                    keepalive : true
                }
            }
        },
        watch: {
            js: {
                files: ['app/**/*.js', '!app/prod/production.js', '!app/bower_components/*'],
                options: {
                    livereload: true
                }
            },
            all: {
                files: ['app/style/style.css', 'app/**/*.js', 'app/**/*.ejs', 'app/**/*.html', '!Gruntfile.js','!app/prod/production.js', '!app/bower_components/*'],
                tasks: ['exec:myth'],
                options: {
                    event: ['changed'],
                    livereload: true
                }
            }
        },
        jshint: {
            prebuild: {
                files: {
                    src: [
                        './app/*.js',
                        './app/**/*.js'
                    ]
                },
                options: {
                    ignores: [
                        './app/prod/production.js',
                        './app/bower_components/**',
                        './Gruntfile.js' // TODO: lint this file
                    ]
                }
            }
            // Run this before uglifying
            // postbuild: {
            //     files: {
            //         src: ['./app/production.js']
            //     }
            // }
        },
        cssmin: {
            build: {
                options: {
                    banner: banner
                },
                files: {
                    // the out file should have been passed through myth
                    'app/prod/production.css': ['app/style/style.out.css']
                }
            },
            jqueryui: {
                options: {
                    banner: banner
                },
                files: {
                    'app/prod/jqueryui.css': _.map(sheets, function( cssPath ) {
                        return 'app/bower_components/jquery-ui/themes/base/' + cssPath;
                    })
                }
            }
        },
        copy: {
            build: {
                src: '*',
                dest: 'app/prod/images/',
                cwd: 'app/bower_components/jquery-ui/themes/base/images/',
                expand: true
            },
            iframejs: {
                src: 'iframe.js',
                dest: 'app/prod/',
                cwd: 'app/',
                expand: true
            }
        },
        compress: {
            build: {
                options: {
                    mode: 'zip',
                    archive: 'app/prod.zip'
                },
                expand: true,
                src: '**',
                cwd: 'app/prod'
            }
        },
        prompt: {
            git: {
                options: {
                    questions:[
                        {
                            config: 'release.git.username',
                            type: 'input',
                            message: 'Please enter your git username',
                            validate: function( user ) {
                                return user ? true : 'Username is required';
                            }
                        },
                        {
                            config: 'release.git.password',
                            type: 'password',
                            message: 'Please enter your git password',
                            validate: function( pass ) {
                                return pass ? true : 'Password is required';
                            }
                        }
                    ]
                }
            }
        },
        bumpup: {
            files: ['package.json', 'bower.json']
        }
    });

    grunt.registerTask('extractViews', function(){
        var file           = fs.readFileSync('.build/views.js'),
            ast            = esprima.parse(file),
            views          = ast.body[0].expression.callee.body.body,
            generatedViews = {};

        views.forEach(function(view){
            var filename = view.expression['arguments'][0].value;
            generatedViews[filename] = escodegen.generate(view);

        });
        fs.writeFileSync('.build/views.json', JSON.stringify(generatedViews));
    });

    grunt.registerTask('createRenderers', function(){
        //fs.writeFileSync('.build/mustache.js', getRenderer('mustache', process.cwd()));
        fs.writeFileSync('.build/ejs.js', getRenderer('ejs', process.cwd()));
    });

    grunt.registerTask('build', function(){
        grunt.task.run(
            'jshint:prebuild',
            'exec:clean',
            'exec:rmbuilddir',
            'exec:mkbuilddir',
            'cancompile',
            'extractViews',
            'createRenderers',
            'requirejs:compile',
            'exec:rmbuilddir',
            'exec:myth',
            'cssmin',
            'copy',
            'changelog',
            'compress'
        );
    });

    grunt.registerTask('changelog', function( v ) {
        grunt.task.run('exec:writeChangelog:' + ( v || grunt.config('pkg').version) );
    });

    grunt.registerTask('test', ['exec:test']);

    grunt.registerTask('release', function( type ) {

        var args = [].slice.call( arguments, 1 );

        type = type || 'patch';
        args.unshift( type );

        grunt.task.run('prompt:git');

        grunt.task.run('test');

        grunt.task.run('bumpup:' + args.join(':') );

        grunt.task.run('build');

        grunt.task.run('commitRelease');

        grunt.task.run('createRelease');

        grunt.task.run('exec:finishRelease');
    });

    grunt.registerTask('commitRelease', function() {
        var version = grunt.file.readJSON('package.json').version;

        grunt.task.run('exec:commitRelease:'+ version);
    });

    function markdownChangelog( changelog ) {
        return changelog.split('\n').map(function( line ) {
            return line.replace(/\(([A-Z]{2,}-[0-9]{2,})\)/g, '[($1)](https://jira.neontribe.org/browse/$1)');
        }).join('\n');
    }

    grunt.registerTask('createRelease', function() {

        var grel,
            done = this.async(),
            Grel = require('grel'),
            version = grunt.file.readJSON('package.json').version,
            message = fs.readFileSync('app/prod/changelog.txt').toString();

        grel = new Grel({
            user: grunt.config('release.git.username'),
            password: grunt.config('release.git.password'),
            owner: 'neontribe',
            repo: 'cottage-booking'
        });

        console.log( 'releasing ' + version );
        console.log( message );

        grel.create( version, markdownChangelog( message ), ['app/prod.zip'], function(error, release) {
            if (error) {
                console.log('Something went wrong', error);
            } else {
                console.log('Release', release.tag_name, 'created');
            }

            done();
        });
    });

    grunt.registerTask('buildViewFiles', function() {
        var viewsTemplate = String( fs.readFileSync('views.template') ),
            controls, views, nameify, removeExt;

        controls = grunt.file.expand([
            'app/controls/*',
            'app'
        ]);

        nameify = function( name ) {
            return name.replace(/(_|-)./g, function( found ) {
                return found.charAt(1).toUpperCase();
            });
        };

        removeExt = function( view ) {
            return view.replace(/\.ejs$/, '');
        };

        for (var i = 0; i < controls.length; i++) {

            views = grunt.file.expand({
                'cwd': controls[i] + '/views'
            }, '*' );

            views = _.map( views, removeExt );

            fs.writeFileSync( controls[i] + '/views.js', _.template( viewsTemplate , {
                views: views,
                nameify: nameify
            }));
        }
    });

    grunt.registerTask('develop', ['exec:bower', 'exec:myth', 'exec:jqueryuiInstall', 'shimCustomSelect']);

    grunt.registerTask('shimCustomSelect', function() {
        var code = fs.readFileSync('app/bower_components/jquery.customSelect/jquery.customSelect.js');

        // shim the customSelect plugin to use the hidden jquery global, not global
        code = 'define([\'jquery\'], function(jQuery) {' + code + '});';

        fs.writeFileSync('app/bower_components/jquery.customSelect/jquery.customSelect.amd.js', code );
    });

    grunt.registerTask('default', 'develop');

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('can-compile');

};
