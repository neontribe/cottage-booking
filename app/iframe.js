/**
 *  This file needs to be included in the sagepay callback page, along with any relevant information.
 *  We expose a tiny api with this file, default behaviour is to auto advance when we get a successful payment.
 */
(function( $, window ) {
    'use strict';

    /**
     * This function exposes a small API to communicate with the parent
     * frame, in this case being the Booking Path
     * The function is overloaded so it can take 3 arguments or an object 
     *
     * The possible actions are:
     *  - 'back'            // Go back a step in the booking path
     *  - 'autoadvance'     // Attempt to auto advance
     *  - 'error'           // Stop and display an error ( the message element ) on the payment screen
     *  - 'retry'           // Reload the payment screen
     *
     * @codestart
     * 
     * regsiterMessage({
     *     status: 'error',
     *     message: 'A message wasn\'t provided',
     *     action: 'error'
     * });
     * // OR
     * regsiterMessage( 'status', 'message', 'action' );
     * 
     * @codeend
     * 
     * @function registerMessage
     * @param  {Object OR String}   status  An object with the 3 params or the string containing the status message or code
     * @param  {String}             message The message to display
     * @param  {String}             action  The action to take
     * @return {undefined}
     */
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