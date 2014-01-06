define([
    'can/util/string',
    'can/model',
    'can/map/validations'
], function( can ){
    'use strict';

    return can.Model({
        types: {
            /*
            'Count key' : 'type'
             */
            'children'  : 'child',
            'adults'    : 'adult',
            'infants'   : 'infant'
        }
    }, {
        'init': function() {
            console.log('IM HERE');
        }
    });

});