/**
 * @return {Model} The enquiry model to be shared by the app
 */
define([
    'can/util/string',
    'controls/calendar/calendar',
    'controls/details/details'
], function( can, Calendar, Details ) {
    'use strict';

    // This will get cached by the require stack, so next time we require this file we
    // should get the one that exists already in the current invocation of the app
    return new can.Model({
        'calendar': {
            'Control': Calendar,
            'options': {}
        },
        'details': {
            'Control': Details,
            'options': {}
        },
        'payment': {},
        'confirmation': {}
    });
});