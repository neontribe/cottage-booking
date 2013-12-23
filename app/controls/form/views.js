/**
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'utils/helpers',
    'ejs!./views/wrapper',
    'ejs!./views/errors',
    'ejs!./views/text',
    'ejs!./views/datapicker',
    'ejs!./views/error_box'
], function() {
    'use strict';

    var args = [].slice.call( arguments, 1 );

    return {
        'wrapper':      args[0],
        'errors':       args[1],
        'text':         args[2],
        'datepicker':   args[3],
        'error_box':    args[4]
    };
});