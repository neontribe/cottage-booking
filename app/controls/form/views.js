/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/checkbox',
    'ejs!./views/datepicker',
    'ejs!./views/errors',
    'ejs!./views/errors_wrapper',
    'ejs!./views/model_multi_checkbox',
    'ejs!./views/number',
    'ejs!./views/radio',
    'ejs!./views/select',
    'ejs!./views/text',
    'ejs!./views/wrapper'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'checkbox': args[0],
        'datepicker': args[1],
        'errors': args[2],
        'errorsWrapper': args[3],
        'modelMultiCheckbox': args[4],
        'number': args[5],
        'radio': args[6],
        'select': args[7],
        'text': args[8],
        'wrapper': args[9]
    };
});
/* End of file */
