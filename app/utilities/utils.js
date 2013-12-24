define([
    'can/util/string'
], function( can ) {
    'use strict';

    var slice = Array.prototype.slice;

    return {
        fragmentToString: function( frag ) {
            return can.$('<div>').html( frag ).html();
        },
        bindWithThat: function( fn, context, that ) {
            return function() {
                return fn.apply( context, [that].concat( slice.call( arguments ) ) );
            };
        },
        bindWithThis: function( fn, context ) {
            return function() {
                return fn.apply( context, [this].concat( slice.call( arguments ) ) );
            };
        }
    };

});