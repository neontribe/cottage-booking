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
            
//            this.validate('age', function( age ) {
//              debugger;
              // if custom validation on ages is supported
              // if this is a child
              // if the age is > min age
//                if( status && status !== 'ok' ) {
//                    return this.attr('message') || 'An unknown error occurred';
//                }
//            });
        }
    }, {});

});
