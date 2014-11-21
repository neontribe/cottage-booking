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
    'ejs!./views/mixed_checkbox_select',
    'ejs!./views/model_multi_checkbox',
    'ejs!./views/number',
    'ejs!./views/radio',
    'ejs!./views/select',
    'ejs!./views/text',
    'ejs!./views/textarea',
    'ejs!./views/wrapper'
], function() {
    'use strict';

    var args = Array.prototype.slice.call( arguments, 1 );

    return {
        'checkbox': args[0],
        'datepicker': args[1],
        'errors': args[2],
        'errorsWrapper': args[3],
        'mixedCheckboxSelect': args[4],
        'modelMultiCheckbox': args[5],
        'number': args[6],
        'radio': args[7],
        'select': args[8],
        'text': args[9],
        'textarea': args[10],
        'wrapper': args[11]
    };
});
/* End of file */
