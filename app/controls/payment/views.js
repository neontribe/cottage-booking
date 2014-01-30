/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/booking-404',
    'ejs!./views/booking-409',
    'ejs!./views/error',
    'ejs!./views/init'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'booking404': args[0],
        'booking409': args[1],
        'error': args[2],
        'init': args[3]
    };
});
/* End of file */
