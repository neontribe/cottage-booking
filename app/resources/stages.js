/**
 * @return {Model} The enquiry model to be shared by the app
 */
define([
    'can/util/string',
    'controls/calendar/calendar',
    'controls/details/details',
    'controls/payment/payment',
    'controls/confirmation/confirmation',
    'underscore'
], function( can, Calendar, Details, Payment, Confirmation, _ ) {
    'use strict';

    var StageList = can.Model.List.extend({
        'getById': function( id ) {
            return _.findWhere( this, { id: id } );
        },
        'indexOf': function( id ) {
            if( typeof id === 'string' ) {
                return can.Model.List.prototype.indexOf.call( this, this.getById( id ) );
            }
            return can.Model.List.prototype.indexOf.call( this, id );
        },
        'next': function( curr ) {
            var next = this.indexOf( curr );

            // We're at the end of the stages arr
            if( next >= this.attr('length') - 1 ) {
                return -1;
            }

            return ++next;
        }
    });

    // This will get cached by the require stack, so next time we require this file we
    // should get the one that exists already in the current invocation of the app
    return new StageList([
        /**
         * The calendar stage
         */
        {
            'id'            : 'calendar',
            'Control'       : Calendar,
            'options'       : {}
        },
        /**
         * The details stage
         */
        {
            'id'            : 'details',
            'Control'       : Details,
            'options'       : {}
        },
        /**
         * The payment stage
         * We set destroy: true so that we make sure that the payment screen is always up to date.
         */
        {
            'id'            : 'payment',
            'Control'       : Payment,
            'destroy'       : true
        },
        /**
         * The confirmation stage
         */
        {
            'id'            : 'confirmation',
            'Control'       : Confirmation
        }
    ]);
});