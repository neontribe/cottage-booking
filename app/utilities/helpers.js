define([
    'can/util/string',
    'accounting',
    'underscore',
    'utils',
    'can/view/ejs',
    'can/route',
    'can/observe'
], function( can, accounting, _, utils ) {
    'use strict';

    var slice = Array.prototype.slice,
        deCamalizeRegex = /([a-z\d])([A-Z])/g,
        dotPretifierRegex = /([[a-z]^\ ])\.([[a-z]^\ ])/g;

    can.extend( can.EJS.Helpers.prototype, {
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
        },

        next: function() {
            return function( el ) {
                can.$( el ).attr('href', '#next').addClass('next').on('click', function() {

                    can.trigger( can.route.data, 'next', [ can.route.attr() ] );

                    // Only behave like this if we don't have a href
                    if( this.href || this.tagName.toLowerCase() === 'a' ) {
                        return false;
                    }
                });
            };
        },

        restart: function() {
            return function( el ) {
                can.$( el ).addClass('restart').on('click', function() {

                    can.trigger( can.route.data, 'restart', [ can.route.attr() ] );

                    // Only behave like this if we don't have a href
                    if( this.href || this.tagName.toLowerCase() === 'a' ) {
                        return false;
                    }
                });
            };
        },

        pretifyString: function( str, cap ) {
            var newStr;
            if( str && typeof str === 'string') {

                newStr = str
                    .replace(deCamalizeRegex, '$1 $2')
                    .replace(dotPretifierRegex, '$1 $2');
                return cap ?
                    (newStr.charAt(0).toUpperCase() + newStr.slice(1)) :
                    newStr.toLowerCase();
            }
            return '';
        },

        jQueryPlugin: function( name ) {
            var args = slice.call( arguments, 1 ),
                plugin = can.$.fn[ name ];

            if( can.isFunction( plugin ) ) {
                return function( el ) {

                    return plugin.apply( can.$( el ), args );

                };
            }
            return 'Helper error: Could not find plugin: ' + name;
        },

        /* ------------- */
        // functions taken from can, utils and uderscore
        url: can.route.url,
        sub: can.sub,
        capitalize: can.capitalize,
        uniqueId: _.uniqueId,
        money: utils.money
    });

    return can;

});