/**
 */
define([
    'can/util/string',
    'utils',
    'resources/book',
    'can/model',
    'can/map/validations'
], function( can, utils ){
    'use strict';

    return can.Model({

        create: utils.getResource('POST property/booking/{id}/pay'),
        update: utils.getResource('POST property/booking/{id}/pay'),

        // defaults: {
        //     'payLater': false,
        //     // balance: pay the full amount
        //     // deposit: just pay the deposit
        //     'paymentType': 'balance'
        // }
        'init': function() {
            this.validate('Status', function( status ) {
                if( status && status.toLowerCase() !== 'ok' ) {
                    return this.attr('StatusDetails');
                }
            });
        }
    }, {
    });

});