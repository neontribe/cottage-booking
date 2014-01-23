/**
 */
define([
    'can/util/string',
    'resources/book',
    'can/model',
    'can/compute'
], function( can ){
    'use strict';

    return can.Model({

        create: 'POST property/booking/{id}/pay',
        update: 'POST property/booking/{id}/pay',

        // defaults: {
        //     'payLater': false,
        //     // balance: pay the full amount
        //     // deposit: just pay the deposit
        //     'paymentType': 'balance'
        // }
    }, {
    });

});