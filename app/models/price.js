/**
 */
define(['can/util/string', 'can/model', 'can/compute'], function( can ){
    'use strict';

    return can.Model({
        model: function( priceObj ) {
            // Sometimes we can get an array as part of the price, it should only be when it's empty
            if( can.isArray( priceObj.extras ) ) {
                priceObj.extras = {};
            }
            return can.Model.model.call( this, priceObj );
        }
    }, {

        displayPrice: can.compute(function() {
            if( this.attr('paymentType') === 'deposit' ) {

                return this.attr('depositAmount');

            }

            return this.attr('totalPrice');
        }),

        serialize: function() {
            var serialized = can.Model.prototype.serialize.call( this );
            // If we have no extras set, make sure the server knows about it
            // http://bugs.jquery.com/ticket/6481#comment:12
            if( can.isEmptyObject( serialized.extras ) ) {
                serialized.extras = {'__empty__': true};
            }
            return serialized;
        }
    });

});
