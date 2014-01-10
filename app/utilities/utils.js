define([
    'can/util/string',
    'moment'
], function( can, moment ) {
    'use strict';

    var slice = Array.prototype.slice;

    return {
        fragmentToString: function( frag ) {
            // Slight overhead..
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
        },
        constructWith: function( Constructor, args ) {
            // Instantiate a new Class style function, which will create the Constructor with the given args
            function C() {
                return Constructor.apply( this, args );
            }
            // Properly sort out the prototype
            C.prototype = Constructor.prototype;
            // Return the new Class
            return new C();
        },
        rangeOfClasses: function( size, Construct ) {
            var args = slice.call( arguments, 2 );

            if( size > 0 ) {
                return can.map( new Array( size ), function( undef, key, that ) {
                    return that.constructWith( Construct, args );
                }, this);
            }

            return [];
        },
        now: function() {
            return moment( new Date() );
        }
    };

});