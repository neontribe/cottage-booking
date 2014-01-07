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
        stages = {
            'calendar': {
                'Control': Calendar
            },
            'details': {
                'Control': Details
            }
        },
        BookingPath;
    /* -==== router and main controller ====- */
    BookingPath = can.Control({
        pluginName: 'booking_path',

        defaults: {
            enquiry: enquiry,
            book: book,
            stages: stages
        }

    }, {

        init: function() {
            this.options.enquiry.attr( 'propRef', this.options.propRef );

            can.route.ready();
        },

        applyStage: function( stageName ) {
            var stage = this.options.stages[ stageName ],
                $el = stage.element;

            if( !stage ) {
                can.route.attr('page', 'calendar');
                return;
            }

            if( !$el ) {
                $el = stage.element = can.$('<div class="controller ' + stageName + '" >').appendTo( this.element );
            }

            this.element.find('> .active').each(function() {
                can.$( this )
                    .removeClass('active')
                    .control().destroy();
            });

            new stage.Control( $el.addClass('active') );
        },

        changeStage: function( newStage ) {
            var chosenStage = this.options.stages[ newStage ] || this.options.stages.details;


        },

        // Empty route
        'route': function() {
            can.route.attr('page', 'details');
        },

        // We only have a page on the hash-bang, _usually_ only happens when we don't have a booking
        ':page route': function( routeData ) {
            this.changeStage( routeData.page );
        },

        '{can.route} booking': function( routeAttr ) {
            var id = routeAttr.booking;

            if( id ) {

                if( this.options.book.attr('bookingId') !== id ) {
                    this.options.book.fetchBooking( id ).fail(function() {
                        // We assume all failures are due to booking not found
                        can.route.removeAttr('booking');
                    });

                    can.route.attr('page', 'details');
                }

            } else {
                this.options.book.reset();
            }

        },

        ':page/:booking route': function( routeAttr ) {

        },

        '{book} bookingId': function( obj, evt, newVal ) {
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