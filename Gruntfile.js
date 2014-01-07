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
        exec : {
            mkbuilddir : {
                cmd : 'mkdir .build'
            },
            rmbuilddir   : {
                cmd : 'rm -rf .build'
            },
            myth: {
                cmd: 'myth app/style/style.css app/style/style.out.css'
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
                    out : 'app/production.js',
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
                files: ['app/**/*.js', '!app/production.js', '!app/bower_components/*'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: 'app/style/style.css',
                tasks: ['exec:myth'],
                options: {
                    event: ['changed'],
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
                        './app/production.js',
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
        }
    });

    grunt.registerTask('extractViews', function(){
        var file           = fs.readFileSync('.build/views.js'),
            ast            = esprima.parse(file),
            views          = ast.body[0].expression.callee.body.body,
            generatedViews = {};

        views.forEach(function(view){
            var filename = view.expression.arguments[0].value;
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
            'exec:rmbuilddir',
            'exec:mkbuilddir',
            'cancompile',
            'extractViews',
            'createRenderers',
            'requirejs:compile',
            'exec:rmbuilddir',
            'exec:myth'
        );
    });

    grunt.registerTask('buildViewFiles', function() {
        var viewsTemplate = String( fs.readFileSync('views.template') ),
            controls, views, nameify, removeExt;

        controls = grunt.file.expand([
            'app/controls/*',
            'app'
        ]);

        nameify = function( name ) {
            return name.replace(/(_|-)./, function( found ) {
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

    grunt.registerTask('default', 'build');

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('can-compile');

};