define(['can/util/string', 'models/traveller', 'underscore', 'utils'], function( can, Traveller, _, utils ) {
    'use strict';

    Traveller.List = Traveller.List.extend({

        _store: {},

        'type': function( type ) {
            return type ? ( _.groupBy( this, 'type' )[ type ] || [] ) : _.groupBy( this, 'type' );
        },

        'removeType': function( type ) {
            for (var i = this.length - 1; i >= 0; i--) {
                if( this[i].type === type ) {
                    return this.removeAttr( i );
                }
            }
            return false;
        },

        'mutate': function( types ) {
console.log('miuteate');
            var current = this.type(),
                status = true;

            can.each( current, function( travs, type ) {
                var add;
                if( !this._store[type] || this._store[type].length < travs.length ) {
                    this._store[ type ] = travs;
                }

                if( !types[ type ] ){
                    types[ type ] = 0;
                }

                if( types[ type ] > travs.length ) {
                    add = travs.length;

                    while( this.type( type ).length < types[ type ] ) {
                        if( this._store[ type ] ) {
                            this.push( this._store[ type ][ add++ ] || new Traveller({'type': type}) );
                        } else {
                            this.push( new Traveller({'type': type}) );
                        }
                    }
                } else if( current[ type ] ) {

                    while( this.type( type ).length > types[ type ] && status ) {
                        status = this.removeType( type );
                    }

                }

                delete types[ type ];

            }, this );

            // By now we should only need to add new ones
            can.each( types, function( count, type ) {
                if( count ) {
                    this.push.apply( this, utils.rangeOfClasses( count, Traveller, {'type': type} ) );
                }
            }, this );

            return this;
        }
    });

    return Traveller;

});