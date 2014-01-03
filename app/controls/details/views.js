/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/adult',
    'ejs!./views/child',
    'ejs!./views/init'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'adult': args[0],
        'child': args[1],
        'init': args[2]
    };
});
/* End of file */
