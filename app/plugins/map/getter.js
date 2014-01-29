/**
 * This file extends the default behaviour of can.Map
 * so that if we try and do .attr('attributeName()') and
 * the value at .attr('attributeName') is a function, we return the value there
 */
define(['can/util/string', 'can/map'], function( can ) {
    'use strict';

    var slice   = Array.prototype.slice,
        _get    = can.Map.prototype._get,
        __get   = can.Map.prototype.__get,
        bind    = can.Map.prototype.bind;

    can.extend( can.Map.prototype, {

        /** Fix patch the _get behaviour **/
        '_get': function( attr ) {

            var value;
            if( typeof attr === 'string' && !!~attr.indexOf('.') ) {
                value = this.__get(attr);
                if( value !== undefined ) {
                    return value;
                }
            }

            return _get.call( this, attr );

        },

        'bind': function() {
            var args = slice.call( arguments, 1 ),
                eventName = arguments[0];

            if( typeof eventName === 'string' && eventName.slice( -2 ) === '()' ) {
                eventName = eventName.slice(0, -2);
            }

            return bind.apply( this, [eventName].concat(args) );
        },

        '__get': function( attr ) {
            var _attr = (attr && attr.slice( -2 ) === '()') ? attr.slice(0, -2) : attr,
                val = __get.call( this, _attr );

            if( _attr && attr.slice( -2 ) === '()' && can.isFunction( val ) ) {
                return val();
            }

            return val;
        }
    });

    return can.Map;
});