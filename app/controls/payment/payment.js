define([
    'can/util/string',
    './views',
    'resources/book',
    'models/payment',
    // extras
    'can/control',
    'can/control/plugin',
    'controls/form/form'
], function( can, views, booking, Payment ) {
    'use strict';
    
    return can.Control({
        defaults: {
            booking: booking,
            payment: null
        }
    }, {
        init: function() {
            this.options.payment = new Payment();

            this.element.html( views.init( this.options ) );
            this.on();
        },

        '{payment} NextURL': function() {

            this.options.content.html( views.iframe({

            }) );
        }
    });

});