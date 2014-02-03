/**
 *  This file needs to be included in the sagepay callback page, along with any relevant information.
 *  We expose a tiny api with this file, default behaviour is to auto advance when we get a successful payment.
 *  actions available:
 *  - 'back'            // Go back a step in the booking path
 *  - 'autoadvance'     // Attempt to auto advance
 *  - 'error'           // Stop and display an error ( the message element ) on the payment screen
 *  - 'retry'           // Reload the payment screen
 */
(function( $, window ) {
    'use strict';

    window.registerMessage = function registerMessage( status, message, action ) {

        var generatedObj, messageObj;

        if( typeof status !== 'object' ) {
            generatedObj = {
                status: status,
                message: message,
                action: action
            };
        } else {
            generatedObj = status;
        }

        messageObj = $.extend(
            // defaults
            {
                status: 'error',
                message: 'A message wasn\'t provided',
                action: 'error'
            },
            // options
            generatedObj);

        window.top.postMessage( JSON.stringify( messageObj ), window.location.origin);

    };
    
})( jQuery, window );