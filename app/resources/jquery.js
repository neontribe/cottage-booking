define('jquery', function() {
    'use strict';

    return jQuery;

    // Not so sure about this
    // return jQuery.extend(function() {
    //  var args = jQuery.makeArray( arguments );

    //  if( !args[ 1 ] ) {
    //      // Splice in our selector for the root of the app
    //      args.splice( 1, 1, '#toccBooking' );
    //  }

    //  return jQuery.apply( jQuery, args );
    // }, jQuery);

});