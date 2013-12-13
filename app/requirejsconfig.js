requirejs.config({
    paths: {
        can         : 'bower_components/canjs/amd/can',
        jquery      : 'resources/jquery',
        ejs         : 'bower_components/require-can-renderers/lib/ejs',
        jqueryui    : 'bower_components/jquery-ui/ui',
        moment      : 'bower_components/momentjs/moment',
        underscore  : 'bower_components/underscore/underscore'
        //devtools : 'bower_components/devtools-snippets/snippets', reference full path for dev environments you lazy git
        //config   : 'config/config' <- A model available as a singleton, which will integrate options from drupal
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        underscore: {
            exports: '_',
            /**
             * Make sure that the global '_' variable is removed form the scope
             * @return {underscore} Returns the underscore variable
             */
            init: function() {
                /* jshint strict: false */
                /* globals _ */
                return _.noConflict();
            }
        },
        moment: {
            exports: 'moment',
            // TODO: Incorperate moment ranges some how
            deps: ['bower_components/moment-range/lib/moment-range']
        }
    },
    noGlobal: true
});