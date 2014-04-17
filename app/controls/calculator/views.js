/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/calculator',
    'ejs!./views/init',
    'ejs!./views/priced_item',
		'ejs!./views/priced_table',
    'ejs!./views/summary'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'calculator': args[0],
        'init': args[1],
				'pricedItem': args[2],
        'pricedTable': args[3],
        'summary': args[4]
    };
});
/* End of file */
