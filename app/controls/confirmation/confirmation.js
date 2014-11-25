define([
    'can/util/string',
    './views',
    'resources/book',
    'can/control'
], function( can, views, booking ) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking,
            deferPayment: { 
              show: true,
              labels: {
                paylater: 'On tick',
                paynow: 'Up front',
                confirmationMessage: 'Free cottages! We\'ll call you soon'
              },
              default: 'paylater'
            }
        }
    }, {
        init: function() {
            this.element.html( views.init({
                booking: booking,
                deferPayment: this.options.deferPayment
            }) );
        }
    });

});