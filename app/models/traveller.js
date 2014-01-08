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
        },

        'default': {
            'type': 'adult'
        },

        init: function() {
            this.validatePresenceOf(['firstName', 'surname', 'age']);

            this.validate(['age'], function( age ) {
                if( this.attr('type') === 'adult' && !age ) {

                }
            });
        }
    }, {
        'init': function() {
            console.log('IM HERE');
        }
    });

});