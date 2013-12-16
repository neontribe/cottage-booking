/**
 * Avail describes the singleton that will contain the availability
 * information for the cottage this app is constructed for
 * @return {Model} The enquiry model to be shared by the app
 */
define(['can/util/string', 'models/enquiry'], function( can, Enquiry ) {
	'use strict';

	//var enquiry = new Enquiry();
	// This will get cached by the require stack, so next time we require this file we
	// should get the one that exists already in the current invocation of the app
	return new Enquiry();
});