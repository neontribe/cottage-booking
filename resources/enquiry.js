/**
 * Avail describes the singleton that will contain the availability
 * information for the cottage this app is constructed for
 * @return {[type]} [description]
 */
define(['can', 'models/enquiry'], function( can, Availability ) {
	'use strict';

	// Initialize the avail store and setup the getter using can.compute
	var getAvail = can.compute(function( fetch ) {
			// This getterSetter function will attempt to fetch the data if we pass _anything_ truthy to this function
			var self = this;
			if( fetch ) {
				// TODO: sort out prop ref store, maybe use the fetch value
				Availability.findOne({ propRef: 'some prop ref' }).done(function( availabilityList ) {
					self.attr('list', availabilityList);
				});
			} else {
				return this.attr('list');
			}
		// create a new observable object to store the list on, so events propagate correctly
		}, new can.Observe({}));

	// Kick off the fetch
	getAvail( true );

	// Return the compute wrapped object, so we can listen for changes
	return getAvail;
});