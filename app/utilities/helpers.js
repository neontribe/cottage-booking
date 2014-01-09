define(['can/util/string', 'accounting', 'can/view/ejs'], function( can, accounting ) {
    'use strict';

    can.extend( can.EJS.Helpers.prototype, {
        money: function( value, format ) {
            return accounting.formatMoney( value, {
                format: format,
                symbol: '£'
            });
        },

        appendTemplate: function( templFn, data ) {
            return function( el ) {
                can.$(el).append( templFn( data ) );
                //can.$(templFn( data )).insertAfter( el );
            };
        },

        replaceWithTemplate: function( templFn, data ) {
            return function( el ) {
                can.$(el).replace( templFn( data ) );
                //can.$(templFn( data )).insertAfter( el );
            };
        },

        sub: can.sub,
        capitalize: can.capitalize,

        assignAsContent: function( self ) {
            return function( el ) {
                self.content = can.$( el );
            };
        },

        link: function( cb ) {
            return function( el ) {
                can.$( el ).on('click', cb ? cb : function() {

                    var page = this.href ? this.href.split('#').pop() : false;

                    if( page ) {
                        can.route.attr('page', page);
                    }

                    return false;
                });
            };
        }
    });

    return can;

});