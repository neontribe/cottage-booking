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
            'adults'    : 'adult',
            'children'  : 'child',
            'infants'   : 'infant'
        },

        'default': {
            'type': 'adult'
        },

        init: function() {
            //this.validatePresenceOf(['firstName', 'surname', 'age']);

            // this.validate(['title'], function( title ) {
            //     if( this.attr('type') === 'adult' && !title ) {
            //         return 'Title is required';
            //     }
            // });
        }
    }, {});

});
