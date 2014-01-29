/**
 *  This file needs to be included in the sagepay callback page, along with any relevant information.
 */
(function( $, window ) {
    'use strict';
    
    if( window.top !== window && window.Drupal && window.Drupal.settings && window.Drupal.settings.bookingData ) {
        window.top.postMessage( JSON.stringify( window.Drupal.settings.bookingData ), window.location.origin);
    }
    
})( jQuery, window );