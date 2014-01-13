/**
 * @return {Model} The enquiry model to be shared by the app
 */
define([
    'can/util/string',
    'controls/calendar/calendar',
    'controls/details/details',
    'underscore'
], function( can, Calendar, Details, _ ) {
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
        }
    });

    // This will get cached by the require stack, so next time we require this file we
    // should get the one that exists already in the current invocation of the app
    return new StageList([
        {
            'id'            : 'calendar',
            'Control'       : Calendar,
            'options'       : {}
        },
        {
            'id'            : 'details',
            'Control'       : Details,
            'options'       : {}
        },
        {
            'id'            : 'payment'
        },
        {
            'id'            : 'confirmation'
        }
    ]);
});