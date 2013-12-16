define(['can/util/string'], function( can ){
    'use strict';
    /* globals window, location */
    var drupalCottage = can.getObject('Drupal.settings.cottage', window, true),
        queryObj = can.deparam( location.search.slice(1) );

    can.extend( drupalCottage, {
        'propRef': 'A223_ZZ'
    }, queryObj );

    return window.Drupal;

});
