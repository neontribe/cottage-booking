requirejs.config({
    paths: {
        'can'             : 'bower_components/canjs/amd/can',
        'jquery'          : 'resources/jquery',
        'ejs'             : 'bower_components/require-can-renderers/lib/ejs',
        'jqueryui'        : 'bower_components/jquery-ui/ui',
        'moment'          : 'bower_components/momentjs/moment',
        'underscore'      : 'bower_components/underscore/underscore',
        'accounting'      : 'bower_components/accounting.js/accounting',
        'spin'            : 'bower_components/spin.js/spin',
        'spinner'         : 'bower_components/spin.js/jquery.spin',
        'idle'            : 'bower_components/jquery-idletimer/dist/idle-timer',
        'utils'           : 'utilities/utils',
        'helpers'         : 'utilities/helpers'
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
        idle: ['jquery'],
        // Add these as I need them
        'jqueryui/jquery.ui.datepicker':    ['jqueryui/jquery.ui.core'],
        'jqueryui/jquery.ui.tooltip':       ['jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.widget', 'jqueryui/jquery.ui.position'],
        'jqueryui/jquery.ui.tabs':          ['jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.widget', 'jqueryui/jquery.ui.effect-blind'],
        'jqueryui/jquery.ui.effect-blind':  ['jqueryui/jquery.ui.effect'],
        'jqueryui/jquery.ui.autocomplete':  ['jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.widget', 'jqueryui/jquery.ui.position', 'jqueryui/jquery.ui.menu']
    },
    noGlobal: true
});