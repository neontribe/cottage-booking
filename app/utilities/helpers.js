define(['can/util/string', 'accounting', 'underscore', 'can/view/ejs'], function( can, accounting, _ ) {
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
        uniqueId: _.uniqueId,

        assignAsContent: function( self ) {
            return function( el ) {
                self.content = can.$( el );
            };
        },

        /**
         * This helper will link an anchor to change the route and then prevent bubbling
         * This is particularly handy for jquery ui plugins which bind and return false themselves
         * @param  {Function} checker If this function returns something falsey we wont
         * @return {Boolean}          Prevent this event from reaching the url bar
         */
        link: function( checker ) {
            return function( el ) {
                can.$( el ).on('click', function() {

                    var page = this.href ? this.href.split('#').pop() : false;

                    if( page && checker && checker.apply( can.$( this ), arguments ) ) {
                        can.route.attr('page', page);
                    }

                    //TODO: Investigate whether we need to manually bubble this event,
                    // Incase we need to monitor for idleness
                    return false;
                });
            };
        }
    });

    return can;

});