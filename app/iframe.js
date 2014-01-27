/**
 *  This file needs to be included in the sagepay callback page, along with any relevant information.
 */
(function( $, window ) {
	'use strict';

	window.top.postMessage('message', window.location.origin);
})( jQuery, window );