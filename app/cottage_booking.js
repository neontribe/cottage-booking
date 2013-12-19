define([
    'can/util/string',
    'controls/calendar/calendar', // TODO: Move these two things into a model init or something so we only load one file
    'resources/enquiry',
    'resources/book',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route'
], function(can, Calendar, enquiry, book ) {
    'use strict';

    var init = false,
        components = [
            {
                page: 'calendar',
                control: Calendar
            }
        ],
        BookingPath;
    /* -==== router and main controller ====- */
    BookingPath = can.Control({
        pluginName: 'booking_path',

        defaults: {
            enquiry: enquiry,
            book: book
        }

    }, {

        init: function() {
            this.options.enquiry.attr( 'propRef', this.options.propref );

            new Calendar(this.element);
            can.route.ready();
        },

        ':page/:id route': function() {
            console.log.apply(console, arguments);
        },

        '{book} change': function() {
            console.log.apply( console, arguments);
            // If we already have a booking unbind/off
            if( this.options.booking ) {

            }

            this.options.booking = this.options.book();

            // Then rebind

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