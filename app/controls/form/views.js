/** 
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/autocomplete',
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
        'autocomplete': args[0],
        'checkbox': args[1],
        'datepicker': args[2],
        'errors': args[3],
        'errorsWrapper': args[4],
        'modelMultiCheckbox': args[5],
        'number': args[6],
        'radio': args[7],
        'select': args[8],
        'text': args[9],
        'wrapper': args[10]
    };
});
/* End of file */
