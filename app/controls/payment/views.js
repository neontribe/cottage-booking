/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/iframe',
    'ejs!./views/init'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'iframe': args[0],
        'init': args[1]
    };
});
/* End of file */
