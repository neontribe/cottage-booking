/**
 * Avail describes the singleton that will contain the availability
 * information for the cottage this app is constructed for
 * @return {can.compute} The can.compute wrapped object
 */
define(['can/util/string', 'models/availability'], function( can, Availability ) {
	'use strict';

	// Initialize the avail store and setup the getter using can.compute
	var getAvail = can.compute(function( fetch ) {
			// This getterSetter function will attempt to fetch the data if we pass _anything_ truthy to this function
			var self = this;
			if( fetch ) {
				// TODO: sort out prop ref store, maybe use the fetch value
				return Availability.findOne({ propRef: 'some prop ref' }).done(function( availabilityList ) {
					self.attr('list', availabilityList);
				});
			} else {
				if( !this.attr('list') ) {
					this.attr('list', new Availability());
				}
				return this.attr('list');
			}
		// create a new observable object to store the list on, so events propagate correctly
		}, new can.Observe({}));

	// Kick off the fetch
	getAvail( true );

	// Return the compute wrapped object, so we can listen for changes
	return getAvail;
});