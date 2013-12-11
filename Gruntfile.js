var esprima   = require('esprima'),
    fs        = require('fs'),
    escodegen = require('escodegen');

// THE PATHING IS FUCKED                                                                        !!!!!!
// define('ejs!controls/calendar/init',['can/view/ejs', 'can/observe'], function(can){ return undefined });
var getRenderer = function(ext, cwd){
    return "define(function() {\n"+
        "   var Rndrr = {},\n"+
        "       buildMap = {};\n"+
        "   Rndrr.load = function(name, parentRequire, load, config) {\n"+
        "       var path = parentRequire.toUrl(name + '." + ext + "'),\n"+
        "           fs, views, output;\n"+
        "       if(config.isBuild){\n"+
        "           path   = path.replace(/\\.|\\//g, '_').replace(/^_+|_+$/g, '');\n"+
        "           fs     = require.nodeRequire('fs'),\n"+
        "           views  = JSON.parse(fs.readFileSync('" + cwd + "/.build/views.json')),\n"+
        "           output = 'define([\\'can/view/" + ext + "\\', \\'can/observe\\'], function(can){ return ' + views[path] + ' });'\n"+
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
}

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
                        // THE PATHING IS FUCKED                                                                        !!!!!!
                        // define('ejs!controls/calendar/init',['can/view/ejs', 'can/observe'], function(can){ return undefined });
                        'ejs': '../.build/ejs'
                    },
                    name : 'bower_components/almond/almond',
                    include: [
                        'requirejsconfig',
                        'cottage_booking'
                    ],
                    insertRequire: ['cottage_booking'],
                    wrap: true,
                    out : 'app/production.js',
                    optimize: 'none'
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
                files: 'app/**/*.js',
                options: {
                    livereload: true,
                },
            },
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
                        './production.js',
                        './app/bower_components/**',
                        './node_modules/**',
                        './Gruntfile.js' // TODO: lint this file
                    ]
                }
            },
            postbuild: {
                files: ['./production.js']
            }
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
            'exec:rmbuilddir',
            'exec:mkbuilddir',
            'cancompile',
            'extractViews',
            'createRenderers',
            'requirejs:compile'
            //'exec:rmbuilddir'
        );
    });

    grunt.registerTask('default', 'build');

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('can-compile');

};