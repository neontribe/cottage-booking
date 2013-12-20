define(['can/util/string', 'accounting', 'can/view/ejs'], function( can, accounting ) {
    'use strict';

    can.extend( can.EJS.Helpers.prototype, {
        money: function( value, format ) {
            return accounting.formatMoney( value, {
                format: format,
                symbol: '£'
            });
        },

        template: function( templFn, data ) {
            return function( el ) {
                can.$(el).html( templFn( data ) );
                return '';
            };
        }
    });

    return can;

});