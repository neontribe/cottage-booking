define([
    'can/util/string',
    'moment',
    'accounting',
    'underscore',
    'can/compute',
    'can/model'
], function( can, moment, accounting, _ ) {
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
        bindAndCallAfter: function( fn, context, time ) {
            return function() {
                return setTimeout(_.bind.apply( _, [fn, context || this].concat( slice.call( arguments ) ) ), context, time || 1);
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
        },
        money: function( value, format ) {
            return accounting.formatMoney( value, {
                format: format,
                symbol: '£'
            });
        },
        getResource: function( url, type ) {
            var utils = this;
            return function() {
                var generatedUrl = utils.getResourceUrl( url, type ),
                    args = _.filter( arguments, can.isPlainObject );

                return can.Model._ajax({}, generatedUrl ).apply(this, args);
            };
        },
        getResourceUrl: function( url, type ) {
            var splitted = url.split(' ');
            return can.sub('{type} {base}{url}', {
                type: type || (splitted.length > 1 ? splitted[0] : 'GET'),
                base: this.baseUrl(),
                url: splitted[1] || url
            });
        },
        getNightsBetween: function( start, end ) {
            if( !start || !end ) {return '';}
            return Math.round( (end.unix() - start.unix()) / (60 * 60 * 24));
        },
        modelPick: function( model, keys ) {
            var res = {},
                i;

            if( keys.length ) {
                for (i = 0; i < keys.length; i++) {
                    can.getObject( keys[i], res, true );
                }
                res = new can.Map( res );
                for (i = 0; i < keys.length; i++) {
                    res.attr( keys[i], model.attr( keys[i] ) );
                }
                return res.serialize();
            }

            return res;
        },
        baseUrl: can.compute('/'),
        delay: function( fn, wait ) {
            return function() {
                var context = this;
                var args = slice.call( arguments );
                setTimeout(function() { fn.apply( context, args ); }, wait||0);
            };
        }
    };

});
