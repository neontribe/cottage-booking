requirejs.config({
    paths: {
        'can'             : 'bower_components/canjs/amd/can',
        'jquery'          : 'resources/jquery',
        'ejs'             : 'bower_components/require-can-renderers/lib/ejs',
        'jqueryui'        : 'bower_components/jquery-ui/ui',
        'moment'          : 'bower_components/momentjs/moment',
        'underscore'      : 'bower_components/underscore/underscore',
        'accounting'      : 'bower_components/accounting.js/accounting',
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
        // Add these as I need them
        'jqueryui/jquery.ui.datepicker':    ['jqueryui/jquery.ui.core'],
        'jqueryui/jquery.ui.tooltip':       ['jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.widget', 'jqueryui/jquery.ui.position'],
        'jqueryui/jquery.ui.tabs':          ['jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.widget']
    },
    noGlobal: true
});