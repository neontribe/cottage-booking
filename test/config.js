requirejs.config({
    baseUrl : '../app',
    paths: {
        jquery:         'resources/jquery',
        mocha:          'bower_components/mocha/mocha',
        chai:           'bower_components/chai/chai',
        'chai-jquery':  'bower_components/chai-jquery/chai-jquery',
        'underscore':   'bower_components/underscore/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

define(['requirejsconfig']);