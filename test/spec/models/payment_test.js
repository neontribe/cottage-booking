/**
 */
define([
    'can/util/string',
    'utils',
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
                    return this.attr('StatusDetail');
                }
            });
        }
    }, {
        reset: function() {
            this.removeAttr('NextURL');
            this.removeAttr('Status');
            return this;
        },

        /**
         * We overwrite the save function here so that we only ever make one a save request at a time.
         * Otherwise we return the deferred in transit.
         * @return {$.Deferred} The deferred object in transit
         */
        transit: null,
        save: function( success, error ) {
            var self = this;
            if( !this.transit ) {
                this.transit = can.Model.prototype.save.apply( this, arguments ).always(function() {
                    self.transit = null;
                });
            } else {
                this.transit.done( success ).fail( error );
            }

            return this.transit;
        }
    });

});