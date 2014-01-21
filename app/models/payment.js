/**
 */
define([
    'can/util/string',
    'resources/book',
    'can/model',
    'can/compute'
], function( can, booking ){
    'use strict';

    return can.Model({

        create: 'POST property/booking/{booking.bookingId}/pay',
        update: 'POST property/booking/{booking.bookingId}/pay',

        defaults: {
            'booking': booking,
            'payLater': false,
            // balance: pay the full amount
            // deposit: just pay the deposit
            'paymentType': 'balance'
        }
    }, {

    });

});