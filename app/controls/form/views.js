/**
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern. Also would be cool as a
 * plugin type thing in requirejs
 */
define([
    'utils/helpers',
    'ejs!./views/text',
    'ejs!./views/datapicker'
], function() {
    'use strict';

    var args = [].slice.call( arguments, 1 );

    return {
        'text':         args[0],
        'datepicker':   args[1]
    };
});