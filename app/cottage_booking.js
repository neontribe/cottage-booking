define([
    'can/util/string',
    'controls/calendar/calendar', // TODO: Move these two things into a model init or something so we only load one file
    'resources/enquiry',

    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route'
], function(can, Calendar, enquiry) {
    'use strict';

    var init = false,
        components = [
            {
                page: 'calendar',
                control: Calendar
            }
        ],
        BookingPath;

    BookingPath = can.Control({
        pluginName: 'booking_path',

        defaults: {
            enquiry: enquiry
        }

    }, {

        init: function() {
            this.options.enquiry.attr( 'propRef', this.options.propref );

            new Calendar(this.element);
            can.route.ready();
        },

        ':page/:id route': function() {
            console.log.apply(console, arguments);
        }
    });

    // Initialise app on the cottage-booking element
    // Plugin initialization
    can.$('[data-bplugin]').each(function() {
        var $this = can.$( this ),
            plugin = $this.data('bplugin');

        init = $this[ plugin ];

        init.call( $this, $this.data() );
    });

    if( !init ) {
        // TODO: investigate a different approach
        // So the user can execute the plugins manually if they want
        // Or maybe just show a warning ( if ( !init && console.warn ) ...)
        throw new Error('This App expected markup that wasn\'t found!');
    }

    // Return the booking path to match amd format
    return BookingPath;
});