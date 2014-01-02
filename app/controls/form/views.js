/**
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'helpers',
    'ejs!./views/wrapper',
    'ejs!./views/errors',
    'ejs!./views/text',
    'ejs!./views/datapicker',
    'ejs!./views/errors_wrapper',
    'ejs!./views/select',
    'ejs!./views/checkbox'
], function() {
    'use strict';

    var args = Array.prototype.call( arguments, 1 );

    return {
        'wrapper':          args[0],
        'errors':           args[1],
        'text':             args[2],
        'datepicker':       args[3],
        'errorsWrapper':    args[4],
        'select':           args[5],
        'checkbox':         args[6]
    };
});