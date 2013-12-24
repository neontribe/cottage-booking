define([
    'can/util/string',
    'controls/calendar/calendar', // TODO: Move these two things into a model init or something so we only load one file
    'controls/details/details',
    'resources/enquiry',
    'resources/book',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route'
], function(can, Calendar, Details, enquiry, book ) {
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
            this.options.enquiry.attr( 'propRef', this.options.propRef );

            new Calendar(this.element);
            can.route.ready();
        },

        // ':page route': function() {
        //     console.log('Page changed!');
        //     console.log.apply( console, arguments );
        // },

        ':booking route': function( routeAttr ) {
            console.log('booking changed!');
            console.log.apply(console, arguments);
            var id = routeAttr.booking;

            if( id ) {

                if( this.options.book.attr('bookingId') !== id ) {
                    book.fetchBooking( id ).fail(function() {
                        // We assume all failures are due to booking not found
                        can.route.removeAttr('booking');
                        book.reset();
                    });
                }

            }


        },

        '{book} bookingId': function( obj, evt, newVal ) {
            console.log.apply(console, arguments);
            can.route.attr('booking', newVal);
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