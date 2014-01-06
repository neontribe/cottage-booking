define(['can/util/string', 'models/traveller', 'underscore', 'utils'], function( can, Traveller, _, utils ) {
    'use strict';

    Traveller.List = Traveller.List.extend({

        _store: {},

        'type': function( type ) {
            return type ? ( _.groupBy( this, 'type' )[ type ] || [] ) : _.groupBy( this, 'type' );
        },

        'removeType': function( type ) {
            var removeIndex;
            this.each(function( trav, index ) {
                if( trav.attr('type') === type ) {
                    // Don't return false, so we can find the last instance of this type
                    removeIndex = index;
                }
            });
            return this.removeAttr( removeIndex );
        },

        'mutate': function( types ) {
console.log('miuteate');
            var current = this.type();

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
                        this.push( this._store[add++] || new Traveller({'type': type}) );
                    }
                } else if( current[ type ] ) {

                    while( this.type( type ).length > types[ type ] ) {
                        this.removeType( type );
                    }
                }

                delete types[ type ];

            }, this );

            // By now we should only need to add new ones
            can.each( types, function( count, type ) {
                this.push.apply( this, utils.rangeOfClasses( count, Traveller, {'type': type} ) );
            }, this );

            return this;
        }
    });

    return Traveller;

});